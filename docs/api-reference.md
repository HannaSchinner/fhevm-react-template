# API Reference

Complete API documentation for the Universal FHEVM SDK.

## Table of Contents

- [FhevmSDK Class](#fhevmsdk-class)
- [React Hooks](#react-hooks)
- [Types](#types)
- [Error Handling](#error-handling)

---

## FhevmSDK Class

Core SDK class for FHE operations.

### Initialization

#### `FhevmSDK.init(config)`

Initialize the FHEVM SDK.

**Parameters:**
- `config` (FhevmConfig): Configuration object

**Returns:** `Promise<FhevmSDK>`

**Example:**
```typescript
const fhevm = await FhevmSDK.init({
  network: 'sepolia',
  rpcUrl: 'https://rpc.sepolia.org', // optional
  provider: ethersProvider, // optional
  signer: ethersSigner // optional
});
```

### Encryption Methods

#### `encryptUint8(value)`

Encrypt an 8-bit unsigned integer.

**Parameters:**
- `value` (number): Value between 0-255

**Returns:** `Promise<EncryptedData>`

**Throws:** Error if value out of range

**Example:**
```typescript
const encrypted = await fhevm.encryptUint8(42);
console.log(encrypted.data); // Uint8Array
console.log(encrypted.proof); // Uint8Array
console.log(encrypted.type); // 'uint8'
```

#### `encryptUint16(value)`

Encrypt a 16-bit unsigned integer.

**Parameters:**
- `value` (number): Value between 0-65535

**Returns:** `Promise<EncryptedData>`

#### `encryptUint32(value)`

Encrypt a 32-bit unsigned integer.

**Parameters:**
- `value` (number): Value between 0-4294967295

**Returns:** `Promise<EncryptedData>`

#### `encryptBool(value)`

Encrypt a boolean value.

**Parameters:**
- `value` (boolean): True or false

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encryptBool(true);
```

#### `encryptAddress(address)`

Encrypt an Ethereum address.

**Parameters:**
- `address` (string): Valid Ethereum address

**Returns:** `Promise<EncryptedData>`

**Throws:** Error if invalid address

**Example:**
```typescript
const encrypted = await fhevm.encryptAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

### Decryption Methods

#### `decryptUint8(encryptedData)`

Decrypt an 8-bit unsigned integer.

**Parameters:**
- `encryptedData` (Uint8Array | string): Encrypted data to decrypt

**Returns:** `Promise<number>`

**Throws:** FhevmError if no signer or permission denied

**Example:**
```typescript
const decrypted = await fhevm.decryptUint8(encrypted.data);
console.log(decrypted); // 42
```

#### `decryptUint16(encryptedData)`

Decrypt a 16-bit unsigned integer.

**Parameters:**
- `encryptedData` (Uint8Array | string)

**Returns:** `Promise<number>`

#### `decryptUint32(encryptedData)`

Decrypt a 32-bit unsigned integer.

**Parameters:**
- `encryptedData` (Uint8Array | string)

**Returns:** `Promise<number>`

#### `decryptBool(encryptedData)`

Decrypt a boolean value.

**Parameters:**
- `encryptedData` (Uint8Array | string)

**Returns:** `Promise<boolean>`

#### `decryptAddress(encryptedData)`

Decrypt an Ethereum address.

**Parameters:**
- `encryptedData` (Uint8Array | string)

**Returns:** `Promise<string>`

### Contract Interaction

#### `getContract(address, abi)`

Get an ethers.js contract instance.

**Parameters:**
- `address` (string): Contract address
- `abi` (any[]): Contract ABI

**Returns:** `ethers.Contract`

**Example:**
```typescript
const contract = fhevm.getContract(
  '0x1234...',
  contractABI
);

await contract.submitVote(projectId, encrypted.data, encrypted.proof);
```

#### `reencrypt(encryptedData, contractAddress)`

Re-encrypt data for client-side decryption.

**Parameters:**
- `encryptedData` (Uint8Array | string): Encrypted data handle
- `contractAddress` (string): Contract holding the data

**Returns:** `Promise<Uint8Array>`

**Example:**
```typescript
const reencrypted = await fhevm.reencrypt(
  encryptedHandle,
  '0xContractAddress'
);
const decrypted = await fhevm.decryptUint8(reencrypted);
```

### Utility Methods

#### `getProvider()`

Get the current ethers.js provider.

**Returns:** `ethers.Provider`

**Example:**
```typescript
const provider = fhevm.getProvider();
const blockNumber = await provider.getBlockNumber();
```

#### `getSigner()`

Get the current ethers.js signer.

**Returns:** `ethers.Signer | undefined`

**Example:**
```typescript
const signer = fhevm.getSigner();
if (signer) {
  const address = await signer.getAddress();
  console.log('Connected:', address);
}
```

#### `getNetwork()`

Get the network name.

**Returns:** `string`

**Example:**
```typescript
const network = fhevm.getNetwork();
console.log(network); // 'sepolia'
```

---

## React Hooks

### useFhevm()

Access the SDK instance and initialization state.

**Returns:**
```typescript
{
  fhevm: FhevmSDK | null;
  initState: InitState;
  error: Error | null;
  reinit: (config: FhevmConfig) => Promise<void>;
}
```

**Example:**
```typescript
function MyComponent() {
  const { fhevm, initState, error, reinit } = useFhevm();

  if (initState === InitState.INITIALIZING) {
    return <div>Loading...</div>;
  }

  if (initState === InitState.FAILED) {
    return <div>Error: {error?.message}</div>;
  }

  return <div>SDK Ready!</div>;
}
```

### useEncrypt()

Hook for encrypting values with loading states.

**Returns:**
```typescript
{
  encrypt: {
    uint8: (value: number) => Promise<EncryptedData>;
    uint16: (value: number) => Promise<EncryptedData>;
    uint32: (value: number) => Promise<EncryptedData>;
    bool: (value: boolean) => Promise<EncryptedData>;
    address: (address: string) => Promise<EncryptedData>;
  };
  isEncrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
function EncryptButton() {
  const { encrypt, isEncrypting, error } = useEncrypt();

  const handleClick = async () => {
    try {
      const encrypted = await encrypt.uint8(42);
      console.log('Encrypted:', encrypted);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <button onClick={handleClick} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

### useDecrypt()

Hook for decrypting values with loading states.

**Returns:**
```typescript
{
  decrypt: {
    uint8: (data: Uint8Array | string) => Promise<number>;
    uint16: (data: Uint8Array | string) => Promise<number>;
    uint32: (data: Uint8Array | string) => Promise<number>;
    bool: (data: Uint8Array | string) => Promise<boolean>;
    address: (data: Uint8Array | string) => Promise<string>;
  };
  isDecrypting: boolean;
  error: Error | null;
}
```

**Example:**
```typescript
function DecryptButton({ encryptedData }) {
  const { decrypt, isDecrypting } = useDecrypt();
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    const decrypted = await decrypt.uint8(encryptedData);
    setResult(decrypted);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isDecrypting}>
        Decrypt
      </button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}
```

### useContract(address, abi)

Hook for accessing contract instances.

**Parameters:**
- `address` (string): Contract address
- `abi` (any[]): Contract ABI

**Returns:** `ethers.Contract`

**Example:**
```typescript
function VotingComponent() {
  const contract = useContract(contractAddress, votingABI);

  const submitVote = async (projectId, encrypted) => {
    const tx = await contract.submitVote(
      projectId,
      encrypted.data,
      encrypted.proof
    );
    await tx.wait();
  };

  return <button onClick={() => submitVote(1, encrypted)}>Vote</button>;
}
```

### useNetwork()

Hook for accessing network information.

**Returns:**
```typescript
{
  network: string | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
}
```

**Example:**
```typescript
function NetworkInfo() {
  const { network, provider, signer } = useNetwork();

  return (
    <div>
      <p>Network: {network}</p>
      <p>Provider: {provider ? 'Connected' : 'Not connected'}</p>
      <p>Signer: {signer ? 'Connected' : 'Not connected'}</p>
    </div>
  );
}
```

---

## Types

### FhevmConfig

Configuration for SDK initialization.

```typescript
interface FhevmConfig {
  network: string; // 'sepolia', 'mainnet', 'localhost'
  rpcUrl?: string; // Optional custom RPC URL
  provider?: ethers.Provider; // Optional provider
  signer?: ethers.Signer; // Optional signer
}
```

### EncryptedData

Encrypted data structure.

```typescript
interface EncryptedData {
  data: Uint8Array; // Encrypted bytes
  proof: Uint8Array; // Zero-knowledge proof
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';
}
```

### InitState

SDK initialization state.

```typescript
enum InitState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  INITIALIZED = 'INITIALIZED',
  FAILED = 'FAILED'
}
```

### FheType

Supported FHE data types.

```typescript
type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';
```

### TransactionOptions

Options for encrypted transactions.

```typescript
interface TransactionOptions {
  gasLimit?: number;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  value?: bigint;
}
```

---

## Error Handling

### FhevmError

Custom error class with type information.

```typescript
class FhevmError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public originalError?: Error
  );
}
```

### ErrorType

Error type enumeration.

```typescript
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

### Error Handling Example

```typescript
import { FhevmError, ErrorType } from '@fhevm/sdk';

try {
  const encrypted = await fhevm.encryptUint8(42);
} catch (error) {
  if (error instanceof FhevmError) {
    switch (error.type) {
      case ErrorType.NOT_INITIALIZED:
        console.error('SDK not initialized');
        break;
      case ErrorType.ENCRYPTION_ERROR:
        console.error('Encryption failed:', error.message);
        break;
      case ErrorType.INVALID_INPUT:
        console.error('Invalid input:', error.message);
        break;
      default:
        console.error('Error:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Advanced Usage

### Custom Provider

```typescript
import { ethers } from 'ethers';

const customProvider = new ethers.JsonRpcProvider('https://my-rpc.com');
const wallet = new ethers.Wallet(privateKey, customProvider);

const fhevm = await FhevmSDK.init({
  network: 'sepolia',
  provider: customProvider,
  signer: wallet
});
```

### Multiple SDK Instances

```typescript
// Sepolia instance
const sepoliaSDK = await FhevmSDK.init({ network: 'sepolia' });

// Mainnet instance
const mainnetSDK = await FhevmSDK.init({ network: 'mainnet' });

// Use independently
const encrypted1 = await sepoliaSDK.encryptUint8(42);
const encrypted2 = await mainnetSDK.encryptUint8(100);
```

### Batch Operations

```typescript
// Encrypt multiple values
const values = [1, 2, 3, 4, 5];
const encrypted = await Promise.all(
  values.map(v => fhevm.encryptUint8(v))
);

// Submit all to contract
for (const enc of encrypted) {
  await contract.submitVote(projectId, enc.data, enc.proof);
}
```

---

For more examples, see [examples.md](./examples.md).
