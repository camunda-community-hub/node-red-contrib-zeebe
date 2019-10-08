const fs = require('fs');
const uuid = require('uuid');

module.exports = function(RED) {
    const USER_DIR = RED.settings.userDir;

    function Deploy(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function(msg) {
            this.zbc = RED.nodes.getNode(config.zeebe).zbc;

            let resourceName, definition;

            resourceName = msg.payload.resourceName || `${uuid.v4()}.bpmn`;

            if (typeof msg.payload === 'string') {
                definition = msg.payload;
            } else {
                definition = msg.payload.definition;
            }

            const path = `${USER_DIR}/${resourceName}`;

            /**
             * Temporarily store bpmn file to file system.
             * This will be obsolete, when definition strings are allowed in zeebe-node
             * https://github.com/creditsenseau/zeebe-client-node-js/issues/86
             */
            fs.writeFile(path, definition, 'utf8', async err => {
                if (err) {
                    console.log(err);
                } else {
                    const res = await this.zbc.deployWorkflow(path);

                    // remove bpmn file from file system
                    fs.unlinkSync(path, err => {
                        console.log(err);
                    });

                    msg.payload = res;
                    node.send(msg);
                }
            });
        });
    }

    RED.nodes.registerType('deploy', Deploy);
};
