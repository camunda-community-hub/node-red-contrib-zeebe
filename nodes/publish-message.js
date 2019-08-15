const uuid = require('uuid');

module.exports = function(RED) {
    function PublishMessage(config) {
        RED.nodes.createNode(this,config);

        this.zbc = RED.nodes.getNode(config.zeebe).zbc;
        
        const node = this;
        node.on('input', function(msg) {
            const message =  {...msg.payload, messageId: uuid.v4()};
            this.zbc.publishMessage(message);
        });
    }
    RED.nodes.registerType("publish-message", PublishMessage);
}