const { v4: uuidv4 } = require('uuid');
const helper = require('node-red-node-test-helper');

const zeebeNode = require('../src/nodes/zeebe');
const taskWorkerNode = require('../src/nodes/task-worker');
const deployNode = require('../src/nodes/deploy');
const processInstanceNode = require('../src/nodes/process-instance');
const completeTaskNode = require('../src/nodes/complete-task');
const startMessageNode = require('../src/nodes/start-message');
const messageNode = require('../src/nodes/message');

const workflow01 = require('../resources/tests/workflow01');
const workflow02 = require('../resources/tests/workflow02');

jest.unmock('zeebe-node');
jest.setTimeout(30000);

helper.init(require.resolve('node-red'));

describe('integration', () => {
    beforeEach((done) => {
        helper.startServer(done);
    });

    afterEach((done) => {
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
    it('create instance, complete task', (done) => {
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
                id: 'process-instance-node',
                type: 'process-instance',
                name: 'process-instance',
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
                processInstanceNode,
                completeTaskNode,
            ],
            flow,
            () => {
                const deploy = helper.getNode('deploy-node');
                const processInstance = helper.getNode('process-instance-node');
                const completeTask = helper.getNode('complete-task-node');
                const n1 = helper.getNode('n1');
                const n2 = helper.getNode('n2');

                // complete task
                completeTask.on('input', (msg) => {
                    Promise.resolve().then(() => {
                        done();
                    });
                });

                n2.on('input', (msg) => {
                    Promise.resolve().then(() => {
                        expect(msg.payload.processInstanceKey).toEqual(
                            expect.any(String)
                        );
                    });
                });

                n1.on('input', (msg) => {
                    // get workflow name from message
                    const processId = msg.payload.workflows[0].bpmnProcessId;

                    Promise.resolve().then(() => {
                        // create a workflow instance
                        processInstance.receive({
                            payload: { processId },
                        });
                    });
                });

                // deploy workflow02
                deploy.receive({
                    payload: {
                        definition: workflow01,
                        resourceName: 'workflow01.bpmn',
                    },
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
    it('publish start message, publish message, complete task', (done) => {
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
                id: 'start-message-node',
                type: 'start-message',
                name: 'start-message',
                zeebe: 'zeebe-node',
            },
            {
                id: 'message-node',
                type: 'message',
                name: 'message',
                zeebe: 'zeebe-node',
            },
            {
                id: 'task-worker-node',
                type: 'task-worker',
                name: 'task-worker',
                taskType: 'node-red2',
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
                startMessageNode,
                messageNode,
            ],
            flow,
            () => {
                const deploy = helper.getNode('deploy-node');
                const startMessage = helper.getNode('start-message-node');
                const message = helper.getNode('message-node');
                const completeTask = helper.getNode('complete-task-node');
                const n1 = helper.getNode('n1');

                const processId = uuidv4();

                // complete task
                completeTask.on('input', (msg) => {
                    Promise.resolve().then(() => {
                        done();
                    });
                });

                n1.on('input', (msg) => {
                    Promise.resolve().then(() => {
                        // publish start message
                        startMessage.receive({
                            payload: {
                                name: 'StartMessage',
                                variables: { processId },
                            },
                        });

                        setTimeout(() => {
                            // publish message
                            message.receive({
                                payload: {
                                    name: 'Message',
                                    correlationKey: processId,
                                },
                            });
                        }, 20000);
                    });
                });

                // deploy workflow02
                deploy.receive({
                    payload: {
                        definition: workflow02,
                        resourceName: 'workflow02.bpmn',
                    },
                });
            }
        );
    });
});
