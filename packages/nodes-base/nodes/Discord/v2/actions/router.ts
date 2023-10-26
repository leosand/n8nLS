import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as message from './message';
import * as channel from './channel';
import * as member from './member';
import * as webhook from './webhook';
import type { Discord } from './node.type';

export async function router(this: IExecuteFunctions) {
	let returnData: INodeExecutionData[] = [];

	let resource = 'webhook';
	//resource parameter is hidden when authentication is set to webhook
	//prevent error when getting resource parameter
	try {
		resource = this.getNodeParameter<Discord>('resource', 0);
	} catch (error) {}
	const operation = this.getNodeParameter('operation', 0);

	let guildId = '';

	if (resource !== 'webhook') {
		guildId = this.getNodeParameter('guildId', 0, {}, { extractValue: true }) as string;
	}

	const discord = {
		resource,
		operation,
	} as Discord;

	switch (discord.resource) {
		case 'channel':
			returnData = await channel[discord.operation].execute.call(this, guildId);
			break;
		case 'message':
			returnData = await message[discord.operation].execute.call(this, guildId);
			break;
		case 'member':
			returnData = await member[discord.operation].execute.call(this, guildId);
			break;
		case 'webhook':
			returnData = await webhook[discord.operation].execute.call(this);
			break;
		default:
			throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
	}

	return [returnData];
}
