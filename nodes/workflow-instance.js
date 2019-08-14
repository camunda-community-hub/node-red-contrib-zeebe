
module.exports = function(RED) {
        function WorkflowInstance(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;
            const workflowName = msg.payload.workflowName;
            const variables = msg.payload.variables || {};
            const result = await this.zbc.createWorkflowInstance(workflowName, variables);
            
            msg.payload = {...msg.payload, ...result};

            node.send(msg);
        });
    }

    RED.nodes.registerType("workflow-instance", WorkflowInstance);
}
