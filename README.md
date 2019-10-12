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

### deploy

![deploy node](docs/deploy.png)

Inject a bpmn workflow definition string to the input of this node to deploy it to Zeebe.

You can use the 'file in' node from Node-RED to read a bpmn file from disk, or get the workflow definition from anywhere you want.

### create wfi

![workflow-instance node](docs/create-wfi.png)

When a Node-RED message is received at the input, a new workflow instance gets started in Zeebe. Once the workflow instance has been created, the output sends a Node-RED message containing some meta-info, i.e. the workflowInstanceKey.

## Developing

To test these nodes locally in node-red, the `npm install <folder>` command can be used. This allows you to develop the node in a local directory and have it linked into a local node-red install during development.

In your node-red user directory, typically `~/.node-red`, run:

```bash
npm install <path to location of node-red-contrib-zeebe>
```

This creates the appropriate symbolic link to the directory so that Node-RED will discover the node when it starts. Any changes to the node’s file can be picked up by simply restarting Node-RED.

### Tests

Tests are written in Jest, and live in the `__tests__` directory. To run the unit tests:

```bash
npm test
```

Integration tests are in the `__tests__/integration.js` file.

They require a Zeebe broker to run. You can start a dockerised broker:

```bash
cd resources
docker-compose up
```

And then run them manually:

```bash
npm run test:integration
```
