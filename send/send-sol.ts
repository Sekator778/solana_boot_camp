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
  TransactionInstruction,
} from "@solana/web3.js";

// Define the amount to send as a constant
const AMOUNT_TO_SEND_SOL = 0.0023;

// Initialize the keypair from the provided secret key array
const senderSecretKey = Uint8Array.from([
  211, 124, 243, 68, 31, 152, 183, 137, 230, 57, 133, 25, 75, 20, 154, 170,
  168, 33, 5, 43, 80, 210, 12, 178, 144, 70, 155, 53, 47, 57, 227, 129, 163,
  150, 27, 121, 198, 66, 240, 159, 96, 3, 231, 121, 193, 47, 8, 6, 175, 107,
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

    // Get the memo program ID from https://spl.solana.com/memo
    const memoProgram = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    const memoText = "Hello Sollana bootcamp Kumeka Hub from Sekator!";

    const addMemoInstruction = new TransactionInstruction({
      keys: [{ pubkey: sender.publicKey, isSigner: true, isWritable: true }],
      data: Buffer.from(memoText, "utf-8"),
      programId: memoProgram,
    });

    transaction.add(addMemoInstruction);

    console.log(`📝 Adding memo: ${memoText}...`);

    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
    console.log(`✅ Transaction confirmed, signature: ${signature}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

sendSol();
