# FHEVM React Template

A basic React template with FHEVM SDK integration for building privacy-preserving applications.

## Features

- React 18
- FHEVM SDK integration
- TypeScript support
- Vite for fast development

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

```typescript
import { useFhevm } from './components/FhevmProvider';

function MyComponent() {
  const { client, isInitialized } = useFhevm();

  const encrypt = async (value: number) => {
    const encrypted = await client.encrypt(value);
    return encrypted;
  };

  return <div>...</div>;
}
```

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [React Documentation](https://react.dev/)
