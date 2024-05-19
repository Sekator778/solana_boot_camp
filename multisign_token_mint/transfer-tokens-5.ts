import { transfer, getOrCreateAssociatedTokenAccount, getAccount } from '@solana/spl-token';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';

// Read keys from JSON file
const data = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

const connection = new Connection(clusterApiUrl("devnet"));

// Create payer from secret key
const payer = Keypair.fromSecretKey(Uint8Array.from(data.payer.secretKey));

// Create signers from secret keys
const signers = data.signers.map((signer: any) => Keypair.fromSecretKey(Uint8Array.from(signer.secretKey)));

// Mint, associated token account, and recipient addresses
const mint = new PublicKey(data.mintAddress);
const fromTokenAccount = new PublicKey(data.associatedTokenAccountAddress);
const multisigKey = new PublicKey(data.multisigKey);
const recipientPublicKey = new PublicKey("C1aDCqg1N7oVf5rm8dqFeRYrqt299sV7GzsA3jnfTfz9");

(async () => {
    try {
        // Verify the ownership of the fromTokenAccount
        const fromTokenAccountInfo = await getAccount(connection, fromTokenAccount);
        if (!fromTokenAccountInfo.owner.equals(multisigKey)) {
            throw new Error(`Owner mismatch: expected ${multisigKey.toBase58()}, got ${fromTokenAccountInfo.owner.toBase58()}`);
        }

        // Get or create associated token account for the recipient
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            recipientPublicKey
        );

        console.log(`Recipient associated token account: ${toTokenAccount.address.toBase58()}`);

        // Transfer tokens
        const amountToTransfer = 500 * 100; // 500 tokens with 2 decimal places

        const transactionSignature = await transfer(
            connection,
            payer,
            fromTokenAccount,
            toTokenAccount.address,
            multisigKey, // Ensure multisigKey is used as the owner
            amountToTransfer,
            [signers[0], signers[1]] // At least 2 out of 3 signers
        );

        console.log(`Transferred ${amountToTransfer / 100} tokens to ${toTokenAccount.address.toBase58()}`);
        console.log(`Transaction signature: ${transactionSignature}`);
    } catch (error: any) {
        console.error("Error transferring tokens:", error.message);
        if (error.logs) {
            console.error("Transaction logs:", error.logs);
        }
    }
})();
