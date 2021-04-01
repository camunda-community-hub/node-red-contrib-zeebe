const helper = require('node-red-node-test-helper');
const publishMessageNode = require('../src/nodes/message.js');
const zeebeNode = require('../src/nodes/zeebe');

helper.init(require.resolve('node-red'));

describe('message node', () => {
    beforeEach((done) => {
        jest.resetAllMocks();
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should call zbc.publishMessage', (done) => {
        var flow = [
            {
                id: 'n1',
                type: 'zeebe',
                name: 'zeebe',
                contactPoint: 'localhost:1234',
            },
            {
                id: 'n2',
                type: 'message',
                name: 'message',
                zeebe: 'n1',
            },
        ];

        helper.load([zeebeNode, publishMessageNode], flow, () => {
            const n1 = helper.getNode('n1');
            const n2 = helper.getNode('n2');

            const params = {
                name: 'myMessage',
                correlationKey: '123-456',
                timeToLive: 42,
                variables: {
                    workflowId: 321,
                },
            };

            n1.zbc.publishMessage.mockImplementation(() => {
                expect(n1.zbc.publishMessage).toHaveBeenCalledTimes(1);

                const mockCallParams = n1.zbc.publishMessage.mock.calls[0][0];

                expect(mockCallParams.name).toEqual(params.name);
                expect(mockCallParams.correlationKey).toEqual(
                    params.correlationKey
                );
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
