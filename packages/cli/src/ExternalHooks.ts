/* eslint-disable @typescript-eslint/no-var-requires */
import { Service } from 'typedi';
import type { IExternalHooksFileData, IExternalHooksFunctions } from '@/Interfaces';
import config from '@/config';
import { UserRepository } from '@db/repositories/user.repository';
import { CredentialsRepository } from '@db/repositories/credentials.repository';
import { SettingsRepository } from '@db/repositories/settings.repository';
import { WorkflowRepository } from '@db/repositories/workflow.repository';
import { ApplicationError } from 'n8n-workflow';

@Service()
export class ExternalHooks {
	externalHooks: {
		[key: string]: Array<() => {}>;
	} = {};

	private initDidRun = false;

	private dbCollections: IExternalHooksFunctions['dbCollections'];

	constructor(
		userRepository: UserRepository,
		settingsRepository: SettingsRepository,
		credentialsRepository: CredentialsRepository,
		workflowRepository: WorkflowRepository,
	) {
		this.dbCollections = {
			User: userRepository,
			Settings: settingsRepository,
			Credentials: credentialsRepository,
			Workflow: workflowRepository,
		};
	}

	async init(): Promise<void> {
		if (this.initDidRun) {
			return;
		}

		await this.loadHooksFiles();

		this.initDidRun = true;
	}

	private async loadHooksFiles() {
		const externalHookFiles = config.getEnv('externalHookFiles').split(':');

		// Load all the provided hook-files
		for (let hookFilePath of externalHookFiles) {
			hookFilePath = hookFilePath.trim();
			if (hookFilePath !== '') {
				try {
					const hookFile = require(hookFilePath) as IExternalHooksFileData;
					this.loadHooks(hookFile);
				} catch (e) {
					const error = e instanceof Error ? e : new Error(`${e}`);

					throw new ApplicationError('Problem loading external hook file', {
						extra: { errorMessage: error.message, hookFilePath },
						cause: error,
					});
				}
			}
		}
	}

	private loadHooks(hookFileData: IExternalHooksFileData) {
		for (const resource of Object.keys(hookFileData)) {
			for (const operation of Object.keys(hookFileData[resource])) {
				// Save all the hook functions directly under their string
				// format in an array
				const hookString = `${resource}.${operation}`;
				if (this.externalHooks[hookString] === undefined) {
					this.externalHooks[hookString] = [];
				}

				// eslint-disable-next-line prefer-spread
				this.externalHooks[hookString].push.apply(
					this.externalHooks[hookString],
					hookFileData[resource][operation],
				);
			}
		}
	}

	async run(hookName: string, hookParameters?: any[]): Promise<void> {
		if (this.externalHooks[hookName] === undefined) {
			return;
		}

		const externalHookFunctions: IExternalHooksFunctions = {
			dbCollections: this.dbCollections,
		};

		for (const externalHookFunction of this.externalHooks[hookName]) {
			await externalHookFunction.apply(externalHookFunctions, hookParameters);
		}
	}

	exists(hookName: string): boolean {
		return !!this.externalHooks[hookName];
	}
}
