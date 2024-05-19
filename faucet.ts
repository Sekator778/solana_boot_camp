import "dotenv/config";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

async function main() {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));
    console.log(`⚡️ Connected to devnet`);

    // put your key here
    const publicKeyStr = "sEKAtRdfFdxNotdpUGDDBJtdz54oXyp2FEDg2vSvXAu";
    if (!PublicKey.isOnCurve(publicKeyStr)) {
      throw new Error("Invalid public key");
    }
    
    const publicKey = new PublicKey(publicKeyStr);
    console.log(`🔑 Using public key: ${publicKey.toString()}`);
	// write count of sol here
    console.log(`💧 Requesting airdrop of 1 SOL...`);
    const airdropSignature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
    console.log(`🔗 Airdrop transaction signature: ${airdropSignature}`);

    console.log(`⏳ Waiting for confirmation...`);
    await connection.confirmTransaction(airdropSignature);
    console.log(`💧 Airdrop confirmed`);

    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
    console.log(`💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL} SOL!`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
