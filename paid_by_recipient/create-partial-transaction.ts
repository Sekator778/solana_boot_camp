import {
    Connection,
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js";
import fs from "fs";

// Create a connection to the devnet cluster
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Sender's secret key (Replace with actual secret key)
const senderSecretKey = new Uint8Array(
    [....]);
const sender = Keypair.fromSecretKey(senderSecretKey);

// Recipient's public key (Replace with actual public key)
const recipientPublicKey = new PublicKey("....");

async function createPartialTransaction() {
    // Get a recent blockhash
    const { blockhash } = await connection.getRecentBlockhash("confirmed");

    // Create a transaction to transfer 1 SOL, specifying only sender and recipient accounts
    const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: recipientPublicKey, // Set the fee payer as the recipient
    }).add(
        SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: recipientPublicKey,
            lamports: LAMPORTS_PER_SOL,
        })
    );

    // Partially sign the transaction with the sender's keypair
    transaction.partialSign(sender);

    // Save the partial transaction to a file
    fs.writeFileSync("partial-transaction.bin", transaction.serialize({ requireAllSignatures: false }));
    console.log("Partial transaction created and saved to partial-transaction.bin");
}

createPartialTransaction().catch(console.error);
