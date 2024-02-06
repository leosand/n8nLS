import Container from 'typedi';
import { hash } from 'bcryptjs';
import { AuthIdentity } from '@db/entities/AuthIdentity';
import type { GlobalRole, User } from '@db/entities/User';
import { AuthIdentityRepository } from '@db/repositories/authIdentity.repository';
import { UserRepository } from '@db/repositories/user.repository';
import { TOTPService } from '@/Mfa/totp.service';
import { MfaService } from '@/Mfa/mfa.service';

import { randomApiKey, randomEmail, randomName, randomValidPassword } from '../random';
import { UserService } from '@/services/user.service';

// pre-computed bcrypt hash for the string 'password', using `await hash('password', 10)`
const passwordHash = '$2a$10$njedH7S6V5898mj6p0Jr..IGY9Ms.qNwR7RbSzzX9yubJocKfvGGK';

/**
 * Store a user in the DB, defaulting to a `member`.
 */
export async function createUser(attributes: Partial<User> = {}): Promise<User> {
	const { email, password, firstName, lastName, role, ...rest } = attributes;
	const user = await Container.get(UserService).create({
		email: email ?? randomEmail(),
		password: password ? await hash(password, 1) : passwordHash,
		firstName: firstName ?? randomName(),
		lastName: lastName ?? randomName(),
		role: role ?? 'global:member',
		...rest,
	});
	user.computeIsOwner();

	return await Container.get(UserRepository).save(user);
}

export async function createLdapUser(attributes: Partial<User>, ldapId: string): Promise<User> {
	const user = await createUser(attributes);
	await Container.get(AuthIdentityRepository).save(AuthIdentity.create(user, ldapId, 'ldap'));
	return user;
}

export async function createUserWithMfaEnabled(
	data: { numberOfRecoveryCodes: number } = { numberOfRecoveryCodes: 10 },
) {
	const email = randomEmail();
	const password = randomValidPassword();

	const toptService = new TOTPService();

	const secret = toptService.generateSecret();

	const mfaService = Container.get(MfaService);

	const recoveryCodes = mfaService.generateRecoveryCodes(data.numberOfRecoveryCodes);

	const { encryptedSecret, encryptedRecoveryCodes } = mfaService.encryptSecretAndRecoveryCodes(
		secret,
		recoveryCodes,
	);

	return {
		user: await createUser({
			mfaEnabled: true,
			password,
			email,
			mfaSecret: encryptedSecret,
			mfaRecoveryCodes: encryptedRecoveryCodes,
		}),
		rawPassword: password,
		rawSecret: secret,
		rawRecoveryCodes: recoveryCodes,
	};
}

export async function createOwner() {
	return await createUser({ role: 'global:owner' });
}

export async function createMember() {
	return await createUser({ role: 'global:member' });
}

export async function createAdmin() {
	return await createUser({ role: 'global:admin' });
}

export async function createUserShell(role: GlobalRole): Promise<User> {
	const shell: Partial<User> = { role };

	if (role !== 'global:owner') {
		shell.email = randomEmail();
	}

	return await Container.get(UserService).create(shell);
}

/**
 * Create many users in the DB, defaulting to a `member`.
 */
export async function createManyUsers(
	amount: number,
	attributes: Partial<User> = {},
): Promise<User[]> {
	let { email, password, firstName, lastName, role, ...rest } = attributes;

	const users = await Promise.all(
		[...Array(amount)].map(
			async () =>
				await Container.get(UserService).create({
					email: email ?? randomEmail(),
					password: password ? await hash(password, 1) : passwordHash,
					firstName: firstName ?? randomName(),
					lastName: lastName ?? randomName(),
					role: role ?? 'global:member',
					...rest,
				}),
		),
	);

	return await Container.get(UserRepository).save(users);
}

export async function addApiKey(user: User): Promise<User> {
	user.apiKey = randomApiKey();
	return await Container.get(UserRepository).save(user);
}

export const getAllUsers = async () =>
	await Container.get(UserRepository).find({
		relations: ['authIdentities'],
	});

export const getUserById = async (id: string) =>
	await Container.get(UserRepository).findOneOrFail({
		where: { id },
		relations: ['authIdentities'],
	});

export const getLdapIdentities = async () =>
	await Container.get(AuthIdentityRepository).find({
		where: { providerType: 'ldap' },
		relations: ['user'],
	});
