import { createMint, createAccount } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

// Read keys from JSON file
const data = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

const connection = new Connection(clusterApiUrl("devnet"));

// Create payer from secret key
const payer = Keypair.fromSecretKey(Uint8Array.from(data.payer.secretKey));

// Multisig public key
const multisigPublicKey = new PublicKey(data.multisigKey);

(async () => {
    try {
        // Create the mint with 2 decimal places
        const mint = await createMint(
            connection,
            payer,
            multisigPublicKey,
            multisigPublicKey,
            2
        );

        console.log("Mint address:", mint.toBase58());

        // Create associated token account owned by the multisig
        const associatedTokenAccount = await createAccount(
            connection,
            payer,
            mint,
            multisigPublicKey
        );

        console.log("Associated Token Account:", associatedTokenAccount.toBase58());

        // Save mint address and associated token account address to JSON
        data.mintAddress = mint.toBase58();
        data.associatedTokenAccountAddress = associatedTokenAccount.toBase58();
        fs.writeFileSync('keys.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error creating mint account or associated token account:", error);
    }
})();
