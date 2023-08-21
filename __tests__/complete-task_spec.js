const helper = require('node-red-node-test-helper');
const completeTaskNode = require('../src/nodes/complete-task.js');

helper.init(require.resolve('node-red'));

const jobMock = {
    complete: jest.fn(),
    fail: jest.fn(),
    error: jest.fn(),
    variables: { workflowId: 123 }
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

    it('should call job.complete with variables', (done) => {
        var flow = [
            {
                id: 'n1',
                type: 'complete-task',
                name: 'complete-task',
            },
        ];

        helper.load([completeTaskNode], flow, () => {
            const n1 = helper.getNode('n1');
            jobMock.complete.mockImplementation(() => {
                expect(jobMock.complete).toHaveBeenCalledTimes(1);
                expect(jobMock.complete).toHaveBeenCalledWith(jobMock.variables);
                done();
            });

            n1.receive({
                payload: {
                    job: jobMock,
                    variables: jobMock.variables,
                   
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

            jobMock.fail.mockImplementation(() => {
                expect(jobMock.fail).toHaveBeenCalledTimes(1);
                expect(jobMock.fail).toHaveBeenCalledWith(
                    failureMessage
                );
                done();
            });

            n1.receive({
                payload: {
                    job: jobMock,
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

            jobMock.error.mockImplementation(() => {
                expect(jobMock.error).toHaveBeenCalledTimes(1);
                expect(jobMock.error).toHaveBeenCalledWith(
                    {
                        errorCode,
                        errorMessage,
                        variables: jobMock.variables,
                    }
                );
                done();
            });

            n1.receive({
                payload: {
                    job: jobMock,
                    type: 'error',
                    errorCode,
                    errorMessage,
                    variables: jobMock.variables,
                },
            });
        });
    });
});
