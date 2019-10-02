const mockJob = { key: '111', variables: {} };
const mockComplete = {
    success: jest.fn(),
    failure: jest.fn(),
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
        close: () => {},
    };
});