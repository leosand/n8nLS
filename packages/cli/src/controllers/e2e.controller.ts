import type { PushMessage } from '@n8n/api-types';
import { Request } from 'express';
import { Logger } from 'n8n-core';
import Container from 'typedi';
import { v4 as uuid } from 'uuid';

import { ActiveWorkflowManager } from '@/active-workflow-manager';
import config from '@/config';
import { LICENSE_FEATURES, LICENSE_QUOTAS, UNLIMITED_LICENSE_QUOTA, inE2ETests } from '@/constants';
import { AuthUserRepository } from '@/databases/repositories/auth-user.repository';
import { SettingsRepository } from '@/databases/repositories/settings.repository';
import { UserRepository } from '@/databases/repositories/user.repository';
import { Patch, Post, RestController } from '@/decorators';
import { MessageEventBus } from '@/eventbus/message-event-bus/message-event-bus';
import type { BooleanLicenseFeature, NumericLicenseFeature } from '@/interfaces';
import type { FeatureReturnType } from '@/license';
import { License } from '@/license';
import { MfaService } from '@/mfa/mfa.service';
import { Push } from '@/push';
import { CacheService } from '@/services/cache/cache.service';
import { PasswordUtility } from '@/services/password.utility';

if (!inE2ETests) {
	Container.get(Logger).error('E2E endpoints only allowed during E2E tests');
	process.exit(1);
}

const tablesToTruncate = [
	'auth_identity',
	'auth_provider_sync_history',
	'credentials_entity',
	'event_destinations',
	'execution_entity',
	'installed_nodes',
	'installed_packages',
	'project',
	'project_relation',
	'settings',
	'shared_credentials',
	'shared_workflow',
	'tag_entity',
	'user',
	'variables',
	'webhook_entity',
	'workflow_entity',
	'workflow_statistics',
	'workflows_tags',
];

type UserSetupPayload = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	mfaEnabled?: boolean;
	mfaSecret?: string;
	mfaRecoveryCodes?: string[];
};

type ResetRequest = Request<
	{},
	{},
	{
		owner: UserSetupPayload;
		members: UserSetupPayload[];
		admin: UserSetupPayload;
	}
>;

type PushRequest = Request<
	{},
	{},
	{
		pushRef: string;
	} & PushMessage
>;

@RestController('/e2e')
export class E2EController {
	private enabledFeatures: Record<BooleanLicenseFeature, boolean> = {
		[LICENSE_FEATURES.SHARING]: false,
		[LICENSE_FEATURES.LDAP]: false,
		[LICENSE_FEATURES.SAML]: false,
		[LICENSE_FEATURES.LOG_STREAMING]: false,
		[LICENSE_FEATURES.ADVANCED_EXECUTION_FILTERS]: false,
		[LICENSE_FEATURES.SOURCE_CONTROL]: false,
		[LICENSE_FEATURES.VARIABLES]: false,
		[LICENSE_FEATURES.API_DISABLED]: false,
		[LICENSE_FEATURES.EXTERNAL_SECRETS]: false,
		[LICENSE_FEATURES.SHOW_NON_PROD_BANNER]: false,
		[LICENSE_FEATURES.WORKFLOW_HISTORY]: false,
		[LICENSE_FEATURES.DEBUG_IN_EDITOR]: false,
		[LICENSE_FEATURES.BINARY_DATA_S3]: false,
		[LICENSE_FEATURES.MULTIPLE_MAIN_INSTANCES]: false,
		[LICENSE_FEATURES.WORKER_VIEW]: false,
		[LICENSE_FEATURES.ADVANCED_PERMISSIONS]: false,
		[LICENSE_FEATURES.PROJECT_ROLE_ADMIN]: false,
		[LICENSE_FEATURES.PROJECT_ROLE_EDITOR]: false,
		[LICENSE_FEATURES.PROJECT_ROLE_VIEWER]: false,
		[LICENSE_FEATURES.AI_ASSISTANT]: false,
		[LICENSE_FEATURES.COMMUNITY_NODES_CUSTOM_REGISTRY]: false,
		[LICENSE_FEATURES.ASK_AI]: false,
	};

	private numericFeatures: Record<NumericLicenseFeature, number> = {
		[LICENSE_QUOTAS.TRIGGER_LIMIT]: -1,
		[LICENSE_QUOTAS.VARIABLES_LIMIT]: -1,
		[LICENSE_QUOTAS.USERS_LIMIT]: -1,
		[LICENSE_QUOTAS.WORKFLOW_HISTORY_PRUNE_LIMIT]: -1,
		[LICENSE_QUOTAS.TEAM_PROJECT_LIMIT]: 0,
	};

	constructor(
		license: License,
		private readonly settingsRepo: SettingsRepository,
		private readonly workflowRunner: ActiveWorkflowManager,
		private readonly mfaService: MfaService,
		private readonly cacheService: CacheService,
		private readonly push: Push,
		private readonly passwordUtility: PasswordUtility,
		private readonly eventBus: MessageEventBus,
		private readonly userRepository: UserRepository,
		private readonly authUserRepository: AuthUserRepository,
	) {
		license.isFeatureEnabled = (feature: BooleanLicenseFeature) =>
			this.enabledFeatures[feature] ?? false;

		// Ugly hack to satisfy biome parser
		const getFeatureValue = <T extends keyof FeatureReturnType>(
			feature: T,
		): FeatureReturnType[T] => {
			if (feature in this.numericFeatures) {
				return this.numericFeatures[feature as NumericLicenseFeature] as FeatureReturnType[T];
			} else {
				return UNLIMITED_LICENSE_QUOTA as FeatureReturnType[T];
			}
		};
		license.getFeatureValue = getFeatureValue;

		license.getPlanName = () => 'Enterprise';
	}

	@Post('/reset', { skipAuth: true })
	async reset(req: ResetRequest) {
		this.resetFeatures();
		await this.resetLogStreaming();
		await this.removeActiveWorkflows();
		await this.truncateAll();
		await this.resetCache();
		await this.setupUserManagement(req.body.owner, req.body.members, req.body.admin);
	}

	@Post('/push', { skipAuth: true })
	async pushSend(req: PushRequest) {
		const { pushRef: _, ...pushMsg } = req.body;
		this.push.broadcast(pushMsg);
	}

	@Patch('/feature', { skipAuth: true })
	setFeature(req: Request<{}, {}, { feature: BooleanLicenseFeature; enabled: boolean }>) {
		const { enabled, feature } = req.body;
		this.enabledFeatures[feature] = enabled;
	}

	@Patch('/quota', { skipAuth: true })
	setQuota(req: Request<{}, {}, { feature: NumericLicenseFeature; value: number }>) {
		const { value, feature } = req.body;
		this.numericFeatures[feature] = value;
	}

	@Patch('/queue-mode', { skipAuth: true })
	async setQueueMode(req: Request<{}, {}, { enabled: boolean }>) {
		const { enabled } = req.body;
		config.set('executions.mode', enabled ? 'queue' : 'regular');
		return { success: true, message: `Queue mode set to ${config.getEnv('executions.mode')}` };
	}

	private resetFeatures() {
		for (const feature of Object.keys(this.enabledFeatures)) {
			this.enabledFeatures[feature as BooleanLicenseFeature] = false;
		}
	}

	private async removeActiveWorkflows() {
		this.workflowRunner.removeAllQueuedWorkflowActivations();
		await this.workflowRunner.removeAll();
	}

	private async resetLogStreaming() {
		for (const id in this.eventBus.destinations) {
			await this.eventBus.removeDestination(id, false);
		}
	}

	private async truncateAll() {
		for (const table of tablesToTruncate) {
			try {
				const { connection } = this.settingsRepo.manager;
				await connection.query(
					`DELETE FROM ${table}; DELETE FROM sqlite_sequence WHERE name=${table};`,
				);
			} catch (error) {
				Container.get(Logger).warn('Dropping Table for E2E Reset error', {
					error: error as Error,
				});
			}
		}
	}

	private async setupUserManagement(
		owner: UserSetupPayload,
		members: UserSetupPayload[],
		admin: UserSetupPayload,
	) {
		const userCreatePromises = [
			this.userRepository.createUserWithProject({
				id: uuid(),
				...owner,
				password: await this.passwordUtility.hash(owner.password),
				role: 'global:owner',
			}),
		];

		userCreatePromises.push(
			this.userRepository.createUserWithProject({
				id: uuid(),
				...admin,
				password: await this.passwordUtility.hash(admin.password),
				role: 'global:admin',
			}),
		);

		for (const { password, ...payload } of members) {
			userCreatePromises.push(
				this.userRepository.createUserWithProject({
					id: uuid(),
					...payload,
					password: await this.passwordUtility.hash(password),
					role: 'global:member',
				}),
			);
		}

		const [newOwner] = await Promise.all(userCreatePromises);

		if (owner?.mfaSecret && owner.mfaRecoveryCodes?.length) {
			const { encryptedRecoveryCodes, encryptedSecret } =
				this.mfaService.encryptSecretAndRecoveryCodes(owner.mfaSecret, owner.mfaRecoveryCodes);

			await this.authUserRepository.update(newOwner.user.id, {
				mfaSecret: encryptedSecret,
				mfaRecoveryCodes: encryptedRecoveryCodes,
			});
		}

		await this.settingsRepo.update(
			{ key: 'userManagement.isInstanceOwnerSetUp' },
			{ value: 'true' },
		);

		config.set('userManagement.isInstanceOwnerSetUp', true);
	}

	private async resetCache() {
		await this.cacheService.reset();
	}
}
