const status = require('../nodeStatus');

module.exports = function(RED) {
    function TaskWorker(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const zbc = RED.nodes.getNode(config.zeebe).zbc;

        const handler = (job, complete) => {
            msg.payload.job = job;
            msg.payload.complete = complete;
            node.send(msg);
        };

        const workerOptions = {
            maxActiveJobs: config.maxActiveJobs,
            timeout: config.timeout,
        };

        const onConnectionError = err => {
            status.error(node, err);
        };

        const zbWorker = zbc.createWorker(
            config.name, // worker name
            config.taskType,
            handler,
            workerOptions,
            onConnectionError
        );

        //status.success(node, 'connected');

        node.on('close', () => {});
    }
    RED.nodes.registerType('task-worker', TaskWorker);
};
