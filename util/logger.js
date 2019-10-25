const getMsg = obj => JSON.parse(obj).message;

/**
 * Custom logger for ZBClient
 */
module.exports = (node, settings) => {
    defaultLogger = obj => {
        if (settings.console.level === 'trace') {
            node.trace(obj);
        } else {
            node.debug(getMsg(obj));
        }
    };

    return {
        error: defaultLogger,
        info: defaultLogger,
    };
};
