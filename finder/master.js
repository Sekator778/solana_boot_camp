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
    console.log(`Total loops made: ${totalAttempts}`);
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
          if (msg === 'loop') {
            totalAttempts++;
          }
          else {
            console.log(`Received from worker ${worker.threadId}: ${msg}`);
            stopAllWorkers();
          }
        });
        worker.on('exit', () => {
            activeWorkers = activeWorkers.filter(w => w.threadId !== worker.threadId);
        });
    }
} else {
    console.error('This script should be run as a main module.');
}
