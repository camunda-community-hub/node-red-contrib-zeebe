const status = require('../util/nodeStatus');
const { v4: uuidv4 } = require('uuid');

module.exports = function (RED) {
    function Message(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this.zbc = RED.nodes.getNode(config.zeebe).zbc;

        node.on('input', function (msg) {
            const message = { ...msg.payload, messageId: uuidv4() };
            try {
                this.zbc.publishMessage(message);
                status.clear(node);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
            }
        });
    }
    RED.nodes.registerType('message', Message);
};
