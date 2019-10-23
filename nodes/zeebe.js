const logger = require('../util/logger');

module.exports = function(RED) {
    const ZB = require('zeebe-node');

    function Zeebe(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        const options = {
            useTls: Boolean(config.useTls),
            oAuth: {
                url: config.oAuthUrl,
                audience: config.contactPoint.split(':')[0],
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                cacheOnDisk: true,
            },
            onReady: () => {
                node.log('Connected');
            },
            onConnectionError: () => {
                node.warn('Connection Error');
            },
            loglevel: 'ERROR',
            stdout: logger(node),
        };

        if (config.useLongpoll) {
            options.longPoll = 600000;
        }

        if (config.oAuthUrl === '') {
            delete options.oAuth;
        }

        node.zbc = new ZB.ZBClient(config.contactPoint, options);

        node.on('close', function(done) {
            return node.zbc.close().then(() => {
                node.log('All workers closed');
                done();
            });
        });
    }

    RED.nodes.registerType('zeebe', Zeebe);
};
