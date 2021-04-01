const mockJob = { key: '111', variables: {} };
const mockComplete = {
    success: jest.fn(),
    failure: jest.fn(),
    error: jest.fn(),
};

exports.ZBClient = jest.fn().mockImplementation(() => {
    return {
        createWorker: (
            workerName,
            taskType,
            handler,
            workerOptions,
            onConnectionError
        ) => {
            // call the handler asynchronously right after ZBClient has been created
            setTimeout(() => handler(mockJob, mockComplete));
        },
        publishMessage: jest.fn(),
        publishStartMessage: jest.fn(),
        deployWorkflow: jest.fn().mockResolvedValue({
            workflows: [{ bpmnProcessId: 'my-process' }],
        }),
        createProcessInstance: jest.fn(),
        close: () => {},
    };
});
