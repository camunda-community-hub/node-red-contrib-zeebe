
module.exports = function(RED) {
    function CompleteTask(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', async function(msg) {
            const {complete} = msg.payload;
            
            complete();
        });
    }
    RED.nodes.registerType("complete-task", CompleteTask);
}