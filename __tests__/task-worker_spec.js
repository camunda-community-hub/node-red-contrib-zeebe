const helper = require('node-red-node-test-helper');
const taskWorkerNode = require('../src/nodes/task-worker.js');
const zeebeNode = require('../src/nodes/zeebe');

helper.init(require.resolve('node-red'));

describe('task-worker node', () => {
    beforeEach((done) => {
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should output response from zeebe-node', (done) => {
        var flow = [
            {
                id: 'n1',
                type: 'zeebe',
                name: 'zeebe',
                contactPoint: 'localhost:1234',
            },
            {
                id: 'n2',
                type: 'task-worker',
                name: 'task-worker',
                zeebe: 'n1',
                wires: [['n3']],
            },
            { id: 'n3', type: 'helper' },
        ];

        helper.load([zeebeNode, taskWorkerNode], flow, () => {
            const n3 = helper.getNode('n3');

            n3.on('input', (msg) => {
                Promise.resolve().then(() => {
                    expect(msg.payload.job.complete).toBeDefined();
                    expect(msg.payload.job.fail).toBeDefined();
                    expect(msg.payload.job.error).toBeDefined();
                    done();
                });
            });
        });
    });
});
