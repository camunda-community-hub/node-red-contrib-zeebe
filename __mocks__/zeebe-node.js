const mockJob = { key: '111', variables: {} ,
    complete: jest.fn(),
    fail: jest.fn(),
    error: jest.fn(),
    forward: jest.fn(),
};

exports.ZBClient = jest.fn().mockImplementation(() => {
    return {
        createWorker: ({
            taskType,
            taskHandler,
            ...workerOptions
        }) => {
            // call the handler asynchronously right after ZBClient has been created
            setTimeout(() => taskHandler(mockJob));
        },
        publishMessage: jest.fn(),
        publishStartMessage: jest.fn(),
        deployResource: jest.fn().mockResolvedValue({ bpmnProcessId: 'my-process' }),
        
        createProcessInstance: jest.fn(),
        close: () => {},
    };
});
