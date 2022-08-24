import express from 'express';
import { UserSettings } from 'n8n-core';

import { Db } from '../../src';
import { RESPONSE_ERROR_MESSAGES } from '../../src/constants';
import { randomCredentialPayload, randomName, randomString } from './shared/random';
import * as testDb from './shared/testDb';
import * as utils from './shared/utils';

import type { AuthAgent, SaveCredentialFunction } from './shared/types';
import type { Role } from '../../src/databases/entities/Role';
import { CredentialsEntity } from '../../src/databases/entities/CredentialsEntity';

jest.mock('../../src/telemetry');

let app: express.Application;
let testDbName = '';
let globalOwnerRole: Role;
let globalMemberRole: Role;
let saveCredential: SaveCredentialFunction;
let authAgent: AuthAgent;

beforeAll(async () => {
	app = await utils.initTestServer({
		endpointGroups: ['credentials'],
		applyAuth: true,
	});
	const initResult = await testDb.init();
	testDbName = initResult.testDbName;

	utils.initConfigFile();

	globalOwnerRole = await testDb.getGlobalOwnerRole();
	globalMemberRole = await testDb.getGlobalMemberRole();
	const credentialOwnerRole = await testDb.getCredentialOwnerRole();

	saveCredential = testDb.affixRoleToSaveCredential(credentialOwnerRole);

	authAgent = utils.createAuthAgent(app);

	utils.initTestLogger();
	utils.initTestTelemetry();
});

beforeEach(async () => {
	await testDb.truncate(['User', 'SharedCredentials', 'Credentials'], testDbName);
});

afterAll(async () => {
	await testDb.terminate(testDbName);
});

test('POST /credentials should create cred', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);

	const payload = randomCredentialPayload();

	const response = await authAgent(ownerShell).post('/credentials').send(payload);

	expect(response.statusCode).toBe(200);

	const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;

	expect(name).toBe(payload.name);
	expect(type).toBe(payload.type);
	if (!payload.nodesAccess) {
		fail('Payload did not contain a nodesAccess array');
	}
	expect(nodesAccess[0].nodeType).toBe(payload.nodesAccess[0].nodeType);
	expect(encryptedData).not.toBe(payload.data);

	const credential = await Db.collections.Credentials.findOneOrFail(id);

	expect(credential.name).toBe(payload.name);
	expect(credential.type).toBe(payload.type);
	expect(credential.nodesAccess[0].nodeType).toBe(payload.nodesAccess![0].nodeType);
	expect(credential.data).not.toBe(payload.data);

	const sharedCredential = await Db.collections.SharedCredentials.findOneOrFail({
		relations: ['user', 'credentials'],
		where: { credentials: credential },
	});

	expect(sharedCredential.user.id).toBe(ownerShell.id);
	expect(sharedCredential.credentials.name).toBe(payload.name);
});

test('POST /credentials should fail with invalid inputs', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const authOwnerAgent = authAgent(ownerShell);

	await Promise.all(
		INVALID_PAYLOADS.map(async (invalidPayload) => {
			const response = await authOwnerAgent.post('/credentials').send(invalidPayload);
			expect(response.statusCode).toBe(400);
		}),
	);
});

test('POST /credentials should fail with missing encryption key', async () => {
	const mock = jest.spyOn(UserSettings, 'getEncryptionKey');
	mock.mockRejectedValue(new Error(RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));

	const ownerShell = await testDb.createUserShell(globalOwnerRole);

	const response = await authAgent(ownerShell).post('/credentials').send(randomCredentialPayload());

	expect(response.statusCode).toBe(500);

	mock.mockRestore();
});

test('POST /credentials should ignore ID in payload', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const authOwnerAgent = authAgent(ownerShell);

	const firstResponse = await authOwnerAgent
		.post('/credentials')
		.send({ id: '8', ...randomCredentialPayload() });

	expect(firstResponse.body.data.id).not.toBe('8');

	const secondResponse = await authOwnerAgent
		.post('/credentials')
		.send({ id: 8, ...randomCredentialPayload() });

	expect(secondResponse.body.data.id).not.toBe(8);
});

test('DELETE /credentials/:id should delete owned cred for owner', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });

	const response = await authAgent(ownerShell).delete(`/credentials/${savedCredential.id}`);

	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual({ data: true });

	const deletedCredential = await Db.collections.Credentials.findOne(savedCredential.id);

	expect(deletedCredential).toBeUndefined(); // deleted

	const deletedSharedCredential = await Db.collections.SharedCredentials.findOne();

	expect(deletedSharedCredential).toBeUndefined(); // deleted
});

test('DELETE /credentials/:id should delete non-owned cred for owner', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: member });

	const response = await authAgent(ownerShell).delete(`/credentials/${savedCredential.id}`);

	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual({ data: true });

	const deletedCredential = await Db.collections.Credentials.findOne(savedCredential.id);

	expect(deletedCredential).toBeUndefined(); // deleted

	const deletedSharedCredential = await Db.collections.SharedCredentials.findOne();

	expect(deletedSharedCredential).toBeUndefined(); // deleted
});

test('DELETE /credentials/:id should delete owned cred for member', async () => {
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: member });

	const response = await authAgent(member).delete(`/credentials/${savedCredential.id}`);

	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual({ data: true });

	const deletedCredential = await Db.collections.Credentials.findOne(savedCredential.id);

	expect(deletedCredential).toBeUndefined(); // deleted

	const deletedSharedCredential = await Db.collections.SharedCredentials.findOne();

	expect(deletedSharedCredential).toBeUndefined(); // deleted
});

test('DELETE /credentials/:id should not delete non-owned cred for member', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });

	const response = await authAgent(member).delete(`/credentials/${savedCredential.id}`);

	expect(response.statusCode).toBe(404);

	const shellCredential = await Db.collections.Credentials.findOne(savedCredential.id);

	expect(shellCredential).toBeDefined(); // not deleted

	const deletedSharedCredential = await Db.collections.SharedCredentials.findOne();

	expect(deletedSharedCredential).toBeDefined(); // not deleted
});

test('DELETE /credentials/:id should fail if cred not found', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);

	const response = await authAgent(ownerShell).delete('/credentials/123');

	expect(response.statusCode).toBe(404);
});

test('PATCH /credentials/:id should update owned cred for owner', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });
	const patchPayload = randomCredentialPayload();

	const response = await authAgent(ownerShell)
		.patch(`/credentials/${savedCredential.id}`)
		.send(patchPayload);

	expect(response.statusCode).toBe(200);

	const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;

	expect(name).toBe(patchPayload.name);
	expect(type).toBe(patchPayload.type);
	if (!patchPayload.nodesAccess) {
		fail('Payload did not contain a nodesAccess array');
	}
	expect(nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);

	expect(encryptedData).not.toBe(patchPayload.data);

	const credential = await Db.collections.Credentials.findOneOrFail(id);

	expect(credential.name).toBe(patchPayload.name);
	expect(credential.type).toBe(patchPayload.type);
	expect(credential.nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess![0].nodeType);
	expect(credential.data).not.toBe(patchPayload.data);

	const sharedCredential = await Db.collections.SharedCredentials.findOneOrFail({
		relations: ['credentials'],
		where: { credentials: credential },
	});

	expect(sharedCredential.credentials.name).toBe(patchPayload.name); // updated
});

test('PATCH /credentials/:id should update non-owned cred for owner', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: member });
	const patchPayload = randomCredentialPayload();

	const response = await authAgent(ownerShell)
		.patch(`/credentials/${savedCredential.id}`)
		.send(patchPayload);

	expect(response.statusCode).toBe(200);

	const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;

	expect(name).toBe(patchPayload.name);
	expect(type).toBe(patchPayload.type);

	if (!patchPayload.nodesAccess) {
		fail('Payload did not contain a nodesAccess array');
	}
	expect(nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);

	expect(encryptedData).not.toBe(patchPayload.data);

	const credential = await Db.collections.Credentials.findOneOrFail(id);

	expect(credential.name).toBe(patchPayload.name);
	expect(credential.type).toBe(patchPayload.type);
	expect(credential.nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess![0].nodeType);
	expect(credential.data).not.toBe(patchPayload.data);

	const sharedCredential = await Db.collections.SharedCredentials.findOneOrFail({
		relations: ['credentials'],
		where: { credentials: credential },
	});

	expect(sharedCredential.credentials.name).toBe(patchPayload.name); // updated
});

test('PATCH /credentials/:id should update owned cred for member', async () => {
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: member });
	const patchPayload = randomCredentialPayload();

	const response = await authAgent(member)
		.patch(`/credentials/${savedCredential.id}`)
		.send(patchPayload);

	expect(response.statusCode).toBe(200);

	const { id, name, type, nodesAccess, data: encryptedData } = response.body.data;

	expect(name).toBe(patchPayload.name);
	expect(type).toBe(patchPayload.type);

	if (!patchPayload.nodesAccess) {
		fail('Payload did not contain a nodesAccess array');
	}
	expect(nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess[0].nodeType);

	expect(encryptedData).not.toBe(patchPayload.data);

	const credential = await Db.collections.Credentials.findOneOrFail(id);

	expect(credential.name).toBe(patchPayload.name);
	expect(credential.type).toBe(patchPayload.type);
	expect(credential.nodesAccess[0].nodeType).toBe(patchPayload.nodesAccess![0].nodeType);
	expect(credential.data).not.toBe(patchPayload.data);

	const sharedCredential = await Db.collections.SharedCredentials.findOneOrFail({
		relations: ['credentials'],
		where: { credentials: credential },
	});

	expect(sharedCredential.credentials.name).toBe(patchPayload.name); // updated
});

test('PATCH /credentials/:id should not update non-owned cred for member', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });
	const patchPayload = randomCredentialPayload();

	const response = await authAgent(member)
		.patch(`/credentials/${savedCredential.id}`)
		.send(patchPayload);

	expect(response.statusCode).toBe(404);

	const shellCredential = await Db.collections.Credentials.findOneOrFail(savedCredential.id);

	expect(shellCredential.name).not.toBe(patchPayload.name); // not updated
});

test('PATCH /credentials/:id should fail with invalid inputs', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const authOwnerAgent = authAgent(ownerShell);
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });

	await Promise.all(
		INVALID_PAYLOADS.map(async (invalidPayload) => {
			const response = await authOwnerAgent
				.patch(`/credentials/${savedCredential.id}`)
				.send(invalidPayload);

			if (response.statusCode === 500) {
				console.log(response.statusCode, response.body);
			}
			expect(response.statusCode).toBe(400);
		}),
	);
});

test('PATCH /credentials/:id should fail if cred not found', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);

	const response = await authAgent(ownerShell)
		.patch('/credentials/123')
		.send(randomCredentialPayload());

	expect(response.statusCode).toBe(404);
});

test('PATCH /credentials/:id should fail with missing encryption key', async () => {
	const mock = jest.spyOn(UserSettings, 'getEncryptionKey');
	mock.mockRejectedValue(new Error(RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));

	const ownerShell = await testDb.createUserShell(globalOwnerRole);

	const response = await authAgent(ownerShell).post('/credentials').send(randomCredentialPayload());

	expect(response.statusCode).toBe(500);

	mock.mockRestore();
});

test('GET /credentials should return all creds for owner', async () => {
	const owner = await testDb.createUser({ globalRole: globalOwnerRole });
	const firstMember = await testDb.createUser({ globalRole: globalMemberRole });
	const secondMember = await testDb.createUser({ globalRole: globalMemberRole });

	const { id } = await saveCredential(randomCredentialPayload(), { user: owner });
	await saveCredential(randomCredentialPayload(), { user: firstMember });

	await authAgent(owner).post(`/credentials/${id}/share`).send({ shareeId: firstMember.id });
	await authAgent(owner).post(`/credentials/${id}/share`).send({ shareeId: secondMember.id });

	const response = await authAgent(owner).get('/credentials');

	expect(response.statusCode).toBe(200);
	expect(response.body.data.length).toBe(2); // owner retrieved owner cred and member cred

	const [ownerCredential, memberCredential] = response.body.data;

	validateMainCredentialData(ownerCredential);
	validateMainCredentialData(memberCredential);

	expect(ownerCredential.ownedBy).toMatchObject({
		id: owner.id,
		email: owner.email,
		firstName: owner.firstName,
		lastName: owner.lastName,
	});

	expect(Array.isArray(ownerCredential.sharedWith)).toBe(true);
	expect(ownerCredential.sharedWith.length).toBe(2);

	const [firstSharee, secondSharee] = ownerCredential.sharedWith;

	expect(firstSharee).toMatchObject({
		id: firstMember.id,
		email: firstMember.email,
		firstName: firstMember.firstName,
		lastName: firstMember.lastName,
	});

	expect(secondSharee).toMatchObject({
		id: secondMember.id,
		email: secondMember.email,
		firstName: secondMember.firstName,
		lastName: secondMember.lastName,
	});

	expect(memberCredential.ownedBy).toMatchObject({
		id: firstMember.id,
		email: firstMember.email,
		firstName: firstMember.firstName,
		lastName: firstMember.lastName,
	});

	expect(Array.isArray(memberCredential.sharedWith)).toBe(true);
	expect(memberCredential.sharedWith.length).toBe(0);
});

test('GET /credentials should return only relevant creds for member', async () => {
	const owner = await testDb.createUser({ globalRole: globalOwnerRole });
	const member = await testDb.createUser({ globalRole: globalMemberRole });

	await saveCredential(randomCredentialPayload(), { user: owner });
	const { id } = await saveCredential(randomCredentialPayload(), { user: member });

	await authAgent(member).post(`/credentials/${id}/share`).send({ shareeId: owner.id });

	const response = await authAgent(member).get('/credentials');

	expect(response.statusCode).toBe(200);
	expect(response.body.data.length).toBe(1); // member retrieved only member cred

	const [memberCredential] = response.body.data;

	validateMainCredentialData(memberCredential);

	expect(memberCredential.ownedBy).toMatchObject({
		id: member.id,
		email: member.email,
		firstName: member.firstName,
		lastName: member.lastName,
	});

	expect(Array.isArray(memberCredential.sharedWith)).toBe(true);
	expect(memberCredential.sharedWith.length).toBe(1);

	const [sharee] = memberCredential.sharedWith;

	expect(sharee).toMatchObject({
		id: owner.id,
		email: owner.email,
		firstName: owner.firstName,
		lastName: owner.lastName,
	});
});

test('GET /credentials/:id should retrieve owned cred for owner', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const authOwnerAgent = authAgent(ownerShell);
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });

	const firstResponse = await authOwnerAgent.get(`/credentials/${savedCredential.id}`);

	expect(firstResponse.statusCode).toBe(200);

	expect(typeof firstResponse.body.data.name).toBe('string');
	expect(typeof firstResponse.body.data.type).toBe('string');
	expect(typeof firstResponse.body.data.nodesAccess[0].nodeType).toBe('string');
	expect(firstResponse.body.data.data).toBeUndefined();

	const secondResponse = await authOwnerAgent
		.get(`/credentials/${savedCredential.id}`)
		.query({ includeData: true });

	expect(secondResponse.statusCode).toBe(200);
	expect(typeof secondResponse.body.data.name).toBe('string');
	expect(typeof secondResponse.body.data.type).toBe('string');
	expect(typeof secondResponse.body.data.nodesAccess[0].nodeType).toBe('string');
	expect(secondResponse.body.data.data).toBeDefined();
});

test('GET /credentials/:id should retrieve owned cred for member', async () => {
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const authMemberAgent = authAgent(member);
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: member });

	const firstResponse = await authMemberAgent.get(`/credentials/${savedCredential.id}`);

	expect(firstResponse.statusCode).toBe(200);

	expect(typeof firstResponse.body.data.name).toBe('string');
	expect(typeof firstResponse.body.data.type).toBe('string');
	expect(typeof firstResponse.body.data.nodesAccess[0].nodeType).toBe('string');
	expect(firstResponse.body.data.data).toBeUndefined();

	const secondResponse = await authMemberAgent
		.get(`/credentials/${savedCredential.id}`)
		.query({ includeData: true });

	expect(secondResponse.statusCode).toBe(200);

	expect(typeof secondResponse.body.data.name).toBe('string');
	expect(typeof secondResponse.body.data.type).toBe('string');
	expect(typeof secondResponse.body.data.nodesAccess[0].nodeType).toBe('string');
	expect(secondResponse.body.data.data).toBeDefined();
});

test('GET /credentials/:id should not retrieve non-owned cred for member', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const member = await testDb.createUser({ globalRole: globalMemberRole });
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });

	const response = await authAgent(member).get(`/credentials/${savedCredential.id}`);

	expect(response.statusCode).toBe(404);
	expect(response.body.data).toBeUndefined(); // owner's cred not returned
});

test('GET /credentials/:id should fail with missing encryption key', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);
	const savedCredential = await saveCredential(randomCredentialPayload(), { user: ownerShell });

	const mock = jest.spyOn(UserSettings, 'getEncryptionKey');
	mock.mockRejectedValue(new Error(RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY));

	const response = await authAgent(ownerShell)
		.get(`/credentials/${savedCredential.id}`)
		.query({ includeData: true });

	expect(response.statusCode).toBe(500);

	mock.mockRestore();
});

test('GET /credentials/:id should return 404 if cred not found', async () => {
	const ownerShell = await testDb.createUserShell(globalOwnerRole);

	const response = await authAgent(ownerShell).get('/credentials/789');

	expect(response.statusCode).toBe(404);
});

const INVALID_PAYLOADS = [
	{
		type: randomName(),
		nodesAccess: [{ nodeType: randomName() }],
		data: { accessToken: randomString(6, 16) },
	},
	{
		name: randomName(),
		nodesAccess: [{ nodeType: randomName() }],
		data: { accessToken: randomString(6, 16) },
	},
	{
		name: randomName(),
		type: randomName(),
		data: { accessToken: randomString(6, 16) },
	},
	{
		name: randomName(),
		type: randomName(),
		nodesAccess: [{ nodeType: randomName() }],
	},
	{},
	undefined,
];

function validateMainCredentialData(ownerCredential: CredentialsEntity) {
	expect(typeof ownerCredential.name).toBe('string');
	expect(typeof ownerCredential.type).toBe('string');
	expect(typeof ownerCredential.nodesAccess[0].nodeType).toBe('string');
	expect(ownerCredential.data).toBeUndefined();
}
