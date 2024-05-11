const { Worker } = require('worker_threads');
const os = require('os');

const numCPUs = os.cpus().length;
let activeWorkers = [];
let totalAttempts = 0; // Total attempts across all workers

function stopAllWorkers() {
    activeWorkers.forEach(worker => worker.terminate());
    activeWorkers = [];
    const endTime = process.hrtime.bigint(); // Capture end time
    const duration = (endTime - startTime) / BigInt(1e9); // Convert to seconds
    console.log(`Total time taken: ${duration} seconds`);
}

const startTime = process.hrtime.bigint(); // Start timing before launching any workers

if (require.main === module) {
    const prefix = process.argv[2];
    if (!prefix) {
        console.error('Please provide a prefix as a command-line argument.');
        process.exit(1);
    }

    console.log(`Running in the main thread with ${numCPUs} CPUs available, looking for prefix '${prefix}'`);

    for (let i = 0; i < numCPUs; i++) {
        const worker = new Worker('./worker.js', { workerData: { prefix } });
        activeWorkers.push(worker);
        worker.on('message', (msg) => {
            console.log(`Received from worker ${worker.threadId}: ${msg}`);
            const matches = /Attempts: (\d+)/.exec(msg);
            if (matches && matches[1]) {
                totalAttempts += parseInt(matches[1], 10);
            }
            // Terminate all workers when one finds the key
            stopAllWorkers();
        });
        worker.on('exit', () => {
            activeWorkers = activeWorkers.filter(w => w.threadId !== worker.threadId);
        });
    }
} else {
    console.error('This script should be run as a main module.');
}
