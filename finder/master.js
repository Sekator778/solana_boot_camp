const { Worker } = require('worker_threads');
const os = require('os');

const numCPUs = os.cpus().length;
let activeWorkers = [];

function stopAllWorkers() {
    activeWorkers.forEach(worker => worker.terminate());
    activeWorkers = [];
}

if (require.main === module) {
    console.log(`Running in the main thread with ${numCPUs} CPUs available`);

    for (let i = 0; i < numCPUs; i++) {
        const worker = new Worker('./worker.js');
        activeWorkers.push(worker);
        worker.on('message', (msg) => {
            console.log(`Received from worker ${worker.threadId}: ${msg}`);
            // Terminate all workers when one finds the key
            stopAllWorkers();
        });
        worker.on('exit', () => {
            activeWorkers = activeWorkers.filter(w => w.threadId !== worker.threadId);
            console.log(`Worker ${worker.threadId} has stopped.`);
        });
    }
} else {
    console.error('This script should be run as a main module.');
}
