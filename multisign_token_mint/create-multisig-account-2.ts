import { createMultisig } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

const connection = new Connection(clusterApiUrl("devnet"));
const data = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

const payer = Keypair.fromSecretKey(Uint8Array.from(data.payer.secretKey));
const signers = data.signers.map((signer: any) => new PublicKey(signer.publicKey));

(async () => {
    const multisigKey = await createMultisig(
        connection,
        payer,
        signers,
        2
    );

    console.log(`Created 2/3 multisig ${multisigKey.toBase58()}`);

    // Save multisig key to JSON
    data.multisigKey = multisigKey.toBase58();
    fs.writeFileSync('keys.json', JSON.stringify(data, null, 2));
})();
