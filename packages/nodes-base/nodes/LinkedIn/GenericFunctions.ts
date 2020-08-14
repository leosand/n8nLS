import {
	OptionsWithUrl,
 } from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

export async function linkedInApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, endpoint: string, method: string, body: any = {}, binary? : boolean,headers?: object): Promise<any> { // tslint:disable-line:no-any
	const options: OptionsWithUrl = {
		headers: {
			'Accept': 'application/json',
			'X-Restli-Protocol-Version': '2.0.0'
		},
		method,
		body,
		url: binary? endpoint : `https://api.linkedin.com/v2${endpoint}`, // Binary file upload URL doesn't have same base URL
		json: true,
	};

	// If uploading binary data
	if (binary) {
		delete options.json;
		options.encoding = null;
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.requestOAuth2!.call(this, 'linkedInOAuth2Api', options, { tokenType: 'Bearer' });
	} catch (error) {
		if (error.respose && error.response.body && error.response.body.detail) {
			throw new Error(`Mailchimp Error response [${error.statusCode}]: ${error.response.body.detail}`);
		}
		throw error;
	}
}


export function validateJSON(json: string | undefined): any { // tslint:disable-line:no-any
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = '';
	}
	return result;
}
