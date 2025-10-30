# FHEVM Vue Template

A Vue 3 template with FHEVM SDK integration for building privacy-preserving applications.

## Features

- Vue 3 Composition API
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
import { useFhevm } from './composables/useFhevm';

export default {
  setup() {
    const { client, isInitialized, initClient } = useFhevm();

    onMounted(async () => {
      await initClient();
    });

    const encrypt = async (value: number) => {
      const encrypted = await client.value.encrypt(value);
      return encrypted;
    };

    return { encrypt };
  }
}
```

## Learn More

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Vue Documentation](https://vuejs.org/)
