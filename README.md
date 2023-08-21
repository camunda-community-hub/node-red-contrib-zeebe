# node-red-contrib-zeebe-2 (fork of node-red-contrib-zeebe, updated to zeebe-node 8.2.x)
### (Work in progress)

![Compatible with: Camunda Platform 8.2+](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)

![npm](https://img.shields.io/npm/v/node-red-contrib-zeebe-2)

This module leverages the [zeebe-node](https://creditsenseau.github.io/zeebe-client-node-js/index.html) client library to bring Zeebe awesomeness to Node-RED!

**Please upgrade node-red-contrib-zeebe to v0.7+ for Zeebe v1.0 or current Camunda Platform 8 support!** Zeebe versions prior to v1.0 are not supported anymore.

Learn more about how these nodes can be used from basic [example flows](https://flows.nodered.org/collection/IC--I_j4q-Mt).

### worker / complete

![task-worker and complete node](docs/worker-complete.png)

Creates a task worker and subscribes to specific tasks/jobs. The `worker` node outputs a Node-RED message for each newly received task/job.
When a Node-RED message is received at the `complete` nodes's input, that task/job gets completed in Zeebe (with either success, failure or error).

Please note: These nodes only work in combination. Make sure, the complete object from the worker node output payload gets injected into the input of the complete node.

See [example flow](https://flows.nodered.org/flow/71e06f6a3e3bcbc7721cd970215b5180).

### message

![publish-message node](docs/pub-msg.png)

This node publishes a message to Zeebe, when a Node-RED message is received at the input.

The message must contain a name and a correlation key. Optionally you can pass in variables and configuration options like timeToLive.

See [example flow](https://flows.nodered.org/flow/d409cb6dfdd283a01724dc85cd65387e).

### start message

![publish-start-message node](docs/pub-start-msg.png)

This node publishes a start message to Zeebe, when a Node-RED message is received at the input.

The message must contain a name, no correlation key needed. Optionally you can pass in variables and configuration options like timeToLive.

See [example flow](https://flows.nodered.org/flow/5ab8499646b88cdbbb40a526ff4638d8).

### process

![deploy node](docs/deploy.png)

Inject a bpmn process definition string to the input of this node to deploy it to Zeebe.

You can use the 'file in' node from Node-RED to read a bpmn file from disk, or get the process definition from anywhere you want.

See [example flow](https://flows.nodered.org/flow/1fdad35c25b7269eea64b76d3236c3a6).

### process instance

![workflow-instance node](docs/create-wfi.png)

A new process instance gets started in Zeebe, when a Node-RED message is received at the input.

Once the process instance has been created, the output sends a Node-RED message containing some meta-info, i.e. the processInstanceKey.

See [example flow](https://flows.nodered.org/flow/1195ed3512bc05c02558e319ebc46abb).

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
cd resources/travis/
docker-compose up
```

And then run them manually:

```bash
npm run test:integration
```
