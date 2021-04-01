const helper = require('node-red-node-test-helper');
const completeTaskNode = require('../src/nodes/complete-task.js');

helper.init(require.resolve('node-red'));

const completeMock = {
    success: jest.fn(),
    failure: jest.fn(),
    error: jest.fn(),
};

describe('complete-task node', () => {
    beforeEach((done) => {
        helper.startServer(done);
        jest.resetAllMocks();
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should call complete.success with variables', (done) => {
        const variables = { workflowId: 123 };

        var flow = [
            {
                id: 'n1',
                type: 'complete-task',
                name: 'complete-task',
            },
        ];

        helper.load([completeTaskNode], flow, () => {
            const n1 = helper.getNode('n1');

            completeMock.success.mockImplementation(() => {
                expect(completeMock.success).toHaveBeenCalledTimes(1);
                expect(completeMock.success).toHaveBeenCalledWith(variables);
                done();
            });

            n1.receive({
                payload: {
                    complete: completeMock,
                    variables,
                },
            });
        });
    });

    it('should call complete.failure', (done) => {
        var flow = [
            {
                id: 'n1',
                type: 'complete-task',
                name: 'complete-task',
            },
        ];

        helper.load([completeTaskNode], flow, () => {
            const failureMessage = 'oops';

            const n1 = helper.getNode('n1');

            completeMock.failure.mockImplementation(() => {
                expect(completeMock.failure).toHaveBeenCalledTimes(1);
                expect(completeMock.failure).toHaveBeenCalledWith(
                    failureMessage
                );
                done();
            });

            n1.receive({
                payload: {
                    complete: completeMock,
                    type: 'failure',
                    failureMessage,
                },
            });
        });
    });

    it('should call complete.error', (done) => {
        var flow = [
            {
                id: 'n1',
                type: 'complete-task',
                name: 'complete-task',
            },
        ];

        helper.load([completeTaskNode], flow, () => {
            const errorCode = '404';
            const errorMessage = 'Error Not Found';

            const n1 = helper.getNode('n1');

            completeMock.error.mockImplementation(() => {
                expect(completeMock.error).toHaveBeenCalledTimes(1);
                expect(completeMock.error).toHaveBeenCalledWith(
                    errorCode,
                    errorMessage
                );
                done();
            });

            n1.receive({
                payload: {
                    complete: completeMock,
                    type: 'error',
                    errorCode,
                    errorMessage,
                },
            });
        });
    });
});
