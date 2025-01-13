import { Container } from '@n8n/di';
import { stringify } from 'flatted';
import { mock } from 'jest-mock-extended';
import { InstanceSettings } from 'n8n-core';
import { randomInt } from 'n8n-workflow';

import { ARTIFICIAL_TASK_DATA } from '@/constants';
import { ExecutionRepository } from '@/databases/repositories/execution.repository';
import { NodeCrashedError } from '@/errors/node-crashed.error';
import { WorkflowCrashedError } from '@/errors/workflow-crashed.error';
import type { EventMessageTypes as EventMessage } from '@/eventbus/event-message-classes';
import { EventMessageNode } from '@/eventbus/event-message-classes/event-message-node';
import { ExecutionLifecycleHooksFactory } from '@/execution-lifecycle-hooks/execution-lifecycle-hooks-factory';
import { ExecutionRecoveryService } from '@/executions/execution-recovery.service';
import { Push } from '@/push';
import { mockInstance } from '@test/mocking';
import { createExecution } from '@test-integration/db/executions';
import { createWorkflow } from '@test-integration/db/workflows';
import * as testDb from '@test-integration/test-db';

import { IN_PROGRESS_EXECUTION_DATA, OOM_WORKFLOW } from './constants';
import { setupMessages } from './utils';

describe('ExecutionRecoveryService', () => {
	const push = mockInstance(Push);
	const instanceSettings = Container.get(InstanceSettings);

	let executionRecoveryService: ExecutionRecoveryService;
	let executionRepository: ExecutionRepository;
	let executionLifecycleHooksFactory: ExecutionLifecycleHooksFactory;

	beforeAll(async () => {
		await testDb.init();
		executionRepository = Container.get(ExecutionRepository);
		executionLifecycleHooksFactory = Container.get(ExecutionLifecycleHooksFactory);

		executionRecoveryService = new ExecutionRecoveryService(
			mock(),
			instanceSettings,
			push,
			executionRepository,
			mock(),
			executionLifecycleHooksFactory,
		);
	});

	beforeEach(() => {
		instanceSettings.markAsLeader();
	});

	afterEach(async () => {
		jest.restoreAllMocks();
		await testDb.truncate(['Execution', 'ExecutionData', 'Workflow']);
	});

	afterAll(async () => {
		await testDb.terminate();
	});

	describe('recoverFromLogs', () => {
		describe('if follower', () => {
			test('should do nothing', async () => {
				/**
				 * Arrange
				 */
				instanceSettings.markAsFollower();
				// @ts-expect-error Private method
				const amendSpy = jest.spyOn(executionRecoveryService, 'amend');
				const messages = setupMessages('123', 'Some workflow');

				/**
				 * Act
				 */
				await executionRecoveryService.recoverFromLogs('123', messages);

				/**
				 * Assert
				 */
				expect(amendSpy).not.toHaveBeenCalled();
			});
		});

		describe('if leader, with 0 messages', () => {
			test('should return `null` if no execution found', async () => {
				/**
				 * Arrange
				 */
				const inexistentExecutionId = randomInt(100).toString();
				const noMessages: EventMessage[] = [];

				/**
				 * Act
				 */
				const amendedExecution = await executionRecoveryService.recoverFromLogs(
					inexistentExecutionId,
					noMessages,
				);

				/**
				 * Assert
				 */
				expect(amendedExecution).toBeNull();
			});

			test('should update `status` and `stoppedAt`', async () => {
				/**
				 * Arrange
				 */
				const workflow = await createWorkflow(OOM_WORKFLOW);
				const execution = await createExecution(
					{
						status: 'running',
						data: stringify(IN_PROGRESS_EXECUTION_DATA),
					},
					workflow,
				);

				/**
				 * Act
				 */
				const amendedExecution = await executionRecoveryService.recoverFromLogs(execution.id, []);

				/**
				 * Assert
				 */
				if (!amendedExecution) fail('Expected `amendedExecution` to exist');

				expect(amendedExecution.status).toBe('crashed');
				expect(amendedExecution.stoppedAt).not.toBe(execution.stoppedAt);
			});
		});

		describe('if leader, with 1+ messages', () => {
			test('should return `null` if execution succeeded', async () => {
				/**
				 * Arrange
				 */
				const workflow = await createWorkflow();
				const execution = await createExecution({ status: 'success' }, workflow);
				const messages = setupMessages(execution.id, 'Some workflow');

				/**
				 * Act
				 */
				const amendedExecution = await executionRecoveryService.recoverFromLogs(
					execution.id,
					messages,
				);

				/**
				 * Assert
				 */
				expect(amendedExecution).toBeNull();
			});

			test('should return `null` if no execution found', async () => {
				/**
				 * Arrange
				 */
				const inexistentExecutionId = randomInt(100).toString();
				const messages = setupMessages(inexistentExecutionId, 'Some workflow');

				/**
				 * Act
				 */
				const amendedExecution = await executionRecoveryService.recoverFromLogs(
					inexistentExecutionId,
					messages,
				);

				/**
				 * Assert
				 */
				expect(amendedExecution).toBeNull();
			});

			test('should update `status`, `stoppedAt` and `data` if last node did not finish', async () => {
				/**
				 * Arrange
				 */

				const workflow = await createWorkflow(OOM_WORKFLOW);

				const execution = await createExecution(
					{
						status: 'running',
						data: stringify(IN_PROGRESS_EXECUTION_DATA),
					},
					workflow,
				);

				const messages = setupMessages(execution.id, workflow.name);

				/**
				 * Act
				 */

				const amendedExecution = await executionRecoveryService.recoverFromLogs(
					execution.id,
					messages,
				);

				/**
				 * Assert
				 */

				const startOfLastNodeRun = messages
					.find((m) => m.eventName === 'n8n.node.started' && m.payload.nodeName === 'DebugHelper')
					?.ts.toJSDate();

				expect(amendedExecution).toEqual(
					expect.objectContaining({
						status: 'crashed',
						stoppedAt: startOfLastNodeRun,
					}),
				);

				const resultData = amendedExecution?.data.resultData;

				if (!resultData) fail('Expected `resultData` to be defined');

				expect(resultData.error).toBeInstanceOf(WorkflowCrashedError);
				expect(resultData.lastNodeExecuted).toBe('DebugHelper');

				const runData = resultData.runData;

				if (!runData) fail('Expected `runData` to be defined');

				const manualTriggerTaskData = runData['When clicking "Test workflow"'].at(0);
				const debugHelperTaskData = runData.DebugHelper.at(0);

				if (!manualTriggerTaskData) fail("Expected manual trigger's `taskData` to be defined");
				if (!debugHelperTaskData) fail("Expected debug helper's `taskData` to be defined");

				const originalManualTriggerTaskData =
					IN_PROGRESS_EXECUTION_DATA.resultData.runData['When clicking "Test workflow"'].at(
						0,
					)?.data;

				expect(manualTriggerTaskData.executionStatus).toBe('success');
				expect(manualTriggerTaskData.error).toBeUndefined();
				expect(manualTriggerTaskData.data).toStrictEqual(originalManualTriggerTaskData); // unchanged

				expect(debugHelperTaskData.executionStatus).toBe('crashed');
				expect(debugHelperTaskData.error).toBeInstanceOf(NodeCrashedError);
			});

			test('should update `status`, `stoppedAt` and `data` if last node finished', async () => {
				/**
				 * Arrange
				 */
				const workflow = await createWorkflow(OOM_WORKFLOW);

				const execution = await createExecution(
					{
						status: 'running',
						data: stringify(IN_PROGRESS_EXECUTION_DATA),
					},
					workflow,
				);

				const messages = setupMessages(execution.id, workflow.name);
				messages.push(
					new EventMessageNode({
						eventName: 'n8n.node.finished',
						payload: {
							executionId: execution.id,
							workflowName: workflow.name,
							nodeName: 'DebugHelper',
							nodeType: 'n8n-nodes-base.debugHelper',
						},
					}),
				);

				/**
				 * Act
				 */
				const amendedExecution = await executionRecoveryService.recoverFromLogs(
					execution.id,
					messages,
				);

				/**
				 * Assert
				 */
				const endOfLastNoderun = messages
					.find((m) => m.eventName === 'n8n.node.finished' && m.payload.nodeName === 'DebugHelper')
					?.ts.toJSDate();

				expect(amendedExecution).toEqual(
					expect.objectContaining({
						status: 'crashed',
						stoppedAt: endOfLastNoderun,
					}),
				);

				const resultData = amendedExecution?.data.resultData;

				if (!resultData) fail('Expected `resultData` to be defined');

				expect(resultData.error).toBeUndefined();
				expect(resultData.lastNodeExecuted).toBe('DebugHelper');

				const runData = resultData.runData;

				if (!runData) fail('Expected `runData` to be defined');

				const manualTriggerTaskData = runData['When clicking "Test workflow"'].at(0);
				const debugHelperTaskData = runData.DebugHelper.at(0);

				expect(manualTriggerTaskData?.executionStatus).toBe('success');
				expect(manualTriggerTaskData?.error).toBeUndefined();

				expect(debugHelperTaskData?.executionStatus).toBe('success');
				expect(debugHelperTaskData?.error).toBeUndefined();
				expect(debugHelperTaskData?.data).toEqual(ARTIFICIAL_TASK_DATA);
			});
		});
	});
});
