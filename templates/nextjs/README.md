# FHEVM Next.js Template

A complete Next.js template with FHEVM SDK integration for building privacy-preserving applications using Fully Homomorphic Encryption.

## Features

- **Complete SDK Integration**: Full integration with `@fhevm/sdk`
- **Next.js 14 App Router**: Modern Next.js structure with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling
- **API Routes**: Server-side FHE operations
- **React Hooks**: Custom hooks for encryption, decryption, and computation
- **Use Case Examples**: Banking and medical data privacy examples

## Project Structure

```
src/
├── app/                        # App Router (Next.js 13+)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts         # FHE operations route
│       │   ├── encrypt/route.ts # Encryption API
│       │   ├── decrypt/route.ts # Decryption API
│       │   └── compute/route.ts # Homomorphic computation API
│       └── keys/route.ts       # Key management API
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                    # FHE functionality components
│   │   ├── FHEProvider.tsx     # FHE context
│   │   ├── EncryptionDemo.tsx  # Encryption demo
│   │   ├── ComputationDemo.tsx # Computation demo
│   │   └── KeyManager.tsx      # Key management
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Financial use case
│       └── MedicalExample.tsx  # Medical use case
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE integration library
│   │   ├── client.ts           # Client-side FHE operations
│   │   ├── server.ts           # Server-side FHE operations
│   │   ├── keys.ts             # Key management
│   │   └── types.ts            # Type definitions
│   └── utils/                  # Utility functions
│       ├── security.ts         # Security tools
│       └── validation.ts       # Validation tools
│
├── hooks/                      # Custom Hooks
│   ├── useFhevm.ts             # FHE operations Hook
│   ├── useEncryption.ts        # Encryption Hook
│   └── useComputation.ts       # Computation Hook
│
└── types/                      # TypeScript types
    ├── fhe.ts                  # FHE-related types
    └── api.ts                  # API type definitions
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MetaMask or another Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## SDK Usage Examples

### Encryption

```typescript
import { useEncrypt } from '@/hooks/useFhevm';

function MyComponent() {
  const { encrypt, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(1000);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Decryption

```typescript
import { useDecrypt } from '@/hooks/useFhevm';

function MyComponent() {
  const { decrypt, isDecrypting } = useDecrypt();

  const handleDecrypt = async (encryptedValue: string) => {
    const decrypted = await decrypt(encryptedValue);
    console.log('Decrypted:', decrypted);
  };

  return <button onClick={() => handleDecrypt('0x...')}>Decrypt</button>;
}
```

### Homomorphic Computation

```typescript
import { useComputation } from '@/hooks/useComputation';

function MyComponent() {
  const { compute, isComputing } = useComputation();

  const handleCompute = async () => {
    const result = await compute({
      operation: 'add',
      operands: [100, 200],
    });
    console.log('Result:', result);
  };

  return <button onClick={handleCompute}>Compute</button>;
}
```

## API Routes

### Encryption API

```
POST /api/fhe/encrypt
Body: { value: number, type: string }
```

### Decryption API

```
POST /api/fhe/decrypt
Body: { encryptedValue: string, signature: string }
```

### Computation API

```
POST /api/fhe/compute
Body: { operation: string, operands: number[] }
```

### Key Management API

```
GET /api/keys?operation=public
POST /api/keys { operation: 'rotate' }
```

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)
- [@fhevm/sdk GitHub](https://github.com/zama-ai/fhevmjs)

## License

MIT
