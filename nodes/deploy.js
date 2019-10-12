const fs = require('fs');

module.exports = function(RED) {
    function Deploy(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function(msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;

            const { resourceName, definition } = msg.payload;

            const res = await this.zbc.deployWorkflow({
                definition: Buffer.from(definition),
                resourceName,
            });

            msg.payload = res;
            node.send(msg);
        });
    }

    RED.nodes.registerType('deploy', Deploy);
};
