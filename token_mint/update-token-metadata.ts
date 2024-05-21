import "dotenv/config";
import {
    Connection,
    clusterApiUrl,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    Keypair
} from "@solana/web3.js";
import {
    createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import fs from 'fs';
import {getExplorerLink} from "@solana-developers/helpers";

// Завантаження секретного ключа з .env
const secretKeyString = process.env.SENDER_SECRET_KEY;
if (!secretKeyString) {
    throw new Error("SENDER_SECRET_KEY environment variable is not set");
}

const user = Keypair.fromSecretKey(Uint8Array.from(secretKeyString.split(',').map(Number)));

// Підключення до devnet
const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Loaded our keypair securely! Our public key is: ${user.publicKey.toBase58()}`);

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// Token mint account from попереднього сценарію
const tokenMintAccount = new PublicKey("8PzwQqrBGLzfV7J8nydYfTPfh7LmnQH1J7SpPATkRpLx");

const metadataData =
    {
    name: "Sekator Training Token",
    symbol: "TRAINING",
    uri: "https://postimg.cc/NKTsqyG9",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
};


const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
);

const metadataPDA = metadataPDAAndBump[0];

const transaction = new Transaction();

const updateMetadataAccountInstruction = createUpdateMetadataAccountV2Instruction(
    {
        metadata: metadataPDA,
        updateAuthority: user.publicKey,
    },
    {
        updateMetadataAccountArgsV2: {
            data: metadataData,
            updateAuthority: user.publicKey,
            primarySaleHappened: null,
            isMutable: true,
        },
    }
);

transaction.add(updateMetadataAccountInstruction);

const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
);

console.log(`🎉 Transaction confirmed with signature: ${signature}`);
console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
);

console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);


