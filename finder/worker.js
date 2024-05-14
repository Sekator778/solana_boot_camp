const { parentPort, workerData } = require('worker_threads');
const { Keypair } = require('@solana/web3.js');

const prefix = workerData.prefix.toLowerCase(); // Ensure the prefix is in lower case for comparison

while (true) {
    const keypair = Keypair.generate();
    const publicKeyString = keypair.publicKey.toBase58().toLowerCase(); // Convert to lower case
    parentPort.postMessage('loop');

    if (publicKeyString.startsWith(prefix)) {
		const publicKey = keypair.publicKey.toBase58();
        const secretKeyString = Array.from(keypair.secretKey).join(', ');
        parentPort.postMessage(`Public key starts with '${prefix}' ignore case: ${publicKey}, Secret key: [${secretKeyString}]`);
        break;  // Stop the loop as the condition is met
    }
}
