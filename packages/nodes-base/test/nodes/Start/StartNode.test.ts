import { INodeType } from 'n8n-workflow';
import * as Helpers from '../Helpers';
import { Start } from '../../../nodes/Start/Start.node';
import { WorkflowTestData } from '../types';
import { executeWorkflow } from '../ExecuteWorkflow';

describe('Execute Start Node', () => {
	const tests: Array<WorkflowTestData> = [
		{
			description: 'should run start node',
			input: {
				workflowData: {
					nodes: [
						{
							id: 'uuid-1',
							parameters: {},
							name: 'Start',
							type: 'n8n-nodes-base.start',
							typeVersion: 1,
							position: [100, 300],
						},
					],
					connections: {},
				},
			},
			output: {
				nodeExecutionOrder: ['Start'],
				nodeData: {},
			},
		},
	];

	const nodes: INodeType[] = [new Start()];
	const nodeTypes = Helpers.setup(nodes);

	for (const testData of tests) {
		test(testData.description, async () => {
			// execute workflow
			const { executionData, result, nodeExecutionOrder } = await executeWorkflow(
				testData,
				nodeTypes,
			);
			// Check if the nodes did execute in the correct order
			expect(nodeExecutionOrder).toEqual(testData.output.nodeExecutionOrder);
			// Check if other data has correct value
			expect(result.finished).toEqual(true);
			expect(result.data.executionData!.contextData).toEqual({});
			expect(result.data.executionData!.nodeExecutionStack).toEqual([]);
		});
	}
});
