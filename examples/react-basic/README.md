# React Basic - FHEVM SDK Example

A simple React application demonstrating the core encryption and decryption capabilities of the FHEVM SDK. This example shows how to integrate Fully Homomorphic Encryption into a React app using Vite for fast development.

## Features

- **Simple Wallet Connection**: Connect MetaMask or other Web3 wallets
- **Value Encryption**: Encrypt numeric values with various uint types
- **Value Decryption**: Decrypt encrypted handles with user authorization
- **Clean UI**: Modern, responsive interface with dark/light mode support
- **TypeScript**: Full type safety throughout the application
- **Fast Development**: Vite for instant hot module replacement

## What This Example Demonstrates

This example focuses on the **client-side encryption and decryption APIs** of the FHEVM SDK:

- Using `useFhevmEncrypt` hook to encrypt values
- Using `useFhevmDecrypt` hook to decrypt encrypted handles
- Working with different encrypted uint types (uint8, uint16, uint32, etc.)
- Input validation and error handling
- Wallet integration with ethers.js

## Project Structure

```
react-basic/
├── src/
│   ├── components/
│   │   ├── EncryptionDemo.tsx    # Main encryption/decryption UI
│   │   └── WalletConnect.tsx     # Wallet connection component
│   ├── lib/
│   │   └── fhevm.ts              # FHEVM utility functions
│   ├── App.tsx                   # Main app with FHEVM provider
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts             # TypeScript declarations
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Web3 wallet (MetaMask recommended)
- Basic understanding of React and TypeScript

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

### 1. Connect Your Wallet

Click the "Connect Wallet" button and approve the connection in your Web3 wallet.

### 2. Encrypt a Value

1. Enter a numeric value to encrypt
2. Select the encryption type (uint8, uint16, uint32, etc.)
3. Click "Encrypt Value"
4. Copy the generated handle and proof

**Example:**
- Input: `42`
- Type: `uint32`
- Output: Handle + Proof (can be used in smart contracts)

### 3. Decrypt a Value

1. Paste an encrypted handle
2. Enter the contract address where the value is stored
3. Click "Decrypt Value"
4. Sign the authorization in your wallet
5. View the decrypted result

**Note:** Decryption requires the encrypted value to be stored in a smart contract with proper access control.

## FHEVM SDK Integration

This example uses the FHEVM SDK in a React application:

```tsx
import { FhevmProvider, useFhevmEncrypt, useFhevmDecrypt } from '@fhevm/sdk';

// Wrap your app with FhevmProvider
function App() {
  return (
    <FhevmProvider config={{ provider, network }}>
      <YourApp />
    </FhevmProvider>
  );
}

// Use hooks in your components
function EncryptionDemo() {
  const { encrypt, isLoading } = useFhevmEncrypt();
  const result = await encrypt(42, 'uint32');
}
```

## Key Components

### FhevmProvider

Provides FHEVM client context to all child components:

```tsx
<FhevmProvider config={{ provider, network }}>
  <EncryptionDemo />
</FhevmProvider>
```

### useFhevmEncrypt Hook

Hook for encrypting values:

```tsx
const { encrypt, isLoading, error } = useFhevmEncrypt();
const result = await encrypt(value, type);
```

### useFhevmDecrypt Hook

Hook for decrypting values:

```tsx
const { decrypt, isLoading, error } = useFhevmDecrypt();
const plaintext = await decrypt({ contractAddress, handle });
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Supported Networks

This example works with any FHEVM-compatible network:

- **Zama Testnet** (Chain ID: 8009)
- **Sepolia Testnet** (Chain ID: 11155111)
- **Local Hardhat** (Chain ID: 31337)

## Encrypted Types

The FHEVM SDK supports various encrypted unsigned integer types:

| Type | Range | Use Case |
|------|-------|----------|
| uint8 | 0-255 | Small values, flags |
| uint16 | 0-65,535 | Counters, small amounts |
| uint32 | 0-4,294,967,295 | IDs, medium amounts |
| uint64 | 0-18 quintillion | Large values, timestamps |
| uint128 | Very large | Token amounts |
| uint256 | Extremely large | Full Ethereum uint |

## Error Handling

The example includes comprehensive error handling:

- Input validation before encryption
- Network compatibility checks
- Wallet connection errors
- Encryption/decryption failures
- User-friendly error messages

## Differences from Next.js Example

This React Basic example focuses on:

- **Pure client-side operations** (no smart contract deployment)
- **SDK encryption/decryption APIs** (not full application)
- **Lightweight setup** (Vite vs Next.js)
- **Educational focus** (understanding core SDK features)

For a complete application with smart contracts, see the Next.js Music Royalty example.

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Troubleshooting

### MetaMask Connection Issues

- Make sure MetaMask is installed and unlocked
- Check that you're on a supported network
- Try refreshing the page

### Encryption Fails

- Verify the value is within the type's range
- Ensure wallet is connected
- Check network connection

### Decryption Fails

- Verify the handle is valid
- Ensure the contract address is correct
- Confirm you have permission to decrypt
- Check that the value exists in the contract

## Next Steps

After exploring this example:

1. **Try the Next.js example** for a complete application with smart contracts
2. **Build your own app** using the FHEVM SDK
3. **Read the SDK documentation** to learn about advanced features
4. **Experiment with different encrypted types** and use cases

## License

MIT
