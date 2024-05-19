import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

// Load the secret key from the .env file
const secretKeyString = process.env.SENDER_SECRET_KEY;
if (!secretKeyString) {
    throw new Error("SENDER_SECRET_KEY environment variable is not set");
}
const senderSecretKey = Uint8Array.from(secretKeyString.split(',').map(Number));
const sender = Keypair.fromSecretKey(senderSecretKey);

console.log(`🔑 Loaded our keypair securely! Our public key is: ${sender.publicKey.toBase58()}`);

// Substitute in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey(
    "8PzwQqrBGLzfV7J8nydYfTPfh7LmnQH1J7SpPATkRpLx"
);
const recipientAssociatedTokenAccount = new PublicKey(
    "Bc9jVWCYdjy5kEefUTDAbfbG5SS7YhDCiuRozPiCtPDz"
);

async function mintTokens() {
    try {
        const transactionSignature = await mintTo(
            connection,
            sender,
            tokenMintAccount,
            recipientAssociatedTokenAccount,
            sender,
            10 * MINOR_UNITS_PER_MAJOR_UNITS
        );

        const link = `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`;
        console.log(`✅ Success! Mint Token Transaction: ${link}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

mintTokens();
