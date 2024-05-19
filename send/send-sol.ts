import "dotenv/config";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  Connection,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

// Define the amount to send as a constant
const AMOUNT_TO_SEND_SOL = 0.0123;
// Initialize the key from the provided secret key array
const senderSecretKey = Uint8Array.from([
  211, 124, 24.....9, 96, 3, 231, 121, 193, 47, 8, 6, 175, 107,
  204, 75, 140, 253, 75, 238, 160, 206, 84, 148, 112, 85, 218, 90
]);
const sender = Keypair.fromSecretKey(senderSecretKey);

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Loaded our keypair securely! Our public key is: ${sender.publicKey.toBase58()}`);

// Put the public key to whom you want to send the sol
const recipient = new PublicKey("sEKAtRdfFdxNotdpUGDDBJtdz54oXyp2FEDg2vSvXAu");
console.log(`💸 Attempting to send ${AMOUNT_TO_SEND_SOL} SOL to ${recipient.toBase58()}...`);

async function sendSol() {
  try {
    const transaction = new Transaction();

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient,
      lamports: AMOUNT_TO_SEND_SOL * LAMPORTS_PER_SOL,
    });

    transaction.add(sendSolInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
    console.log(`✅ Transaction confirmed, signature: ${signature}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

sendSol();
