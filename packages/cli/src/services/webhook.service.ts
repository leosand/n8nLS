import { WebhookRepository } from '@/databases/repositories';
import { Service } from 'typedi';
import { CacheService } from './cache.service';
import type { WebhookEntity } from '@/databases/entities/WebhookEntity';

@Service()
export class WebhookService {
	// @TODO Conflicting Prettier autofixes
	// eslint-disable-next-line prettier/prettier
	constructor(private webhookRepository: WebhookRepository, private cacheService: CacheService) {} // prime cache after workflow activation

	async primeCache() {
		const allWebhooks = await this.webhookRepository.find({});

		if (!allWebhooks) return;

		void this.cacheService.setMany(
			allWebhooks.map((webhook) => [
				`cache:webhook:${webhook.method}-${webhook.fullPath}`,
				webhook,
			]),
		);
	}

	private async findCached(method: string, path: string) {
		const cacheKey = `cache:webhook:${method}-${path}`;

		const cachedWebhook = await this.cacheService.get<WebhookEntity>(cacheKey);

		if (cachedWebhook) return this.webhookRepository.create(cachedWebhook);

		console.log('CACHE MISS');

		let dbWebhook = await this.findStaticWebhook(method, path);

		if (dbWebhook === null) {
			dbWebhook = await this.findDynamicWebhook(method, path);
		}

		if (dbWebhook !== null) {
			void this.cacheService.set(cacheKey, dbWebhook);
		}

		return dbWebhook;
	}

	/**
	 * Find a webhook having zero dynamic path segments, e.g. `<uuid>` or `user/create`
	 */
	private async findStaticWebhook(method: string, path: string) {
		return this.webhookRepository.findOneBy({ webhookPath: path, method });
	}

	/**
	 * Find a webhook having 1+ dynamic path segments, e.g. `<uuid>/user/:id/create`
	 * `<uuid>/` at the base is mandatory for dynamic webhooks.
	 */
	private async findDynamicWebhook(method: string, path: string) {
		const [idSegment, ...remainingSegments] = path.split('/');

		// @TODO: Sanity check on segments before DB query

		const dynamicWebhooks = await this.webhookRepository.findBy({
			webhookId: idSegment,
			method,
			pathLength: remainingSegments.length,
		});

		if (dynamicWebhooks.length === 0) return null;

		// @TODO: Refactor legacy code after testing

		let webhook: WebhookEntity | null = null;
		let maxMatches = 0;
		const pathSegmentsSet = new Set(remainingSegments);

		dynamicWebhooks.forEach((dw) => {
			const staticSegments = dw.webhookPath.split('/').filter((s) => !s.startsWith(':'));
			const allStaticSegmentsMatch = staticSegments.every((s) => pathSegmentsSet.has(s));

			if (allStaticSegmentsMatch && staticSegments.length > maxMatches) {
				maxMatches = staticSegments.length;
				webhook = dw;
			} else if (staticSegments.length === 0 && !webhook) {
				webhook = dw;
			}
		});

		return webhook;
	}

	async findWebhook(method: string, path: string) {
		return this.findCached(method, path);
	}

	async createWebhook(webhook: WebhookEntity) {
		return this.webhookRepository.insert(webhook);
	}

	async deleteWebhooks(workflowId: string) {
		return this.webhookRepository.delete({ workflowId });
	}

	async deleteAllWebhooks() {
		return this.webhookRepository.clear();
	}

	async getWebhookMethods(path: string) {
		return this.webhookRepository
			.find({ select: ['method'], where: { webhookPath: path } })
			.then((webhooks) => webhooks.map((webhook) => webhook.method));
	}
}
