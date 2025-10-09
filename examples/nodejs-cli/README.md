# Node.js CLI FHEVM Tool

A command-line interface demonstrating framework-agnostic FHEVM SDK usage. Perfect for automation, scripting, and backend integration.

## Overview

This CLI tool shows how to use the FHEVM SDK core (without React) in a Node.js environment. It provides commands for:

- 🔒 **Encryption** - Encrypt values for smart contracts
- 🔓 **Decryption** - Decrypt encrypted data with EIP-712 signatures
- 📝 **Contract Interaction** - Call smart contract methods
- 🤖 **Automation** - Use in scripts and CI/CD pipelines

## Features

- Framework-agnostic SDK usage (no React required)
- Beautiful CLI output with colors and spinners
- Environment variable configuration
- Error handling and validation
- TypeScript support
- Can be used as a library or standalone tool

## Installation

```bash
# Install dependencies from root
cd ../..
npm install

# Or install for this example only
npm install
```

## Build

```bash
# Compile TypeScript
npm run build

# Or use tsx for development (no build needed)
npm run dev
```

## Usage

### Encrypt Command

Encrypt a value using FHEVM:

```bash
# Basic usage
npm run encrypt 42

# With custom type
npm run dev -- encrypt 1000 --type uint64

# With custom network
npm run dev -- encrypt 42 --network 11155111 --rpc https://sepolia.infura.io/v3/YOUR_KEY

# Full command
npm run dev -- encrypt 42 --type uint32 --network 8009
```

**Output:**
```
✅ Encryption successful!

Encryption Results:
────────────────────────────────────────────────────────────
Original Value: 42
Type: uint32
Network: 8009

Encrypted Data:
0a1b2c3d4e5f6...

Handles:
  [0] 0x1234567890abcdef...

Input Proof:
abcdef1234567890...

💡 Tip: Use this encrypted data when calling smart contract functions
```

### Decrypt Command

Decrypt an encrypted value from a contract:

```bash
# Decrypt with CLI options
npm run dev -- decrypt <HANDLE> \
  --contract 0x123...abc \
  --key your_private_key \
  --network 8009

# Or use environment variables
export PRIVATE_KEY=your_private_key
npm run decrypt <HANDLE> --contract 0x123...abc
```

**Output:**
```
✅ Decryption successful!

Decryption Results:
────────────────────────────────────────────────────────────
Contract: 0x123...abc
Handle: 0xabc...123
Network: 8009

Decrypted Value:
  42

💡 This value was decrypted using your EIP-712 signature
```

### Contract Command

Interact with FHEVM smart contracts:

```bash
# Read-only call
npm run dev -- contract 0x123...abc getBalance \
  --args 0x456...def \
  --abi ./contract-abi.json \
  --read

# Write operation
npm run dev -- contract 0x123...abc transfer \
  --args 0x456...def 100 \
  --abi ./contract-abi.json \
  --key your_private_key \
  --network 8009
```

## Configuration

### Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Private key for signing (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URL
RPC_URL=https://devnet.zama.ai

# Network Chain ID
NETWORK_ID=8009

# Gateway URL for decryption
GATEWAY_URL=https://gateway.zama.ai
```

### Command-line Options

All commands support these options:

- `-n, --network <chainId>` - Network chain ID (default: 8009)
- `-r, --rpc <url>` - RPC URL (default: from env or https://devnet.zama.ai)
- `-k, --key <privateKey>` - Private key for signing

## Examples

### 1. Encrypt Multiple Values

```bash
# Encrypt different types
npm run dev -- encrypt 255 --type uint8
npm run dev -- encrypt 65535 --type uint16
npm run dev -- encrypt 4294967295 --type uint32
npm run dev -- encrypt 18446744073709551615 --type uint64
```

### 2. Decrypt from Contract

```bash
# Set environment
export PRIVATE_KEY=0x1234567890abcdef...
export CONTRACT_ADDRESS=0xabcdef1234567890...

# Decrypt
npm run dev -- decrypt 0xhandle123... \
  --contract $CONTRACT_ADDRESS
```

### 3. Contract Interaction

```bash
# Read contract state
npm run dev -- contract 0x123...abc totalTracks \
  --abi ./PrivateMusicRoyalty.json \
  --read

# Register as rights holder
npm run dev -- contract 0x123...abc registerRightsHolder \
  --abi ./PrivateMusicRoyalty.json \
  --key $PRIVATE_KEY
```

### 4. Use in Scripts

```bash
#!/bin/bash

# Encrypt royalty share
ENCRYPTED=$(npm run dev -- encrypt 5000 --type uint32 | grep "Handles" -A 1 | tail -1)

# Register track with encrypted share
npm run dev -- contract $CONTRACT_ADDRESS registerTrack \
  --args "ipfs://QmX..." [$HOLDER_ADDRESS] [$ENCRYPTED] \
  --abi ./contract-abi.json \
  --key $PRIVATE_KEY
```

## Code Structure

```
nodejs-cli/
├── src/
│   ├── index.ts                    # Main CLI entry point
│   ├── commands/
│   │   ├── encrypt.ts              # Encryption command
│   │   ├── decrypt.ts              # Decryption command
│   │   └── contract.ts             # Contract interaction
│   └── lib/
│       └── config.ts               # Configuration management
├── .env.example                    # Environment template
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## FHEVM SDK Usage (Framework-Agnostic)

This example demonstrates using the FHEVM SDK core without React:

```typescript
import { FhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

// Create provider (no browser required)
const provider = new JsonRpcProvider('https://devnet.zama.ai');

// Initialize FHEVM client
const client = new FhevmClient({
  provider: provider as any,
  network: 8009,
});

await client.initialize();

// Encrypt value
const encrypted = await client.encrypt(42, 'uint32');

// Decrypt value (requires signer)
const decrypted = await client.decrypt({
  contractAddress: '0x...',
  handle: '0x...',
  signer: wallet,
});
```

## Use Cases

### 1. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
- name: Encrypt configuration
  run: |
    npx fhevm-cli encrypt $SECRET_VALUE --type uint32 > encrypted.txt
```

### 2. Backend Service

```typescript
import { exec } from 'child_process';

// Encrypt value in backend
const encrypted = await new Promise((resolve, reject) => {
  exec('fhevm-cli encrypt 42 --type uint32', (error, stdout) => {
    if (error) reject(error);
    else resolve(stdout);
  });
});
```

### 3. Testing Scripts

```bash
# test-contract.sh
#!/bin/bash

# Deploy contract
CONTRACT=$(hardhat run scripts/deploy.ts)

# Encrypt test data
ENCRYPTED=$(fhevm-cli encrypt 100 --type uint32)

# Test contract
fhevm-cli contract $CONTRACT testMethod --args $ENCRYPTED --read
```

## Troubleshooting

### "Private key is required"
- Set `PRIVATE_KEY` in `.env` file
- Or use `--key` flag with the command

### "Contract call failed"
- Check contract address is correct
- Verify ABI file exists and is valid JSON
- Ensure you have sufficient gas/funds
- Check network configuration

### TypeScript errors
- Run `npm run build` to compile
- Or use `npm run dev -- <command>` with tsx

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama Documentation](https://docs.zama.ai)
- [Commander.js](https://github.com/tj/commander.js)
- [Ethers.js](https://docs.ethers.org)

## License

MIT
