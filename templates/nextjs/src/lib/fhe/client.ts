import { createFhevmClient as createClient } from '@fhevm/sdk';
import type { FhevmClient } from '@fhevm/sdk';

/**
 * Client-side FHE Operations
 *
 * Handles encryption, decryption, and client-side key management
 */

let fhevmClientInstance: FhevmClient | null = null;

export async function getFhevmClient(): Promise<FhevmClient> {
  if (!fhevmClientInstance) {
    if (typeof window === 'undefined') {
      throw new Error('FHEVM client can only be initialized in browser environment');
    }

    fhevmClientInstance = await createClient({
      provider: window.ethereum,
      network: 'sepolia',
    });
  }

  return fhevmClientInstance;
}

export async function encryptValue(value: number): Promise<string> {
  const client = await getFhevmClient();
  return client.encrypt(value);
}

export async function decryptValue(encryptedValue: string): Promise<number> {
  const client = await getFhevmClient();
  return client.decrypt(encryptedValue);
}
