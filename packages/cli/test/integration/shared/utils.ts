import { randomBytes } from 'crypto';
import { existsSync } from 'fs';
import express = require('express');
import * as superagent from 'superagent';
import * as request from 'supertest';
import { URL } from 'url';
import bodyParser = require('body-parser');
import * as util from 'util';
import { createTestAccount } from 'nodemailer';
import { v4 as uuid } from 'uuid';
import { LoggerProxy } from 'n8n-workflow';
import { Credentials, UserSettings } from 'n8n-core';
import { createConnection, getConnection } from 'typeorm';

import config = require('../../../config');
import {
	AUTHLESS_ENDPOINTS,
	BOOTSTRAP_MYSQL_CONNECTION_NAME,
	BOOTSTRAP_POSTGRES_CONNECTION_NAME,
	REST_PATH_SEGMENT,
} from './constants';
import { AUTH_COOKIE_NAME } from '../../../src/constants';
import { addRoutes as authMiddleware } from '../../../src/UserManagement/routes';
import {
	DatabaseType,
	Db,
	ExternalHooks,
	ICredentialsDb,
	IDatabaseCollections,
} from '../../../src';
import { meNamespace as meEndpoints } from '../../../src/UserManagement/routes/me';
import { usersNamespace as usersEndpoints } from '../../../src/UserManagement/routes/users';
import { authenticationMethods as authEndpoints } from '../../../src/UserManagement/routes/auth';
import { ownerNamespace as ownerEndpoints } from '../../../src/UserManagement/routes/owner';
import { passwordResetNamespace as passwordResetEndpoints } from '../../../src/UserManagement/routes/passwordReset';
import { issueJWT } from '../../../src/UserManagement/auth/jwt';
import { randomEmail, randomValidPassword, randomName } from './random';
import { getLogger } from '../../../src/Logger';
import { CredentialsEntity } from '../../../src/databases/entities/CredentialsEntity';
import { RESPONSE_ERROR_MESSAGES } from '../../../src/constants';

import type { Role } from '../../../src/databases/entities/Role';
import type { User } from '../../../src/databases/entities/User';
import type { CredentialPayload, EndpointGroup, SmtpTestAccount } from './types';
import {
	getBootstrapMySqlOptions,
	getMySqlOptions,
	getPostgresOptions,
	getSqliteOptions,
} from './connectionOptions';
import { credentialsController } from '../../../src/api/credentials.api';
import type { N8nApp } from '../../../src/UserManagement/Interfaces';

export const isTestRun = process.argv[1].split('/').includes('jest'); // TODO: Phase out

// ----------------------------------
//            test server
// ----------------------------------

export const initLogger = () => {
	config.set('logs.output', 'file'); // declutter console output
	LoggerProxy.init(getLogger());
};

/**
 * Initialize a test server to make requests to.
 *
 * @param applyAuth Whether to apply auth middleware to the test server.
 * @param endpointGroups Groups of endpoints to apply to the test server.
 */
export function initTestServer({
	applyAuth,
	endpointGroups,
}: {
	applyAuth: boolean;
	endpointGroups?: EndpointGroup[];
}) {
	const testServer = {
		app: express(),
		restEndpoint: REST_PATH_SEGMENT,
		...(endpointGroups?.includes('credentials') ? { externalHooks: ExternalHooks() } : {}),
	};

	testServer.app.use(bodyParser.json());
	testServer.app.use(bodyParser.urlencoded({ extended: true }));

	config.set('userManagement.jwtSecret', 'My JWT secret');
	config.set('userManagement.isInstanceOwnerSetUp', false);

	if (applyAuth) {
		authMiddleware.apply(testServer, [AUTHLESS_ENDPOINTS, REST_PATH_SEGMENT]);
	}

	if (!endpointGroups) return testServer.app;

	const [routerEndpoints, functionEndpoints] = classifyEndpointGroups(endpointGroups);

	if (routerEndpoints.length) {
		const map: Record<string, express.Router> = {
			credentials: credentialsController,
		};

		for (const group of routerEndpoints) {
			testServer.app.use(`/${testServer.restEndpoint}/${group}`, map[group]);
		}
	}

	if (functionEndpoints.length) {
		const map: Record<string, (this: N8nApp) => void> = {
			me: meEndpoints,
			users: usersEndpoints,
			auth: authEndpoints,
			owner: ownerEndpoints,
			passwordReset: passwordResetEndpoints,
		};

		for (const group of functionEndpoints) {
			map[group].apply(testServer);
		}
	}

	return testServer.app;
}

const classifyEndpointGroups = (endpointGroups: string[]) => {
	const routerEndpoints: string[] = [];
	const functionEndpoints: string[] = [];

	endpointGroups.forEach((group) =>
		(group === 'credentials' ? routerEndpoints : functionEndpoints).push(group),
	);

	return [routerEndpoints, functionEndpoints];
};

// ----------------------------------
//          initializers
// ----------------------------------

/**
 * Initialize a silent logger for test runs.
 */
export function initTestLogger() {
	config.set('logs.output', 'file');
	LoggerProxy.init(getLogger());
}

/**
 * Initialize a user settings config file if non-existent.
 */
export function initConfigFile() {
	const settingsPath = UserSettings.getUserSettingsPath();

	if (!existsSync(settingsPath)) {
		const userSettings = { encryptionKey: randomBytes(24).toString('base64') };
		UserSettings.writeUserSettings(userSettings, settingsPath);
	}
}

// ----------------------------------
//            test DB
// ----------------------------------

export async function initTestDb() {
	const dbType = config.get('database.type') as DatabaseType;

	if (dbType === 'sqlite') {
		const testDbName = `n8n_test_sqlite_${Date.now()}`;
		await Db.init(getSqliteOptions({ name: testDbName }));
		await getConnection(testDbName).runMigrations({ transaction: 'none' });

		return { testDbName };
	}

	if (dbType === 'postgresdb') {
		const username = config.get('database.postgresdb.user');
		const password = config.get('database.postgresdb.password');
		const host = config.get('database.postgresdb.host');
		const port = config.get('database.postgresdb.port');
		const schema = config.get('database.postgresdb.schema');

		await createConnection({
			name: BOOTSTRAP_POSTGRES_CONNECTION_NAME,
			type: 'postgres',
			database: 'postgres', // pre-existing
			host,
			port,
			username,
			password,
			schema,
		});

		const testDbName = `n8n_test_pg_${Date.now()}`;
		await getConnection(BOOTSTRAP_POSTGRES_CONNECTION_NAME).query(`CREATE DATABASE ${testDbName};`);

		await Db.init(getPostgresOptions({ name: testDbName }));

		return { testDbName };
	}

	if (dbType === 'mysqldb') {
		const bootstrapMysql = await createConnection(getBootstrapMySqlOptions());

		const testDbName = `n8n_test_mysql_${Date.now()}`;
		await bootstrapMysql.query(`CREATE DATABASE ${testDbName};`);

		await Db.init(getMySqlOptions({ name: testDbName }));

		return { testDbName };
	}

	throw new Error(`Unrecognized DB type: ${dbType}`);
}

export async function terminateTestDb(testDbName: string) {
	const dbType = config.get('database.type') as DatabaseType;

	if (dbType === 'sqlite') {
		await getConnection(testDbName).close();
	}

	if (dbType === 'postgresdb') {
		await getConnection(testDbName).close();

		const bootstrapPostgres = getConnection(BOOTSTRAP_POSTGRES_CONNECTION_NAME);
		await bootstrapPostgres.query(`DROP DATABASE ${testDbName}`);
		await bootstrapPostgres.close();
	}

	if (dbType === 'mysqldb') {
		await getConnection(testDbName).close();

		const bootstrapMySql = getConnection(BOOTSTRAP_MYSQL_CONNECTION_NAME);
		await bootstrapMySql.query(`DROP DATABASE ${testDbName}`);
		await bootstrapMySql.close();
	}
}

/**
 * Truncate tables for an array of entities.
 *
 * @param entities Array of entity names whose tables to truncate.
 * @param testDbName Name of the test DB to truncate tables in.
 */
export async function truncate(entities: Array<keyof IDatabaseCollections>, testDbName: string) {
	const dbType = config.get('database.type');

	if (dbType === 'sqlite') {
		const testDb = getConnection(testDbName);
		await testDb.query('PRAGMA foreign_keys=OFF');
		await Promise.all(entities.map((entity) => Db.collections[entity]!.clear()));
		return testDb.query('PRAGMA foreign_keys=ON');
	}

	if (dbType === 'postgresdb') {
		const map: { [K in keyof IDatabaseCollections]: string } = {
			Credentials: 'credentials_entity',
			Workflow: 'workflow_entity',
			Execution: 'execution_entity',
			Tag: 'tag_entity',
			Webhook: 'webhook_entity',
			Role: 'role',
			User: 'user',
			SharedCredentials: 'shared_credentials',
			SharedWorkflow: 'shared_workflow',
			Settings: 'settings',
		};

		return Promise.all(
			entities.map((entity) =>
				getConnection(testDbName).query(
					`TRUNCATE TABLE "${map[entity]}" RESTART IDENTITY CASCADE;`,
				),
			),
		);
	}

	if (dbType === 'mysqldb') {
		await Promise.all(
			entities.map(async (entity) => {
				await Db.collections[entity]!.delete({});
			}),
		);
	}
}

export function affixRoleToSaveCredential(role: Role) {
	return (credentialPayload: CredentialPayload, { user }: { user: User }) =>
		saveCredential(credentialPayload, { user, role });
}

/**
 * Save a credential to the DB, sharing it with a user.
 */
async function saveCredential(
	credentialPayload: CredentialPayload,
	{ user, role }: { user: User; role: Role },
) {
	const newCredential = new CredentialsEntity();

	Object.assign(newCredential, credentialPayload);

	const encryptedData = await encryptCredentialData(newCredential);

	Object.assign(newCredential, encryptedData);

	const savedCredential = await Db.collections.Credentials!.save(newCredential);

	savedCredential.data = newCredential.data;

	await Db.collections.SharedCredentials!.save({
		user,
		credentials: savedCredential,
		role,
	});

	return savedCredential;
}

/**
 * Store a user in the DB, defaulting to a `member`.
 */
export async function createUser(
	{
		id,
		email,
		password,
		firstName,
		lastName,
		role,
	}: {
		id: string;
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		role?: Role;
	} = {
		id: uuid(),
		email: randomEmail(),
		password: randomValidPassword(),
		firstName: randomName(),
		lastName: randomName(),
	},
) {
	const globalRole = role ?? (await getGlobalMemberRole());
	return Db.collections.User!.save({
		id,
		email,
		password,
		firstName,
		lastName,
		globalRole,
	});
}

export async function createOwnerShell() {
	const globalRole = await getGlobalOwnerRole();
	return Db.collections.User!.save({ globalRole });
}

export async function createMemberShell() {
	const globalRole = await getGlobalMemberRole();
	return Db.collections.User!.save({ globalRole });
}

export async function getGlobalOwnerRole() {
	return await Db.collections.Role!.findOneOrFail({
		name: 'owner',
		scope: 'global',
	});
}

export async function getGlobalMemberRole() {
	return await Db.collections.Role!.findOneOrFail({
		name: 'member',
		scope: 'global',
	});
}

export async function getWorkflowOwnerRole() {
	return await Db.collections.Role!.findOneOrFail({
		name: 'owner',
		scope: 'workflow',
	});
}

export async function getCredentialOwnerRole() {
	return await Db.collections.Role!.findOneOrFail({
		name: 'owner',
		scope: 'credential',
	});
}

export function getAllRoles() {
	return Promise.all([
		getGlobalOwnerRole(),
		getGlobalMemberRole(),
		getWorkflowOwnerRole(),
		getCredentialOwnerRole(),
	]);
}

// ----------------------------------
//           request agent
// ----------------------------------

/**
 * Create a request agent, optionally with an auth cookie.
 */
export async function createAgent(app: express.Application, options?: { auth: true; user: User }) {
	const agent = request.agent(app);
	agent.use(prefix(REST_PATH_SEGMENT));

	if (options?.auth && options?.user) {
		const { token } = await issueJWT(options.user);
		agent.jar.setCookie(`${AUTH_COOKIE_NAME}=${token}`);
	}

	return agent;
}

/**
 * Plugin to prefix a path segment into a request URL pathname.
 *
 * Example: http://127.0.0.1:62100/me/password → http://127.0.0.1:62100/rest/me/password
 */
export function prefix(pathSegment: string) {
	return function (request: superagent.SuperAgentRequest) {
		const url = new URL(request.url);

		// enforce consistency at call sites
		if (url.pathname[0] !== '/') {
			throw new Error('Pathname must start with a forward slash');
		}

		url.pathname = pathSegment + url.pathname;
		request.url = url.toString();

		return request;
	};
}

/**
 * Extract the value (token) of the auth cookie in a response.
 */
export function getAuthToken(response: request.Response, authCookieName = AUTH_COOKIE_NAME) {
	const cookies: string[] = response.headers['set-cookie'];

	if (!cookies) {
		throw new Error("No 'set-cookie' header found in response");
	}

	const authCookie = cookies.find((c) => c.startsWith(`${authCookieName}=`));

	if (!authCookie) return undefined;

	const match = authCookie.match(new RegExp(`(^| )${authCookieName}=(?<token>[^;]+)`));

	if (!match || !match.groups) return undefined;

	return match.groups.token;
}

// ----------------------------------
//            settings
// ----------------------------------

export async function isInstanceOwnerSetUp() {
	const { value } = await Db.collections.Settings!.findOneOrFail({
		key: 'userManagement.isInstanceOwnerSetUp',
	});

	return Boolean(value);
}

// ----------------------------------
//              SMTP
// ----------------------------------

/**
 * Get an SMTP test account from https://ethereal.email to test sending emails.
 */
export const getSmtpTestAccount = util.promisify<SmtpTestAccount>(createTestAccount);

// ----------------------------------
//            encryption
// ----------------------------------

async function encryptCredentialData(credential: CredentialsEntity) {
	const encryptionKey = await UserSettings.getEncryptionKey();

	if (!encryptionKey) {
		throw new Error(RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY);
	}

	const coreCredential = new Credentials(
		{ id: null, name: credential.name },
		credential.type,
		credential.nodesAccess,
	);

	// @ts-ignore
	coreCredential.setData(credential.data, encryptionKey);

	return coreCredential.getDataToSave() as ICredentialsDb;
}

/**
 * Remove quote-escaping backslashes added by Postgres.
 */
export const toObject = (json: string) => {
	return typeof json === 'string' ? JSON.parse(json) : json;
};
