const status = require('../util/nodeStatus');

module.exports = function (RED) {
    function Deploy(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function (msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;
            const { resourceType, resourceName, definition } = msg.payload;
            let res;
            try {
                if (resourceType === 'process') {
                    res = await this.zbc.deployResource({
                        process: Buffer.from(definition),
                        name: resourceName,
                    });
                } else if (resourceType === 'decision') {
                    res = await this.zbc.deployResource({
                        decision: Buffer.from(definition),
                        name: resourceName,
                    });
                }
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
