# FHEVM SDK

A comprehensive, framework-agnostic SDK for building confidential applications using Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) technology. This SDK enables developers to work with encrypted data on the blockchain while maintaining privacy and confidentiality.

## Features

- **Framework-Agnostic Core**: Works with any JavaScript/TypeScript framework
- **React Integration**: Optional React hooks for seamless integration
- **Wagmi-Style API**: Familiar API structure for web3 developers
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Encryption Utilities**: Built-in helpers for encrypting various data types
- **Decryption Support**: Both user-authorized and public decryption modes
- **Batch Operations**: Efficient batch encryption and decryption
- **Contract Helpers**: Simplified smart contract interactions
- **EIP-712 Signatures**: User authorization through standard signing

## Installation

```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
# or
pnpm add @fhevm/sdk
```

## Quick Start

### Framework-Agnostic Usage

```typescript
import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize the client
const provider = new BrowserProvider(window.ethereum);
const client = new FhevmClient({
  provider,
  network: 8009, // Zama testnet
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: '0x...'
});

await client.initialize();

// Encrypt a value
const encrypted = await client.encrypt(42, 'uint32');
console.log('Encrypted:', encrypted);

// Decrypt a value
const decrypted = await client.decrypt({
  contractAddress: '0x123...',
  handle: '0xabc...',
  signer: yourSigner
});
console.log('Decrypted:', decrypted.toString());
```

### React Usage

```typescript
import { FhevmProvider, useFhevmEncrypt, useFhevmDecrypt } from '@fhevm/sdk';

// Wrap your app with the provider
function App() {
  return (
    <FhevmProvider config={{
      provider: browserProvider,
      network: 8009,
      gatewayUrl: 'https://gateway.zama.ai'
    }}>
      <YourApp />
    </FhevmProvider>
  );
}

// Use hooks in your components
function EncryptComponent() {
  const { encrypt, isEncrypting, error } = useFhevmEncrypt();

  const handleEncrypt = async () => {
    const result = await encrypt(42, 'uint32');
    if (result) {
      console.log('Encrypted successfully:', result);
    }
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
    </button>
  );
}
```

## Core API

### FhevmClient

The main client class for FHEVM operations.

```typescript
// Create and initialize client
const client = new FhevmClient(config);
await client.initialize();

// Check initialization status
if (client.isInitialized()) {
  console.log('Client is ready');
}

// Get FHEVM instance for advanced usage
const instance = client.getInstance();
```

### Encryption

```typescript
import { encryptInput, encryptMultiple, encryptAddress, encryptBool } from '@fhevm/sdk';

// Encrypt a single value
const encrypted = await encryptInput(instance, 42, 'uint32');

// Encrypt multiple values efficiently
const batch = await encryptMultiple(instance, [
  { value: 42, type: 'uint32' },
  { value: 100n, type: 'uint64' },
  { value: 7, type: 'uint8' }
]);

// Encrypt an address
const encryptedAddr = await encryptAddress(instance, '0x742d35Cc...');

// Encrypt a boolean
const encryptedBool = await encryptBool(instance, true);
```

### Decryption

```typescript
import { userDecrypt, publicDecrypt, batchDecrypt } from '@fhevm/sdk';

// User-authorized decryption (requires signature)
const value = await userDecrypt(
  signer,
  contractAddress,
  handle,
  gatewayUrl
);

// Public decryption (no signature required)
const publicValue = await publicDecrypt(
  contractAddress,
  handle,
  gatewayUrl
);

// Batch decrypt multiple handles
const values = await batchDecrypt(
  ['0xabc...', '0xdef...', '0x123...'],
  contractAddress,
  gatewayUrl,
  signer
);
```

### Instance Management

```typescript
import { createFhevmInstance, getFhevmInstance, clearInstanceCache } from '@fhevm/sdk';

// Create or get cached instance
const instance = await createFhevmInstance({
  chainId: 8009,
  networkUrl: 'https://devnet.zama.ai',
  gatewayUrl: 'https://gateway.zama.ai'
});

// Get existing instance
const cached = getFhevmInstance(8009);

// Clear cache
clearInstanceCache(8009); // Clear specific chain
clearInstanceCache();     // Clear all
```

## React Hooks

### useFhevmEncrypt

Hook for encrypting data with automatic state management.

```typescript
function MyComponent() {
  const { encrypt, isEncrypting, error } = useFhevmEncrypt();

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value, 'uint32');
    if (encrypted) {
      // Use encrypted data
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <button onClick={() => handleSubmit(42)} disabled={isEncrypting}>
      Encrypt
    </button>
  );
}
```

### useFhevmDecrypt

Hook for decrypting data.

```typescript
function MyComponent() {
  const { decrypt, publicDecrypt, isDecrypting, error } = useFhevmDecrypt();
  const signer = useSigner(); // Your wallet signer

  const handleDecrypt = async () => {
    const value = await decrypt({
      contractAddress: '0x123...',
      handle: '0xabc...',
      signer
    });
    console.log('Decrypted:', value?.toString());
  };

  return (
    <button onClick={handleDecrypt} disabled={isDecrypting}>
      Decrypt
    </button>
  );
}
```

### useFhevmContract

Hook for contract interactions.

```typescript
function MyComponent() {
  const { call, read, isLoading, error } = useFhevmContract();
  const signer = useSigner();

  // Write operation
  const handleWrite = async () => {
    const tx = await call({
      address: '0x123...',
      abi: contractAbi,
      functionName: 'storeValue',
      args: [encryptedHandle, proof],
      signer
    });
    await tx.wait();
  };

  // Read operation
  const handleRead = async () => {
    const value = await read({
      address: '0x123...',
      abi: contractAbi,
      functionName: 'getValue'
    });
    console.log('Value:', value);
  };

  return (
    <>
      <button onClick={handleWrite} disabled={isLoading}>Write</button>
      <button onClick={handleRead} disabled={isLoading}>Read</button>
    </>
  );
}
```

### useFhevmEncryptedCall

Hook for encrypting and calling contract in one operation.

```typescript
function MyComponent() {
  const { encryptAndCall, isLoading, error } = useFhevmEncryptedCall();
  const signer = useSigner();

  const handleSubmit = async (value: number) => {
    const tx = await encryptAndCall(
      value,
      'uint32',
      {
        address: '0x123...',
        abi: contractAbi,
        functionName: 'storeEncryptedValue',
        signer
      }
    );
    console.log('Transaction:', tx);
  };

  return (
    <button onClick={() => handleSubmit(42)} disabled={isLoading}>
      Submit
    </button>
  );
}
```

### useFhevmContractWatch

Hook for watching contract values with auto-refresh.

```typescript
function MyComponent() {
  const { data, isLoading, error, refetch } = useFhevmContractWatch(
    {
      address: '0x123...',
      abi: contractAbi,
      functionName: 'getTotalSupply'
    },
    {
      watch: true,
      pollingInterval: 5000 // Poll every 5 seconds
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Total Supply: {data?.toString()}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useFhevmBatchEncrypt

Hook for batch encrypting multiple values.

```typescript
function MyComponent() {
  const { encryptBatch, isEncrypting, error } = useFhevmBatchEncrypt();

  const handleBatchEncrypt = async () => {
    const encrypted = await encryptBatch([
      { value: 42, type: 'uint32' },
      { value: 100n, type: 'uint64' },
      { value: 7, type: 'uint8' }
    ]);

    if (encrypted) {
      console.log('Encrypted batch:', encrypted.handles);
    }
  };

  return (
    <button onClick={handleBatchEncrypt} disabled={isEncrypting}>
      Encrypt Batch
    </button>
  );
}
```

## Utility Functions

### Address and Handle Formatting

```typescript
import { formatAddress, formatHandle, isValidAddress } from '@fhevm/sdk';

// Format addresses for display
const short = formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
// Output: "0x742d...0bEb"

// Format handles
const handle = formatHandle('0x123456789abcdef123456789');
// Output: "0x1234...6789"

// Validate addresses
if (isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')) {
  console.log('Valid address');
}
```

### Async Utilities

```typescript
import { retry, sleep, debounce } from '@fhevm/sdk';

// Retry with exponential backoff
const result = await retry(
  async () => await fetchData(),
  3,    // max retries
  1000  // base delay in ms
);

// Simple sleep
await sleep(1000); // Wait 1 second

// Debounce function
const debouncedSearch = debounce(
  async (query: string) => {
    const results = await search(query);
    console.log(results);
  },
  300 // delay in ms
);
```

### Type Conversions

```typescript
import { bigIntToHex, hexToBigInt } from '@fhevm/sdk';

// Convert BigInt to hex
const hex = bigIntToHex(42n);
// Output: "0x2a"

// Convert hex to BigInt
const value = hexToBigInt('0x2a');
// Output: 42n
```

## Configuration

### Network Configuration

```typescript
const config = {
  provider: browserProvider,     // Ethers.js BrowserProvider
  network: 8009,                 // Chain ID (8009 for Zama testnet)
  gatewayUrl: 'https://gateway.zama.ai',  // Gateway URL
  aclAddress: '0x...'           // ACL contract address (optional)
};
```

### Supported Networks

- **Zama Testnet**: Chain ID 8009
- Custom networks are supported by providing appropriate configuration

### Encrypted Types

The SDK supports the following encrypted types:

- `uint8` - 8-bit unsigned integer
- `uint16` - 16-bit unsigned integer
- `uint32` - 32-bit unsigned integer
- `uint64` - 64-bit unsigned integer
- `uint128` - 128-bit unsigned integer
- `uint256` - 256-bit unsigned integer
- `ebool` - Encrypted boolean
- `eaddress` - Encrypted address

## TypeScript Support

The SDK is written in TypeScript and includes comprehensive type definitions. All types are exported and can be imported:

```typescript
import type {
  FhevmConfig,
  EncryptResult,
  DecryptParams,
  EncryptedUintType,
  ContractCallParams
} from '@fhevm/sdk';
```

## Error Handling

All async operations can throw errors. Always use try-catch or check return values:

```typescript
// Using try-catch
try {
  const encrypted = await client.encrypt(42, 'uint32');
  console.log('Success:', encrypted);
} catch (error) {
  console.error('Encryption failed:', error.message);
}

// Using hooks (errors are returned)
const { encrypt, error } = useFhevmEncrypt();
if (error) {
  console.error('Error:', error.message);
}
```

## Best Practices

1. **Initialize Once**: Create one client instance and reuse it across your application
2. **Use Provider**: In React apps, use `FhevmProvider` at the root level
3. **Handle Loading States**: Always show loading indicators during async operations
4. **Batch Operations**: Use batch functions when encrypting multiple values
5. **Error Handling**: Always handle errors gracefully
6. **Type Safety**: Leverage TypeScript types for better developer experience
7. **Cache Management**: Use instance caching for better performance

## Examples

### Complete React Application

```typescript
import { FhevmProvider, useFhevmEncrypt, useFhevmContract } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

function App() {
  const provider = new BrowserProvider(window.ethereum);

  return (
    <FhevmProvider config={{
      provider,
      network: 8009,
      gatewayUrl: 'https://gateway.zama.ai'
    }}>
      <ConfidentialApp />
    </FhevmProvider>
  );
}

function ConfidentialApp() {
  const { encrypt, isEncrypting } = useFhevmEncrypt();
  const { call, isLoading } = useFhevmContract();
  const signer = useSigner(); // Your wallet hook

  const handleSubmit = async (value: number) => {
    // Encrypt the value
    const encrypted = await encrypt(value, 'uint32');
    if (!encrypted) return;

    // Call contract with encrypted data
    const tx = await call({
      address: '0x123...',
      abi: contractAbi,
      functionName: 'storeValue',
      args: [encrypted.handles[0], encrypted.proof],
      signer
    });

    await tx.wait();
    console.log('Value stored successfully!');
  };

  return (
    <button
      onClick={() => handleSubmit(42)}
      disabled={isEncrypting || isLoading}
    >
      Store Encrypted Value
    </button>
  );
}
```

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## Support

For issues, questions, or contributions, please visit the GitHub repository.

## Resources

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [GitHub Repository](https://github.com/zama-ai/fhevm)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.
