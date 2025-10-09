/**
 * FHEVM SDK - Universal SDK for FHEVM (Fully Homomorphic Encryption Virtual Machine)
 *
 * This SDK provides a framework-agnostic interface for building confidential applications
 * using Zama's FHEVM technology. It enables developers to work with encrypted data on
 * the blockchain while maintaining privacy and confidentiality.
 *
 * Features:
 * - Framework-agnostic core (works with any JavaScript framework)
 * - React hooks for seamless integration with React applications
 * - Wagmi-style API for familiar developer experience
 * - Built-in encryption and decryption utilities
 * - EIP-712 signature support for user-authorized decryption
 * - Public and private decryption modes
 * - Batch operations for efficiency
 * - Contract interaction helpers
 * - TypeScript support with comprehensive type definitions
 *
 * @example
 * ```typescript
 * // Core usage (framework-agnostic)
 * import { FhevmClient, encryptInput } from '@fhevm/sdk';
 *
 * const client = new FhevmClient({ provider, network: 8009 });
 * await client.initialize();
 * const encrypted = await client.encrypt(42, 'uint32');
 *
 * // React usage
 * import { FhevmProvider, useFhevmEncrypt } from '@fhevm/sdk';
 *
 * function App() {
 *   return (
 *     <FhevmProvider config={{ provider, network: 8009 }}>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 * ```
 *
 * @module @fhevm/sdk
 */

// Core client and provider exports
export { FhevmClient } from './client';
export { FhevmProvider, useFhevm, withFhevm } from './provider';

// Encryption and decryption utilities
export {
  encryptInput,
  encryptMultiple,
  encryptAddress,
  encryptBool,
  decryptData,
  publicDecrypt,
  userDecrypt,
  batchDecrypt
} from './encryption';

// Instance management
export {
  createFhevmInstance,
  getFhevmInstance,
  clearInstanceCache,
  hasInstance,
  getCachedChainIds
} from './instance';

// Type definitions
export * from './types';

// Utility functions
export * from './utils';

// React hooks (optional, only when React is available)
export {
  useFhevmEncrypt,
  useFhevmDecrypt,
  useFhevmContract,
  useFhevmEncryptedCall,
  useFhevmContractWatch,
  useFhevmBatchEncrypt
} from './react/hooks';
