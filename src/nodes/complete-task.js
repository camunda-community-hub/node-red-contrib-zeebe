const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function CompleteTask(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        node.on('input', async function (msg) {
            const {
                complete,
                variables,
                type,
                failureMessage,
                errorCode,
                errorMessage,
            } = msg.payload;

            try {
                if (type === 'failure') {
                    complete.failure(failureMessage || '');
                    status.warning(node, failureMessage || 'Failure');
                } else if (type === 'error') {
                    complete.error(errorCode, errorMessage);
                    status.clear(node);
                } else {
                    complete.success(variables);
                    status.clear(node);
                }
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
            }
        });
    }
    RED.nodes.registerType('complete-task', CompleteTask);
};
