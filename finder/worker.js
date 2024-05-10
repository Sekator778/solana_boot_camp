const { parentPort } = require('worker_threads');
const { Keypair } = require('@solana/web3.js');

while (true) {
    const keypair = Keypair.generate();
    const publicKeyString = keypair.publicKey.toBase58();
    const secretKeyString = Array.from(keypair.secretKey).join(', ');  // Перетворюємо масив байтів на рядок

    if (publicKeyString.startsWith("Sekator")) {
        parentPort.postMessage(`Public key starts with 'Se': ${publicKeyString}, Secret key: [${secretKeyString}]`);
        break;  // Зупиняє цикл, тому що ключ, який задовольняє умову, знайдений
    }
}
