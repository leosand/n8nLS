import { EventMessage } from './EventMessage';
import { v4 as uuid } from 'uuid';
import { JsonObject, jsonParse, JsonValue } from 'n8n-workflow';
import { EventMessageSubscriptionSet } from './EventMessageSubscriptionSet';
import {
	EventMessageGroups,
	EventMessageNames,
	EventMessageLevel,
} from '../types/EventMessageTypes';
import { EventDestinations } from '../../databases/entities/MessageEventBusDestinationEntity';
import { Db } from '../..';
import { MessageEventBusDestinationSentry } from '../MessageEventBusDestination/MessageEventBusDestinationSentry';
import { MessageEventBusDestinationRedis } from '../MessageEventBusDestination/MessageEventBusDestinationRedis';
import { MessageEventBusDestinationSyslog } from '../MessageEventBusDestination/MessageEventBusDestinationSyslog';
import { MessageEventBusDestinationWebhook } from '../MessageEventBusDestination/MessageEventBusDestinationWebhook';

export interface MessageEventBusDestinationOptions {
	id?: string;
	name?: string;
	subscriptionSet?: EventMessageSubscriptionSet;
}

export abstract class MessageEventBusDestination {
	// Since you can't have static abstract functions - this just serves as a reminder that you need to implement these. Please.
	// static readonly type: string;
	// static deserialize(): MessageEventBusDestination;
	// static fromString(data: string): MessageEventBusDestination;

	readonly #id: string;

	name: string;

	subscriptionSet: EventMessageSubscriptionSet;

	constructor(options: MessageEventBusDestinationOptions) {
		this.#id = options.id ?? uuid();
		this.name = options.name ?? 'MessageEventBusDestination';
		this.subscriptionSet = options.subscriptionSet
			? new EventMessageSubscriptionSet(options.subscriptionSet)
			: new EventMessageSubscriptionSet();
	}

	getName() {
		return this.name;
	}

	getId() {
		return this.#id;
	}

	setSubscription(subscriptionSet: EventMessageSubscriptionSet) {
		this.subscriptionSet = subscriptionSet;
	}

	setEventGroups(groups: EventMessageGroups[]) {
		this.subscriptionSet.setEventGroups(groups);
	}

	setEventNames(names: EventMessageNames[]) {
		this.subscriptionSet.setEventNames(names);
	}

	setLevels(levels: EventMessageLevel[]) {
		this.subscriptionSet.setEventLevels(levels);
	}

	hasSubscribedToEvent(msg: EventMessage) {
		const eventGroup = msg.getEventGroup();

		if (
			this.subscriptionSet.eventLevels.includes('*') ||
			this.subscriptionSet.eventLevels.includes(msg.level)
		) {
			if (
				this.subscriptionSet.eventGroups.includes('*') ||
				this.subscriptionSet.eventNames.includes('*') ||
				(eventGroup !== undefined && this.subscriptionSet.eventGroups.includes(eventGroup)) ||
				this.subscriptionSet.eventNames.includes(msg.eventName)
			) {
				return true;
			}
		}
		return false;
	}

	async saveToDb() {
		const dbResult = await Db.collections.EventDestinations.upsert(
			{
				id: this.getId(),
				name: this.getName(),
				destination: this.toString(),
			},
			{
				skipUpdateIfNoValuesChanged: true,
				conflictPaths: ['id'],
			},
		);
		return dbResult;
	}

	static fromDb(dbData: EventDestinations) {
		const destinationData = jsonParse<JsonObject>(dbData.destination);
		if ('type' in destinationData) {
			switch (destinationData.type) {
				case MessageEventBusDestinationSentry.type:
					return MessageEventBusDestinationSentry.deserialize(destinationData);
				case MessageEventBusDestinationSyslog.type:
					return MessageEventBusDestinationSyslog.deserialize(destinationData);
				case MessageEventBusDestinationRedis.type:
					return MessageEventBusDestinationRedis.deserialize(destinationData);
				case MessageEventBusDestinationWebhook.type:
					return MessageEventBusDestinationWebhook.deserialize(destinationData);
			}
		}
		return;
	}

	abstract serialize(): JsonValue;

	abstract toString(): string;

	abstract receiveFromEventBus(msg: EventMessage): Promise<boolean>;

	abstract close(): Promise<void>;
}
