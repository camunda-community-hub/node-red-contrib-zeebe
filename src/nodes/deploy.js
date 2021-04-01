const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function Deploy(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;

            const { resourceName, definition } = msg.payload;

            try {
                const res = await this.zbc.deployWorkflow({
                    definition: Buffer.from(definition),
                    name: resourceName,
                });

                status.success(node, 'Deployed');
                msg.payload = res;
                node.send(msg);
            } catch (e) {
                node.error(e.message);
                status.error(node, 'Deploy error');
            }
        });
    }

    RED.nodes.registerType('deploy', Deploy);
};
