import {
	URL,
} from 'url';

import {
	sign,
} from 'aws4';

import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	ICredentialDataDecryptedObject,
	IDataObject,
} from 'n8n-workflow';

import { 
	IRequestBody,
} from './types';

function getEndpointForService(service: string, credentials: ICredentialDataDecryptedObject): string {
	let endpoint;
	if (service === 'lambda' && credentials.lambdaEndpoint) {
		endpoint = credentials.lambdaEndpoint;
	} else if (service === 'sns' && credentials.snsEndpoint) {
		endpoint = credentials.snsEndpoint;
	} else {
		endpoint = `https://${service}.${credentials.region}.amazonaws.com`;
	}
	return (endpoint as string).replace('{region}', credentials.region as string);
}

export async function awsApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: string, path: string, body?: object | IRequestBody, headers?: object): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('aws');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	// Concatenate path and instantiate URL object so it parses correctly query strings
	const endpoint = new URL(getEndpointForService(service, credentials) + path);

	const options = sign({
		uri: endpoint,
		service,
		region: credentials.region,
		method,
		path: '/',
		headers: { ...headers },
		body: JSON.stringify(body),
	}, {
		accessKeyId: credentials.accessKeyId,
		secretAccessKey: credentials.secretAccessKey,
	});

	try {
		return JSON.parse(await this.helpers.request!(options));
	} catch (error) {
		const errorMessage = (error.response && error.response.body.message) || (error.response && error.response.body.Message) || error.message;
		if (error.statusCode === 403) {
			if (errorMessage === 'The security token included in the request is invalid.') {
				throw new Error('The AWS credentials are not valid!');
			} else if (errorMessage.startsWith('The request signature we calculated does not match the signature you provided')) {
				throw new Error('The AWS credentials are not valid!');
			}
		}

		throw new Error(`AWS error response [${error.statusCode}]: ${errorMessage}`);
	}
}


export async function awsApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: string, path: string, body?: IRequestBody, headers?: object): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await awsApiRequest.call(this, service, method, path, body, headers);
		if (responseData.LastEvaluatedKey) {
			body!.ExclusiveStartKey = responseData.LastEvaluatedKey;
		}
		returnData.push(...responseData.Items);
	} while (
		responseData.LastEvaluatedKey !== undefined
	);

	return returnData;
}




