
module.exports = function(RED) {
    function TaskWorker(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;
            const {worker, type} = msg.payload;
            
            function handler(job, complete) {
                msg.payload.job = job;
                msg.payload.complete = complete;
                node.send(msg);
            }

            const zbWorker = this.zbc.createWorker(worker, type, handler);
        });
    }
    RED.nodes.registerType("task-worker", TaskWorker);
}