const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function ProcessInstance(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;
            const variables = msg.payload.variables || {};

            try {
                const result = await this.zbc.createProcessInstance(
                    msg.payload.processId,
                    variables
                );

                msg.payload = { ...msg.payload, ...result };

                node.send(msg);
                status.success(node, 'KEY:' + msg.payload.processInstanceKey);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
                console.error(err);
            }
        });
    }

    RED.nodes.registerType('process-instance', ProcessInstance);
};
