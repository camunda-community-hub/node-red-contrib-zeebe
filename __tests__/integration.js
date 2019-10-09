const uuid = require('uuid');
const helper = require('node-red-node-test-helper');

const zeebeNode = require('../nodes/zeebe');
const taskWorkerNode = require('../nodes/task-worker');
const deployNode = require('../nodes/deploy');
const workflowInstanceNode = require('../nodes/workflow-instance');
const completeTaskNode = require('../nodes/complete-task');
const pubStartMsgNode = require('../nodes/publish-start-message');
const pubMsgNode = require('../nodes/publish-message');

const workflow01 = require('../resources/workflow01');
const workflow02 = require('../resources/workflow02');

jest.unmock('zeebe-node');
jest.setTimeout(10000);

helper.init(require.resolve('node-red'));

describe('integration', () => {
    beforeEach(done => {
        helper.startServer(done);
    });

    afterEach(done => {
        helper.unload();
        helper.stopServer(done);
    });

    /**
     * this test does the following:
     * - start a task worker
     * - deploy a workflow
     * - start a workflow instance
     * - complete a task
     */
    it('create instance, complete task', done => {
        var flow = [
            {
                id: 'zeebe-node',
                type: 'zeebe',
                name: 'zeebe',
                contactPoint: '127.0.0.1',
                oAuthUrl: '',
                audience: '',
                clientId: '',
                clientSecret: '',
                useLongpoll: false,
                useTls: false,
            },
            {
                id: 'deploy-node',
                type: 'deploy',
                name: 'deploy',
                zeebe: 'zeebe-node',
                wires: [['n1']],
            },
            {
                id: 'workflow-instance-node',
                type: 'workflow-instance',
                name: 'workflow-instance',
                zeebe: 'zeebe-node',
                wires: [['n2']],
            },
            {
                id: 'task-worker-node',
                type: 'task-worker',
                name: 'task-worker',
                taskType: 'node-red',
                zeebe: 'zeebe-node',
                wires: [['complete-task-node']],
            },
            {
                id: 'complete-task-node',
                type: 'complete-task',
                name: 'complete-task',
            },
            { id: 'n1', type: 'helper' },
            { id: 'n2', type: 'helper' },
        ];

        helper.settings({ userDir: '.' });

        helper.load(
            [
                zeebeNode,
                taskWorkerNode,
                deployNode,
                workflowInstanceNode,
                completeTaskNode,
            ],
            flow,
            () => {
                const deployNode = helper.getNode('deploy-node');
                const workflowInstanceNode = helper.getNode(
                    'workflow-instance-node'
                );
                const completeTaskNode = helper.getNode('complete-task-node');
                const n1 = helper.getNode('n1');
                const n2 = helper.getNode('n2');

                // complete task
                completeTaskNode.on('input', msg => {
                    Promise.resolve().then(() => {
                        done();
                    });
                });

                n2.on('input', msg => {
                    Promise.resolve().then(() => {
                        expect(msg.payload.workflowInstanceKey).toEqual(
                            expect.any(String)
                        );
                    });
                });

                n1.on('input', msg => {
                    // get workflow name from message
                    const workflowName = msg.payload.workflows[0].bpmnProcessId;

                    Promise.resolve().then(() => {
                        // create a workflow instance
                        workflowInstanceNode.receive({
                            payload: { workflowName },
                        });
                    });
                });

                // deploy workflow02
                deployNode.receive({
                    payload: workflow01,
                });
            }
        );
    });

    /**
     * this test does the following:
     * - start a task worker
     * - deploy a workflow
     * - publish a start message
     * - publish a message
     * - complete a task
     */
    it('publish start message, publish message, complete task', done => {
        var flow = [
            {
                id: 'zeebe-node',
                type: 'zeebe',
                name: 'zeebe',
                contactPoint: '127.0.0.1',
                oAuthUrl: '',
                audience: '',
                clientId: '',
                clientSecret: '',
                useLongpoll: false,
                useTls: false,
            },
            {
                id: 'deploy-node',
                type: 'deploy',
                name: 'deploy',
                zeebe: 'zeebe-node',
                wires: [['n1']],
            },
            {
                id: 'pub-start-msg-node',
                type: 'publish-start-message',
                name: 'publish-start-message',
                zeebe: 'zeebe-node',
            },
            {
                id: 'pub-msg-node',
                type: 'publish-message',
                name: 'publish-message',
                zeebe: 'zeebe-node',
            },
            {
                id: 'task-worker-node',
                type: 'task-worker',
                name: 'task-worker',
                taskType: 'node-red',
                zeebe: 'zeebe-node',
                wires: [['complete-task-node']],
            },
            {
                id: 'complete-task-node',
                type: 'complete-task',
                name: 'complete-task',
            },
            { id: 'n1', type: 'helper' },
        ];

        helper.settings({ userDir: '.' });

        helper.load(
            [
                zeebeNode,
                taskWorkerNode,
                completeTaskNode,
                deployNode,
                pubStartMsgNode,
                pubMsgNode,
            ],
            flow,
            () => {
                const deployNode = helper.getNode('deploy-node');
                const pubStartMsgNode = helper.getNode('pub-start-msg-node');
                const pubMsgNode = helper.getNode('pub-msg-node');
                const completeTaskNode = helper.getNode('complete-task-node');
                const n1 = helper.getNode('n1');

                const processId = uuid.v4();

                // complete task
                completeTaskNode.on('input', msg => {
                    Promise.resolve().then(() => {
                        done();
                    });
                });

                n1.on('input', msg => {
                    Promise.resolve().then(() => {
                        // publish start message
                        pubStartMsgNode.receive({
                            payload: {
                                name: 'StartMessage',
                                variables: { processId },
                            },
                        });

                        setTimeout(() => {
                            // publish message
                            pubMsgNode.receive({
                                payload: {
                                    name: 'Message',
                                    correlationKey: processId,
                                },
                            });
                        }, 1000);
                    });
                });

                // deploy workflow02
                deployNode.receive({
                    payload: workflow02,
                });
            }
        );
    });
});
