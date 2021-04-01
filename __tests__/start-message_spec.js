const helper = require('node-red-node-test-helper');
const publishStartMessageNode = require('../src/nodes/start-message.js');
const zeebeNode = require('../src/nodes/zeebe');

helper.init(require.resolve('node-red'));

describe('start-message node', () => {
    beforeEach((done) => {
        jest.resetAllMocks();
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should call zbc.publishStarthMessage', (done) => {
        var flow = [
            {
                id: 'n1',
                type: 'zeebe',
                name: 'zeebe',
                contactPoint: 'localhost:1234',
            },
            {
                id: 'n2',
                type: 'start-message',
                name: 'start-message',
                zeebe: 'n1',
            },
        ];

        helper.load([zeebeNode, publishStartMessageNode], flow, () => {
            const n1 = helper.getNode('n1');
            const n2 = helper.getNode('n2');

            const params = {
                name: 'myMessage',
                timeToLive: 42,
                variables: {
                    workflowId: 321,
                },
            };

            n1.zbc.publishStartMessage.mockImplementation(() => {
                expect(n1.zbc.publishStartMessage).toHaveBeenCalledTimes(1);

                const mockCallParams =
                    n1.zbc.publishStartMessage.mock.calls[0][0];

                expect(mockCallParams.name).toEqual(params.name);
                expect(mockCallParams.timeToLive).toEqual(params.timeToLive);
                expect(mockCallParams.variables).toEqual(params.variables);
                expect(mockCallParams.messageId).toEqual(expect.any(String));

                done();
            });

            n2.receive({
                payload: params,
            });
        });
    });
});
