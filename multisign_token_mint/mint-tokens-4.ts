import { mintTo, getMint, getAccount } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

// Read keys from JSON file
const data = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

const connection = new Connection(clusterApiUrl("devnet"));

// Create payer from secret key
const payer = Keypair.fromSecretKey(Uint8Array.from(data.payer.secretKey));

// Create signers from secret keys
const signers = data.signers.map((signer: any) => Keypair.fromSecretKey(Uint8Array.from(signer.secretKey)));

// Mint and associated token account addresses
const mint = new PublicKey(data.mintAddress);
const associatedTokenAccountAddress = new PublicKey(data.associatedTokenAccountAddress);

(async () => {
    try {
        // Verify the ownership of the associated token account
        const associatedTokenAccountInfo = await getAccount(connection, associatedTokenAccountAddress);
        const multisigKey = new PublicKey(data.multisigKey);
        if (!associatedTokenAccountInfo.owner.equals(multisigKey)) {
            throw new Error(`Owner mismatch: expected ${multisigKey.toBase58()}, got ${associatedTokenAccountInfo.owner.toBase58()}`);
        }

        // Mint tokens to the associated token account
        const amountToMint = 1_000_000 * 100; // 1,000,000 tokens with 2 decimal places

        const transactionSignature = await mintTo(
            connection,
            payer,
            mint,
            associatedTokenAccountAddress,
            multisigKey,
            amountToMint,
            [signers[0], signers[1]] // At least 2 out of 3 signers
        );

        // Get and print mint info
        const mintInfo = await getMint(connection, mint);
        console.log(`Minted ${mintInfo.supply} token(s)`);
        console.log(`Transaction signature: ${transactionSignature}`);
    } catch (error: any) {
        console.error("Error minting tokens:", error.message);
        if (error.logs) {
            console.error("Transaction logs:", error.logs);
        }
    }
})();
