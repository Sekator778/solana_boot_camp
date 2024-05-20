import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js";
import fs from "fs";

// Recipient's secret key (Replace with actual secret key)
const recipientSecretKey = new Uint8Array(
    [...]);
const recipient = Keypair.fromSecretKey(recipientSecretKey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

async function completeTransaction() {
    // Load the partial transaction from the file
    const partialTransactionBuffer = fs.readFileSync("partial-transaction.bin");
    const partialTransaction = Transaction.from(partialTransactionBuffer);

    // Verify that the transaction contains the expected signatures
    const senderPublicKey = partialTransaction.signatures[0]?.publicKey.toString();
    const recipientPublicKey = recipient.publicKey.toString();

    console.log(`Sender Public Key: ${senderPublicKey}`);
    console.log(`Recipient Public Key: ${recipientPublicKey}`);

    // Ensure the sender's public key matches the known public key
    if (senderPublicKey !== "...") {
        throw new Error("Sender public key does not match expected public key.");
    }

    // Partially sign the transaction with the recipient's keypair
    partialTransaction.partialSign(recipient);

    // Ensure the sender's signature is also present before sending
    if (!partialTransaction.signatures.find(sig => sig.publicKey.equals(new PublicKey(senderPublicKey)))) {
        throw new Error("Missing sender's signature.");
    }

    // Print signatures for debugging
    console.log("Transaction Signatures:");
    partialTransaction.signatures.forEach(sig => {
        console.log(`Public Key: ${sig.publicKey.toString()}, Signature: ${sig.signature?.toString('hex')}`);
    });

    // Send the transaction
    try {
        const signature = await sendAndConfirmTransaction(connection, partialTransaction, [recipient]);
        console.log("Transaction sent with signature:", signature);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

completeTransaction().catch(console.error);
