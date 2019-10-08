const helper = require('node-red-node-test-helper');
const zeebeNode = require('../nodes/zeebe');
const taskWorkerNode = require('../nodes/task-worker');
const deployNode = require('../nodes/deploy');
const workflowInstanceNode = require('../nodes/workflow-instance');
const completeTaskNode = require('../nodes/complete-task');

const WORKFLOW = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0f8psqe" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Zeebe Modeler" exporterVersion="0.6.2">
<bpmn:process id="RedFlow" name="RedFlow" isExecutable="true">
<bpmn:startEvent id="StartEvent_1">
<bpmn:outgoing>SequenceFlow_04100pc</bpmn:outgoing>
</bpmn:startEvent>
<bpmn:serviceTask id="ServiceTask_0aa3gxy" name="Node-RED">
<bpmn:extensionElements>
<zeebe:taskDefinition type="node-red" />
</bpmn:extensionElements>
<bpmn:incoming>SequenceFlow_04100pc</bpmn:incoming>
<bpmn:outgoing>SequenceFlow_1db5jap</bpmn:outgoing>
</bpmn:serviceTask>
<bpmn:sequenceFlow id="SequenceFlow_04100pc" sourceRef="StartEvent_1" targetRef="ServiceTask_0aa3gxy" />
<bpmn:endEvent id="EndEvent_0jta9ro">
<bpmn:incoming>SequenceFlow_1db5jap</bpmn:incoming>
</bpmn:endEvent>
<bpmn:sequenceFlow id="SequenceFlow_1db5jap" sourceRef="ServiceTask_0aa3gxy" targetRef="EndEvent_0jta9ro" />
</bpmn:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="RedFlow">
<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
<dc:Bounds x="179" y="103" width="36" height="36" />
</bpmndi:BPMNShape>
<bpmndi:BPMNShape id="ServiceTask_0aa3gxy_di" bpmnElement="ServiceTask_0aa3gxy">
<dc:Bounds x="343" y="81" width="100" height="80" />
</bpmndi:BPMNShape>
<bpmndi:BPMNEdge id="SequenceFlow_04100pc_di" bpmnElement="SequenceFlow_04100pc">
<di:waypoint x="215" y="121" />
<di:waypoint x="343" y="121" />
</bpmndi:BPMNEdge>
<bpmndi:BPMNShape id="EndEvent_0jta9ro_di" bpmnElement="EndEvent_0jta9ro">
<dc:Bounds x="576" y="103" width="36" height="36" />
</bpmndi:BPMNShape>
<bpmndi:BPMNEdge id="SequenceFlow_1db5jap_di" bpmnElement="SequenceFlow_1db5jap">
<di:waypoint x="443" y="121" />
<di:waypoint x="576" y="121" />
</bpmndi:BPMNEdge>
</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</bpmn:definitions>`;

jest.unmock('zeebe-node');
jest.setTimeout(20000);

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
    it('should deploy workflow, create instance, complete task', done => {
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

                // deploy a workflow
                deployNode.receive({
                    payload: WORKFLOW,
                });
            }
        );
    });
});
