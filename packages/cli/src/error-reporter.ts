import { GlobalConfig } from '@n8n/config';
// eslint-disable-next-line n8n-local-rules/misplaced-n8n-typeorm-import
import { QueryFailedError } from '@n8n/typeorm';
import type { ErrorEvent, EventHint } from '@sentry/types';
import { AxiosError } from 'axios';
import { createHash } from 'crypto';
import { InstanceSettings } from 'n8n-core';
import { ErrorReporterProxy, ApplicationError } from 'n8n-workflow';
import { Service } from 'typedi';

@Service()
export class ErrorReporter {
	private initialized = false;

	/** Hashes of error stack traces, to deduplicate error reports. */
	private seenErrors = new Set<string>();

	readonly info: (typeof ErrorReporterProxy)['info'];

	readonly warn: (typeof ErrorReporterProxy)['warn'];

	readonly error: (typeof ErrorReporterProxy)['error'];

	constructor(
		private readonly globalConfig: GlobalConfig,
		private readonly instanceSettings: InstanceSettings,
	) {
		this.info = ErrorReporterProxy.info;
		this.warn = ErrorReporterProxy.warn;
		this.error = ErrorReporterProxy.error;
	}

	async init() {
		if (this.initialized) return;

		process.on('uncaughtException', (error) => {
			ErrorReporterProxy.error(error);
		});

		const dsn = this.globalConfig.sentry.backendDsn;
		if (!dsn) {
			this.initialized = true;
			return;
		}

		// Collect longer stacktraces
		Error.stackTraceLimit = 50;

		const {
			N8N_VERSION: release,
			ENVIRONMENT: environment,
			DEPLOYMENT_NAME: serverName,
		} = process.env;

		const { init, captureException, setTag } = await import('@sentry/node');
		const { requestDataIntegration, rewriteFramesIntegration } = await import('@sentry/node');

		const enabledIntegrations = [
			'InboundFilters',
			'FunctionToString',
			'LinkedErrors',
			'OnUnhandledRejection',
			'ContextLines',
		];

		init({
			dsn,
			release,
			environment,
			enableTracing: false,
			serverName,
			beforeBreadcrumb: () => null,
			beforeSend: async (event, hint: EventHint) => await this.beforeSend(event, hint),
			integrations: (integrations) => [
				...integrations.filter(({ name }) => enabledIntegrations.includes(name)),
				rewriteFramesIntegration({ root: process.cwd() }),
				requestDataIntegration({
					include: {
						cookies: false,
						data: false,
						headers: false,
						query_string: false,
						url: true,
						user: false,
					},
				}),
			],
		});

		setTag('server_type', this.instanceSettings.instanceType);

		ErrorReporterProxy.init({
			report: (error, options) => captureException(error, options),
		});

		this.initialized = true;
	}

	async beforeSend(event: ErrorEvent, { originalException }: EventHint) {
		if (!originalException) return null;

		if (originalException instanceof Promise) {
			originalException = await originalException.catch((error) => error as Error);
		}

		if (originalException instanceof AxiosError) return null;

		if (
			originalException instanceof QueryFailedError &&
			['SQLITE_FULL', 'SQLITE_IOERR'].some((errMsg) => originalException.message.includes(errMsg))
		) {
			return null;
		}

		if (originalException instanceof ApplicationError) {
			const { level, extra, tags } = originalException;
			if (level === 'warning') return null;
			event.level = level;
			if (extra) event.extra = { ...event.extra, ...extra };
			if (tags) event.tags = { ...event.tags, ...tags };
		}

		if (
			originalException instanceof Error &&
			'cause' in originalException &&
			originalException.cause instanceof Error &&
			'level' in originalException.cause &&
			originalException.cause.level === 'warning'
		) {
			// handle underlying errors propagating from dependencies like ai-assistant-sdk
			return null;
		}

		if (originalException instanceof Error && originalException.stack) {
			const eventHash = createHash('sha1').update(originalException.stack).digest('base64');
			if (this.seenErrors.has(eventHash)) return null;
			this.seenErrors.add(eventHash);
		}

		return event;
	}
}
