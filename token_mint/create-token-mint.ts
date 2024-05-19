import { createMint } from "@solana/spl-token";
import "dotenv/config";
import {
    Connection,
    clusterApiUrl,
    Keypair
} from "@solana/web3.js";

// Load the secret key from the .env file
const secretKeyString = process.env.SENDER_SECRET_KEY;
if (!secretKeyString) {
    throw new Error("SENDER_SECRET_KEY environment variable is not set");
}

const senderSecretKey = Uint8Array.from(secretKeyString.split(',').map(Number));

const sender = Keypair.fromSecretKey(senderSecretKey);

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Loaded our keypair securely! Our public key is: ${sender.publicKey.toBase58()}`);

async function createTokenMint() {
    try {
        const tokenMint = await createMint(
            connection,
            sender,
            sender.publicKey,
            null,
            2 // Decimals
        );

        console.log(`✅ Token Mint: ${tokenMint.toBase58()}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

createTokenMint();
