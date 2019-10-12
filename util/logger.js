const getMsg = obj => JSON.parse(obj).message;

/**
 * Custom logger for ZBClient
 */

module.exports = node => ({
    error: obj => node.error(getMsg(obj)),
    info: obj => node.log(getMsg(obj)),
});
