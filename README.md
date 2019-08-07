# node-red-contrib-zeebe
Zeebe nodes for Node-RED

This module integrates the Zeebe Node.js Client https://creditsenseau.github.io/zeebe-client-node-js/index.html.
It will provide the following Zeebe nodes for Node-RED:

### createTaskWorker
Creates a task worker and subscribes to specific tasks/jobs. This node outputs a Node-RED message for each newly received task/job.
* inputs: 0
* outputs: 1

### completeTask
When a Node-RED message is received at the input, this node completes a specific Zeebe task/job (with either success or failure).
* inputs: 1
* outputs: 0

### publishMessage
When a Node-RED message is received at the input, this node publishes a message to Zeebe.
* inputs: 1
* outputs: 0

### createWorkflowInstance
When a Node-RED message is received at the input, a new workflow instance gets started in Zeebe. When the workflow instance has been created, the output send a Node-RED message containing information like the workflowInstanceKey.
* inputs: 1
* outputs: 1
