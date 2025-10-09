# Migration Guide

Guide for migrating existing projects to the Universal FHEVM SDK.

## Table of Contents

- [From Raw FHEVM](#from-raw-fhevm)
- [From Other Libraries](#from-other-libraries)
- [Version Updates](#version-updates)
- [Breaking Changes](#breaking-changes)

---

## From Raw FHEVM

If you're currently using raw FHEVM libraries, here's how to migrate.

### Before (Raw FHEVM)

```typescript
import { FhevmInstance } from 'fhevmjs';
import { ethers } from 'ethers';

// Manual setup
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(privateKey, provider);
const fhevm = await FhevmInstance.create({
  chainId: 11155111,
  publicKey: await fetchPublicKey(),
  signer: signer
});

// Manual encryption
const encrypted = await fhevm.encrypt8(42);
const proof = await fhevm.generateProof(encrypted);

// Contract interaction
const contract = new ethers.Contract(address, abi, signer);
await contract.submitVote(encrypted, proof);
```

### After (Universal SDK)

```typescript
import { FhevmSDK } from '@fhevm/sdk';

// Simple initialization
const fhevm = await FhevmSDK.init({ network: 'sepolia' });

// One-step encryption with proof
const encrypted = await fhevm.encryptUint8(42);

// Integrated contract interaction
const contract = fhevm.getContract(address, abi);
await contract.submitVote(encrypted.data, encrypted.proof);
```

### Migration Steps

1. **Install SDK**
```bash
npm uninstall fhevmjs
npm install @fhevm/sdk
```

2. **Update Imports**
```typescript
// Before
import { FhevmInstance } from 'fhevmjs';

// After
import { FhevmSDK } from '@fhevm/sdk';
```

3. **Simplify Initialization**
```typescript
// Before
const fhevm = await FhevmInstance.create({
  chainId: 11155111,
  publicKey: publicKey,
  signer: signer
});

// After
const fhevm = await FhevmSDK.init({ network: 'sepolia' });
```

4. **Update Encryption Calls**
```typescript
// Before
const encrypted = await fhevm.encrypt8(value);
const proof = await fhevm.generateProof(encrypted);

// After
const encrypted = await fhevm.encryptUint8(value);
// encrypted.data and encrypted.proof are included
```

---

## From Other Libraries

### From ethers.js Only

If you're using ethers.js without FHE:

```typescript
// Before (ethers.js only)
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(address, abi, wallet);

// Plain data submission
await contract.submitData(42); // Data is public!

// After (with FHE)
import { FhevmSDK } from '@fhevm/sdk';

const fhevm = await FhevmSDK.init({
  network: 'sepolia',
  provider: provider,
  signer: wallet
});

// Encrypted data submission
const encrypted = await fhevm.encryptUint8(42);
await contract.submitData(encrypted.data, encrypted.proof); // Private!
```

### From web3.js

```typescript
// Before (web3.js)
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, address);
await contract.methods.submitVote(42).send({ from: account });

// After (FHEVM SDK)
import { FhevmSDK } from '@fhevm/sdk';

const fhevm = await FhevmSDK.init({ network: 'sepolia' });
const encrypted = await fhevm.encryptUint8(42);
const contract = fhevm.getContract(address, abi);
await contract.submitVote(encrypted.data, encrypted.proof);
```

---

## Version Updates

### Updating to v1.1.0

#### New Features
- Added `encryptAddress()` method
- Improved error messages
- Better TypeScript types

#### Migration Required
```typescript
// Before v1.1.0 (not supported)
// No address encryption

// After v1.1.0
const encrypted = await fhevm.encryptAddress('0x...');
```

### Updating to v1.2.0

#### New Features
- React hooks (useFhevm, useEncrypt, useDecrypt)
- FhevmProvider component
- Loading states

#### Migration Required
```typescript
// Before v1.2.0 (manual SDK management)
function MyComponent() {
  const [fhevm, setFhevm] = useState(null);

  useEffect(() => {
    FhevmSDK.init({ network: 'sepolia' })
      .then(setFhevm);
  }, []);

  // Manual loading state
  if (!fhevm) return <div>Loading...</div>;

  return <div>Ready</div>;
}

// After v1.2.0 (use hooks)
function MyComponent() {
  const { fhevm, initState } = useFhevm();

  if (initState === InitState.INITIALIZING) {
    return <div>Loading...</div>;
  }

  return <div>Ready</div>;
}
```

---

## Breaking Changes

### v1.0.0 to v2.0.0

#### Change 1: Encryption Return Type

```typescript
// v1.0.0
const encrypted = await fhevm.encryptUint8(42);
// encrypted was just Uint8Array

// v2.0.0
const encrypted = await fhevm.encryptUint8(42);
// encrypted is now { data: Uint8Array, proof: Uint8Array, type: string }

// Migration
// Access encrypted.data instead of just encrypted
await contract.submit(encrypted.data, encrypted.proof);
```

#### Change 2: Initialization

```typescript
// v1.0.0
const fhevm = FhevmSDK.init({ network: 'sepolia' }); // Not async

// v2.0.0
const fhevm = await FhevmSDK.init({ network: 'sepolia' }); // Now async

// Migration
// Add await to all init() calls
```

#### Change 3: Error Handling

```typescript
// v1.0.0
try {
  await fhevm.encryptUint8(42);
} catch (error) {
  console.error(error.message);
}

// v2.0.0
import { FhevmError, ErrorType } from '@fhevm/sdk';

try {
  await fhevm.encryptUint8(42);
} catch (error) {
  if (error instanceof FhevmError) {
    console.error(error.type, error.message);
  }
}
```

---

## React Migration

### Class Components to Hooks

```typescript
// Before (class component)
class VotingComponent extends React.Component {
  state = { fhevm: null, loading: true };

  async componentDidMount() {
    const fhevm = await FhevmSDK.init({ network: 'sepolia' });
    this.setState({ fhevm, loading: false });
  }

  handleVote = async () => {
    const encrypted = await this.state.fhevm.encryptUint8(7);
    // ...
  };

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    return <button onClick={this.handleVote}>Vote</button>;
  }
}

// After (functional component with hooks)
function VotingComponent() {
  const { fhevm, initState } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const handleVote = async () => {
    const encrypted = await encrypt.uint8(7);
    // ...
  };

  if (initState === InitState.INITIALIZING) {
    return <div>Loading...</div>;
  }

  return (
    <button onClick={handleVote} disabled={isEncrypting}>
      Vote
    </button>
  );
}
```

### Context to Provider

```typescript
// Before (custom context)
const FhevmContext = React.createContext(null);

function FhevmContextProvider({ children }) {
  const [fhevm, setFhevm] = useState(null);

  useEffect(() => {
    FhevmSDK.init({ network: 'sepolia' }).then(setFhevm);
  }, []);

  return (
    <FhevmContext.Provider value={fhevm}>
      {children}
    </FhevmContext.Provider>
  );
}

// Usage
const fhevm = useContext(FhevmContext);

// After (built-in provider)
import { FhevmProvider, useFhevm } from '@fhevm/sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      {children}
    </FhevmProvider>
  );
}

// Usage
const { fhevm } = useFhevm();
```

---

## Smart Contract Migration

### Updating Contract Interface

```solidity
// Before (simple interface)
function submitVote(uint8 score) external;

// After (FHE interface)
function submitVote(bytes memory encryptedScore, bytes memory proof) external;

// Or
function submitVote(uint8 score) external; // SDK handles encryption internally
```

### Client-Side Changes

```typescript
// Before (plain submission)
await contract.submitVote(7);

// After (encrypted submission)
const encrypted = await fhevm.encryptUint8(7);
await contract.submitVote(encrypted.data, encrypted.proof);
```

---

## Testing Migration

### Unit Tests

```typescript
// Before
import { FhevmInstance } from 'fhevmjs';

describe('Voting', () => {
  let fhevm;

  beforeEach(async () => {
    fhevm = await FhevmInstance.create({ /* config */ });
  });

  it('should encrypt vote', async () => {
    const encrypted = await fhevm.encrypt8(7);
    expect(encrypted).toBeDefined();
  });
});

// After
import { FhevmSDK } from '@fhevm/sdk';

describe('Voting', () => {
  let fhevm: FhevmSDK;

  beforeEach(async () => {
    fhevm = await FhevmSDK.init({ network: 'sepolia' });
  });

  it('should encrypt vote', async () => {
    const encrypted = await fhevm.encryptUint8(7);
    expect(encrypted.data).toBeDefined();
    expect(encrypted.proof).toBeDefined();
    expect(encrypted.type).toBe('uint8');
  });
});
```

---

## Troubleshooting

### Common Migration Issues

#### Issue 1: Module Not Found

```bash
Error: Cannot find module '@fhevm/sdk'
```

**Solution:**
```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
```

#### Issue 2: Type Errors

```typescript
// Error: Property 'data' does not exist on type 'Uint8Array'
const encrypted = await fhevm.encryptUint8(42);
await contract.submit(encrypted); // Wrong!
```

**Solution:**
```typescript
// Access .data property
await contract.submit(encrypted.data, encrypted.proof);
```

#### Issue 3: Initialization Timing

```typescript
// Error: Cannot read property 'encryptUint8' of null
const fhevm = FhevmSDK.init({ network: 'sepolia' });
await fhevm.encryptUint8(42); // fhevm is Promise, not SDK!
```

**Solution:**
```typescript
// Add await
const fhevm = await FhevmSDK.init({ network: 'sepolia' });
await fhevm.encryptUint8(42);
```

---

## Getting Help

If you encounter issues during migration:

1. Check the [API Reference](./api-reference.md)
2. Review [Examples](./examples.md)
3. Search [GitHub Issues](https://github.com/KittyOrn/fhevm-react-template/issues)
4. Ask in Zama Discord community

---

**Migration complete? Try the [examples](./examples.md) to verify everything works!**
