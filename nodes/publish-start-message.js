const status = require('../util/nodeStatus');
const uuid = require('uuid');

module.exports = function(RED) {
    function PublishStartMessage(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this.zbc = RED.nodes.getNode(config.zeebe).zbc;

        node.on('input', function(msg) {
            const message = { ...msg.payload, messageId: uuid.v4() };

            try {
                this.zbc.publishStartMessage(message);
                status.clear(node);
            } catch (err) {
                node.error(err.message, msg);
                status.error(node, err.message);
            }
        });
    }
    RED.nodes.registerType('publish-start-message', PublishStartMessage);
};
