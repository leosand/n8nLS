import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';

import {
	apiRequest,
} from '../../../transport';

import {
	GoogleSheet,
} from '../../../helper';

export async function remove(this: IExecuteFunctions, index: number, sheet: GoogleSheet, sheetName: string): Promise<INodeExecutionData[]> {
	const returnData: IDataObject[] = [];
	const items = this.getInputData();
	for (let i = 0; i < items.length; i++) {
		let [spreadsheetId, sheetWithinDocument] = sheetName.split('||');
		const requests = [{
			deleteSheet: {
				sheetId: sheetWithinDocument,
			},
		}];

		let responseData;

		responseData = await apiRequest.call(this, 'POST', `/v4/spreadsheets/${spreadsheetId}:batchUpdate`, { requests });
		delete responseData.replies;
		returnData.push(responseData);
	}

	return this.helpers.returnJsonArray(returnData);
}
