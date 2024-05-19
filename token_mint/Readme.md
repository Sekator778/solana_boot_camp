# Solana Token Operations

This project demonstrates how to perform various token operations on the Solana blockchain using the Solana Web3.js and SPL Token libraries. The tasks include creating a token mint and minting your own tokens.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies:

    ```bash
    npm install @solana/web3.js @solana/spl-token dotenv
    ```

## Configuration

**Note: Don't share your secret key with anyone. Here, it's only used for demo purposes.**

1. Create a `.env` file in the root of your project.
2. Add your sender's secret key to the `.env` file:

    ```env
    SENDER_SECRET_KEY=211,124,243,68,31,152,183,137,230,57,133,25,75,20,154,170,168,33,5,43,80,210,12,178,144,70,155,53,47,57,227,129,163,150,27,121,198,66,240,159,96,3,231,121,193,47,8,6,175,107,204,75,140,253,75,238,160,206,84,148,112,85,218,90
    ```

## Usage

### 1. Create Token Mint

This script creates a new token mint on the Solana blockchain using the provided keypair as the mint authority.

#### Description

The script reads the sender's secret key from the `.env` file and initializes a `Keypair` object. It then establishes a connection to the Solana devnet. Using the `createMint` function from the `@solana/spl-token` library, it creates a new token mint with the specified number of decimals.

#### Running the Script

To run the script, use the following command:

```bash
npx esrun create-token-mint.ts
```

### 2. Create token account
This script creates a new token account for the specified mint and owner.

#### Running the Script

To run the script, use the following command:

```bash
npx esrun create-token-account.ts
```

### 3. Mint Tokens
This script mints new tokens to the specified token account.