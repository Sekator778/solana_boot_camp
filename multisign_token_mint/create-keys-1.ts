import { Keypair } from '@solana/web3.js';
import fs from 'fs';

const keys = {
    payer: Keypair.generate(),
    signer1: Keypair.generate(),
    signer2: Keypair.generate(),
    signer3: Keypair.generate(),
};

const data = {
    payer: {
        publicKey: keys.payer.publicKey.toBase58(),
        secretKey: Array.from(keys.payer.secretKey),
    },
    signers: [
        {
            publicKey: keys.signer1.publicKey.toBase58(),
            secretKey: Array.from(keys.signer1.secretKey),
        },
        {
            publicKey: keys.signer2.publicKey.toBase58(),
            secretKey: Array.from(keys.signer2.secretKey),
        },
        {
            publicKey: keys.signer3.publicKey.toBase58(),
            secretKey: Array.from(keys.signer3.secretKey),
        },
    ],
};

fs.writeFileSync('keys.json', JSON.stringify(data, null, 2));

console.log("Keys generated and saved to keys.json");
