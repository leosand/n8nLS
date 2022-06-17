import {
	IExecutePaginationFunctions,
	IRequestOptionsFromParameters,
	INodeExecutionData,
	IDataObject
} from "n8n-workflow";

export function wait() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(true);
		}, 1000);
	});
}

export async function highLevelApiPagination(this: IExecutePaginationFunctions, requestData: IRequestOptionsFromParameters): Promise<INodeExecutionData[]> {

	let rootProperty = '';
	requestData.postReceive.forEach(pR => {
		for (let i = 0; i < pR.actions.length; i++) {
			const action: any = pR.actions[i];
			if (action.type === 'rootProperty') {
				rootProperty = action.properties.property
				pR.actions.splice(i, 1);
				break;
			}
		}
	});

	const responseData: INodeExecutionData[] = [];
	const returnAll = this.getNodeParameter('returnAll');
	let responseTotal = 0;

	do {

		console.log(requestData.options);

		const pageResponseData: INodeExecutionData[] = await this.makeRoutingRequest(requestData);
		const items = pageResponseData[0].json[rootProperty] as [];
		items.forEach(item => responseData.push({ json: item }));

		const meta = pageResponseData[0].json.meta as IDataObject;
		const startAfterId = meta?.startAfterId as string;
		const startAfter = meta?.startAfter as number;
		requestData.options.qs = { startAfterId, startAfter };
		responseTotal = meta?.total as number || 0;

		// console.log(JSON.stringify(meta, null, 2));
		// await wait();

	} while (returnAll && responseTotal > responseData.length)

	return responseData;
};
