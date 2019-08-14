module.exports = function(RED) {
    const ZB = require('zeebe-node');
    
    function Zeebe(n) {      
        RED.nodes.createNode(this, n);
        this.host = n.host;
        this.port = n.port;
        this.zbc = new ZB.ZBClient(`${this.host}:${this.port}`);
    }
    RED.nodes.registerType("zeebe", Zeebe);
}