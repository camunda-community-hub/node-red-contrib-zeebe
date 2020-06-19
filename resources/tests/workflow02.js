module.exports = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0f8psqe" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Zeebe Modeler" exporterVersion="0.7.0">
  <bpmn:process id="RedFlow02" name="RedFlow02" isExecutable="true">
    <bpmn:sequenceFlow id="SequenceFlow_04100pc" sourceRef="StartEvent_1" targetRef="IntermediateCatchEvent_0uo7k40" />
    <bpmn:endEvent id="EndEvent_0jta9ro">
      <bpmn:incoming>SequenceFlow_0yzvmcb</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>SequenceFlow_04100pc</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="Message_0hq3a9i" />
    </bpmn:startEvent>
    <bpmn:intermediateCatchEvent id="IntermediateCatchEvent_0uo7k40">
      <bpmn:incoming>SequenceFlow_04100pc</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1a9jutk</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="Message_0bc4y50" />
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1a9jutk" sourceRef="IntermediateCatchEvent_0uo7k40" targetRef="ServiceTask_1vgkloc" />
    <bpmn:serviceTask id="ServiceTask_1vgkloc" name="Node-RED">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="node-red2" />
      </bpmn:extensionElements>
      <bpmn:incoming>SequenceFlow_1a9jutk</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0yzvmcb</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="SequenceFlow_0yzvmcb" sourceRef="ServiceTask_1vgkloc" targetRef="EndEvent_0jta9ro" />
  </bpmn:process>
  <bpmn:message id="Message_0hq3a9i" name="StartMessage" />
  <bpmn:message id="Message_0bc4y50" name="Message">
    <bpmn:extensionElements>
      <zeebe:subscription correlationKey="=processId" />
    </bpmn:extensionElements>
  </bpmn:message>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="RedFlow02">
      <bpmndi:BPMNEdge id="SequenceFlow_04100pc_di" bpmnElement="SequenceFlow_04100pc">
        <di:waypoint x="215" y="121" />
        <di:waypoint x="272" y="121" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0jta9ro_di" bpmnElement="EndEvent_0jta9ro">
        <dc:Bounds x="532" y="103" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1ynijk7_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="103" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_0uo7k40_di" bpmnElement="IntermediateCatchEvent_0uo7k40">
        <dc:Bounds x="272" y="103" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1a9jutk_di" bpmnElement="SequenceFlow_1a9jutk">
        <di:waypoint x="308" y="121" />
        <di:waypoint x="370" y="121" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="ServiceTask_1vgkloc_di" bpmnElement="ServiceTask_1vgkloc">
        <dc:Bounds x="370" y="81" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0yzvmcb_di" bpmnElement="SequenceFlow_0yzvmcb">
        <di:waypoint x="470" y="121" />
        <di:waypoint x="532" y="121" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
