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

// Token mint account from keys.json
const tokenMintAccount = new PublicKey("8PzwQqrBGLzfV7J8nydYfTPfh7LmnQH1J7SpPATkRpLx");

// Використання зображення з іншого ресурсу
const imageUrl = "https://s3.amazonaws.com/your-bucket-name/your-image.png";

const metadataData = {
    name: "Sekator Training Token",
    symbol: "TRAINING",
    uri: imageUrl,
    sellerFeeBasisPoints: 500,
    creators: [
        {
            address: user.publicKey,
            verified: true,
            share: 100
        }
    ],
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
