const status = require('../util/nodeStatus');

module.exports = function(RED) {
    function TaskWorker(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        const zbc = RED.nodes.getNode(config.zeebe).zbc;

        const handler = (job, complete) => {
            node.send({
                payload: {
                    job,
                    complete,
                },
            });
        };

        const workerOptions = {};

        if (config.maxActiveJobs !== '') {
            workerOptions.maxActiveJobs = config.maxActiveJobs;
        }

        if (config.timeout !== '') {
            workerOptions.timeout = config.timeout;
        }

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
