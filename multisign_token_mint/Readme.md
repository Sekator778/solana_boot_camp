### README.md

# Solana Multisig Token Mint and Transfer

This repository contains scripts to create a multisig token mint and transfer process on the Solana blockchain.

## Prerequisites

- Node.js and npm installed
- TypeScript installed globally
- Solana CLI installed and configured
- An internet connection to connect to the Solana Devnet

## Steps

### 1. Generate Keys

Generate cryptographic key pairs for the payer and signers, and save them to `keys.json`.

```sh
npx ts-node create-keys-1.ts
```

### 2. Create Multisig Account

Create a multisig account that requires signatures from at least two out of three signers.

```sh
npx ts-node create-multisig-account-2.ts
```

### 3. Create Mint and Associated Token Account

Create a mint account for a new token and an associated token account owned by the multisig account.

```sh
npx ts-node create-mint-account-3.ts
```

### 4. Mint Tokens

Mint a specified amount of tokens to the associated token account.

```sh
npx ts-node mint-tokens-4.ts
```

### 5. Transfer Tokens

Transfer tokens from the associated token account to another account.

```sh
npx ts-node transfer-tokens-5.ts
```

## Detailed Explanation

### Step 1: Generate Keys

The `create-keys-1.ts` script generates cryptographic key pairs for the payer and three signers, and stores these keys in a `keys.json` file.

### Step 2: Create Multisig Account

The `create-multisig-account-2.ts` script reads the keys from the `keys.json` file and creates a multisig account that requires multiple signers to approve transactions. The multisig account key is then saved to the `keys.json` file.

### Step 3: Create Mint and Associated Token Account

The `create-mint-account-3.ts` script creates a mint account for a new token and an associated token account for one of the signers. Both the mint and associated token account addresses are saved to the `keys.json` file.

### Step 4: Mint Tokens

The `mint-tokens-4.ts` script mints a specified number of tokens to the associated token account, verifying that the multisig account is correctly identified as the owner.

### Step 5: Transfer Tokens

The `transfer-tokens-5.ts` script transfers a specified amount of tokens from the multisig-controlled associated token account to another account, requiring signatures from at least two of the signers.

## Files

- `create-keys-1.ts`: Script to generate keys and save to `keys.json`.
- `create-multisig-account-2.ts`: Script to create a multisig account.
- `create-mint-account-3.ts`: Script to create a mint and associated token account.
- `mint-tokens-4.ts`: Script to mint tokens.
- `transfer-tokens-5.ts`: Script to transfer tokens.

## Notes

- Ensure each script runs successfully before proceeding to the next step.
- Verify transactions and token balances using Solana Explorer or appropriate tools.

### Usage Instructions

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Run the scripts in the specified order**.

This `README.md` provides a clear guide on how to set up and execute the entire process without needing to modify the scripts. Let me know if you need any further modifications or additions!