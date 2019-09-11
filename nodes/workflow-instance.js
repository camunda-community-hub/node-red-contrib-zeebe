const status = require('../nodeStatus');

module.exports = function(RED) {
    function WorkflowInstance(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function(msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;
            const variables = msg.payload.variables || {};

            try {
                const result = await this.zbc.createWorkflowInstance(
                    msg.payload.workflowName,
                    variables
                );

                msg.payload = { ...msg.payload, ...result };

                node.send(msg);
                status.success(node, 'KEY:' + msg.payload.workflowInstanceKey);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
            }
        });
    }

    RED.nodes.registerType('workflow-instance', WorkflowInstance);
};
