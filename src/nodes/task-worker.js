const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function TaskWorker(config) {
        RED.nodes.createNode(this, config);

        const zeebeConfig = RED.nodes.getNode(config.zeebe);

        const node = this;

        const zbc = zeebeConfig.zbc;

        // assume the worker is connected, once the client is connected. this will be obsolete,
        // once https://github.com/creditsenseau/zeebe-client-node-js/issues/97 is fixed
        zeebeConfig.once('ready', () => {
            status.success(node, 'Connected');
        });

        status.warning(node, 'Connecting...');

        const handler = (job, complete) => {
            node.send({
                payload: {
                    job,
                    complete,
                },
            });
        };

        const workerOptions = {
            onReady: () => {
                node.debug('Connected');
                status.success(node, 'Connected');
            },
            onConnectionError: () => {
                node.debug('Connection Error');
                status.error(node, 'Connection Error');
            },
        };

        if (config.maxActiveJobs !== '') {
            workerOptions.maxActiveJobs = config.maxActiveJobs;
        }

        if (config.timeout !== '') {
            workerOptions.timeout = config.timeout;
        }

        const zbWorker = zbc.createWorker(
            config.name, // worker name
            config.taskType,
            handler,
            workerOptions
        );

        node.on('close', () => {});
    }
    RED.nodes.registerType('task-worker', TaskWorker);
};
