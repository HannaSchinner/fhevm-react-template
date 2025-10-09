# Getting Started with Universal FHEVM SDK

Complete guide to get started building confidential dApps with the Universal FHEVM SDK.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Framework Integration](#framework-integration)
- [First Example](#first-example)
- [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

### Required Tools

- **Node.js**: Version 18.x or higher
- **npm** or **yarn**: Package manager
- **TypeScript**: Version 5.x (optional but recommended)
- **Code Editor**: VS Code recommended with TypeScript extension

### Blockchain Requirements

- **MetaMask**: Browser wallet for testing
- **Sepolia ETH**: Testnet tokens for transactions
- **Ethers.js**: Version 6.x for contract interaction

### Knowledge Requirements

- Basic understanding of JavaScript/TypeScript
- Familiarity with React (for React/Next.js)
- Basic blockchain and smart contract concepts
- Understanding of async/await patterns

---

## Installation

### Step 1: Install the SDK

```bash
# Using npm
npm install @fhevm/sdk ethers

# Using yarn
yarn add @fhevm/sdk ethers

# Using pnpm
pnpm add @fhevm/sdk ethers
```

### Step 2: Verify Installation

```bash
# Check installed version
npm list @fhevm/sdk
```

### Step 3: TypeScript Setup (Optional)

If using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Quick Start

### Vanilla JavaScript / Node.js

```javascript
import { FhevmSDK } from '@fhevm/sdk';

async function main() {
  // Initialize SDK
  const fhevm = await FhevmSDK.init({
    network: 'sepolia'
  });

  // Encrypt a value
  const encrypted = await fhevm.encryptUint8(42);
  console.log('Encrypted:', encrypted);

  // Decrypt (requires authorization)
  const decrypted = await fhevm.decryptUint8(encrypted.data);
  console.log('Decrypted:', decrypted); // 42
}

main().catch(console.error);
```

### React Application

```jsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk';

// 1. Wrap your app with provider
function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <MyComponent />
    </FhevmProvider>
  );
}

// 2. Use hooks in components
function MyComponent() {
  const { fhevm, initState } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt.uint8(42);
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

### Next.js 14 (App Router)

```typescript
// app/providers.tsx
'use client';
import { FhevmProvider } from '@fhevm/sdk';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      {children}
    </FhevmProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';
import { useEncrypt } from '@fhevm/sdk';

export default function Page() {
  const { encrypt } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt.uint8(42);
    console.log(encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

---

## Framework Integration

### React

```bash
# Install dependencies
npm install @fhevm/sdk react react-dom

# Create provider
# See React example above
```

### Next.js

```bash
# Create Next.js app
npx create-next-app@latest my-fhevm-app

# Install SDK
cd my-fhevm-app
npm install @fhevm/sdk

# Follow Next.js example above
```

### Vue 3

```javascript
import { createApp } from 'vue';
import { FhevmSDK } from '@fhevm/sdk';
import App from './App.vue';

const app = createApp(App);

// Initialize SDK globally
FhevmSDK.init({ network: 'sepolia' }).then((fhevm) => {
  app.provide('fhevm', fhevm);
  app.mount('#app');
});

// Use in components
import { inject } from 'vue';

export default {
  setup() {
    const fhevm = inject('fhevm');

    const encryptValue = async () => {
      const encrypted = await fhevm.encryptUint8(42);
      console.log(encrypted);
    };

    return { encryptValue };
  }
};
```

### Node.js Backend

```javascript
const { FhevmSDK } = require('@fhevm/sdk');
const { ethers } = require('ethers');

async function processVote(score) {
  // Initialize with private key
  const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const fhevm = await FhevmSDK.init({
    network: 'sepolia',
    provider: provider,
    signer: wallet
  });

  // Encrypt score
  const encrypted = await fhevm.encryptUint8(score);

  // Submit to contract
  const contract = fhevm.getContract(contractAddress, contractABI);
  const tx = await contract.submitVote(projectId, encrypted.data, encrypted.proof);
  await tx.wait();

  console.log('Vote submitted:', tx.hash);
}
```

---

## First Example

### Complete Voting Example

```typescript
import { FhevmSDK } from '@fhevm/sdk';
import { ethers } from 'ethers';

// Contract ABI (simplified)
const votingABI = [
  'function submitVote(uint8 projectId, bytes memory encryptedScore, bytes memory proof) external',
  'function getProjectScore(uint8 projectId) external view returns (bytes32)',
  'function isAuthorizedVoter(address voter) external view returns (bool)'
];

async function submitConfidentialVote() {
  // 1. Initialize SDK
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });

  // 2. Check wallet connection
  const signer = fhevm.getSigner();
  if (!signer) {
    throw new Error('No wallet connected');
  }

  // 3. Get contract
  const votingContract = fhevm.getContract(
    '0xYourContractAddress',
    votingABI
  );

  // 4. Check authorization
  const isAuthorized = await votingContract.isAuthorizedVoter(
    await signer.getAddress()
  );
  if (!isAuthorized) {
    throw new Error('Not authorized to vote');
  }

  // 5. Encrypt vote score (1-10)
  const score = 7;
  const encrypted = await fhevm.encryptUint8(score);

  // 6. Submit to contract
  const projectId = 1;
  const tx = await votingContract.submitVote(
    projectId,
    encrypted.data,
    encrypted.proof
  );

  // 7. Wait for confirmation
  const receipt = await tx.wait();
  console.log('Vote submitted successfully!');
  console.log('Transaction hash:', receipt.hash);

  return receipt;
}

// Run the example
submitConfidentialVote().catch(console.error);
```

### Error Handling

```typescript
import { FhevmError, ErrorType } from '@fhevm/sdk';

async function encryptWithErrorHandling(value: number) {
  try {
    const fhevm = await FhevmSDK.init({ network: 'sepolia' });
    const encrypted = await fhevm.encryptUint8(value);
    return encrypted;
  } catch (error) {
    if (error instanceof FhevmError) {
      switch (error.type) {
        case ErrorType.NOT_INITIALIZED:
          console.error('SDK not initialized');
          break;
        case ErrorType.ENCRYPTION_ERROR:
          console.error('Encryption failed:', error.message);
          break;
        case ErrorType.NETWORK_ERROR:
          console.error('Network error:', error.message);
          break;
        case ErrorType.INVALID_INPUT:
          console.error('Invalid input:', error.message);
          break;
        default:
          console.error('Unknown error:', error);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

---

## Next Steps

### Learn More

1. **API Reference**: See [api-reference.md](./api-reference.md) for complete API documentation
2. **Examples**: Explore [examples.md](./examples.md) for more use cases
3. **Best Practices**: Read about optimization and security

### Explore Examples

- **Next.js Example**: `examples/nextjs-example/`
- **Privacy Voting**: `examples/privacy-voting/`
- **React Integration**: `examples/react-example/`

### Build Your dApp

1. Start with a framework template
2. Install the SDK
3. Implement encryption for sensitive data
4. Deploy and test on Sepolia
5. Share your creation!

### Get Help

- **Documentation**: [Main README](../README.md)
- **GitHub Issues**: [Report bugs](https://github.com/KittyOrn/fhevm-react-template/issues)
- **Community**: Join Zama Discord

---

## Common Issues

### SDK Not Initializing

```typescript
// Problem: Network not reachable
const fhevm = await FhevmSDK.init({ network: 'sepolia' });

// Solution: Provide custom RPC
const fhevm = await FhevmSDK.init({
  network: 'sepolia',
  rpcUrl: 'https://your-custom-rpc.com'
});
```

### Wallet Not Connected

```typescript
// Check if wallet is available
if (typeof window !== 'undefined' && window.ethereum) {
  // MetaMask is available
  await window.ethereum.request({ method: 'eth_requestAccounts' });
} else {
  console.error('Please install MetaMask');
}
```

### Encryption Fails

```typescript
// Validate input before encrypting
const value = 42;
if (value < 0 || value > 255) {
  throw new Error('Value must be 0-255 for uint8');
}
const encrypted = await fhevm.encryptUint8(value);
```

---

**Ready to build? Start with the [Next.js example](../examples/nextjs-example/)!**
