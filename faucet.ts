import "dotenv/config";
import {
  getKeypairFromEnvironment,
  airdropIfRequired,
} from "@solana-developers/helpers";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`⚡️ Connected to devnet`);

const publicKey = new PublicKey("C1aDCqg1N7oVf5rm8dqFeRYrqt299sV7GzsA3jnfTfz9");

await airdropIfRequired(
  connection,
  publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

console.log(
  `We get airdrop`
);


const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
);

