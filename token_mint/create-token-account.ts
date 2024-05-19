import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

// Load the secret key from the .env file
const secretKeyString = process.env.SENDER_SECRET_KEY;
if (!secretKeyString) {
    throw new Error("SENDER_SECRET_KEY environment variable is not set");
}

const senderSecretKey = Uint8Array.from(secretKeyString.split(',').map(Number));
const sender = Keypair.fromSecretKey(senderSecretKey);

console.log(`🔑 Loaded our keypair securely! Our public key is: ${sender.publicKey.toBase58()}`);

// Token Mint Account Public Key
const tokenMintAccount = new PublicKey("8PzwQqrBGLzfV7J8nydYfTPfh7LmnQH1J7SpPATkRpLx");

// Recipient Public Key
const recipient = new PublicKey("sEKAtRdfFdxNotdpUGDDBJtdz54oXyp2FEDg2vSvXAu");

async function createTokenAccount() {
    try {
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            sender,
            tokenMintAccount,
            recipient
        );

        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

        // Create a link to Solana Explorer
        const explorerLink = `https://explorer.solana.com/address/${tokenAccount.address.toBase58()}?cluster=devnet`;
        console.log(`✅ Created token account: ${explorerLink}`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

createTokenAccount();
