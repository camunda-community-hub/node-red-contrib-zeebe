# node-red-contrib-zeebe

[![Build Status](https://travis-ci.com/pedesen/node-red-contrib-zeebe.svg?branch=master)](https://travis-ci.com/pedesen/node-red-contrib-zeebe)

Zeebe nodes for Node-RED

This module leverages the [zeebe-node](https://creditsenseau.github.io/zeebe-client-node-js/index.html) client library to bring Zeebe awesomeness to Node-RED!

### worker / complete

![task-worker and complete node](docs/worker-complete.png)

Creates a task worker and subscribes to specific tasks/jobs. The `worker` node outputs a Node-RED message for each newly received task/job.
When a Node-RED message is received at the `complete` nodes's input, that task/job gets completed in Zeebe (with either success or failure).

Please note: These nodes only work in combination. Make sure, the complete object from the worker node output payload gets injected into the input of the complete node.

### pub msg

![publish-message node](docs/pub-msg.png)

When a Node-RED message is received at the input, this node publishes a message to Zeebe.

### pub start msg

![publish-start-message node](docs/pub-start-msg.png)

When a Node-RED message is received at the input, this node publishes a start message to Zeebe. No correlation key needed.

### create wfi

![workflow-instance node](docs/create-wfi.png)

When a Node-RED message is received at the input, a new workflow instance gets started in Zeebe. Once the workflow instance has been created, the output sends a Node-RED message containing some meta-info, i.e. the workflowInstanceKey.
