# FHEVM Node.js Template

A Node.js CLI template with FHEVM SDK integration for server-side FHE operations.

## Features

- Command-line interface
- FHEVM SDK integration
- TypeScript support
- Server-side encryption/decryption

## Getting Started

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run CLI commands
npm start encrypt 1000
npm start decrypt 0x...
```

## Commands

### Encrypt

```bash
fhevm-cli encrypt <value>
```

Encrypts a numeric value using FHE.

### Decrypt

```bash
fhevm-cli decrypt <encrypted_value>
```

Decrypts an encrypted value.

## Environment Variables

Create a `.env` file:

```
RPC_URL=https://rpc.sepolia.eth
```

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Node.js Documentation](https://nodejs.org/)
