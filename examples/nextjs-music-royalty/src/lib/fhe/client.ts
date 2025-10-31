import { createFhevmClient as createClient, FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

/**
 * Client-side FHE operations
 *
 * Wrapper functions for FHEVM SDK client operations
 */

let clientInstance: FhevmClient | null = null;

/**
 * Initialize FHEVM client for browser environment
 */
export async function createFhevmClient(provider: BrowserProvider): Promise<FhevmClient> {
  if (clientInstance) {
    return clientInstance;
  }

  try {
    const network = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';

    clientInstance = await createClient({
      provider,
      network
    });

    return clientInstance;
  } catch (error) {
    console.error('Failed to create FHEVM client:', error);
    throw error;
  }
}

/**
 * Get existing client instance
 */
export function getClientInstance(): FhevmClient | null {
  return clientInstance;
}

/**
 * Reset client instance (useful for wallet changes)
 */
export function resetClient(): void {
  clientInstance = null;
}

/**
 * Encrypt a value using the FHEVM client
 */
export async function encryptValue(
  client: FhevmClient,
  value: number | bigint,
  type: string = 'uint32'
): Promise<any> {
  try {
    return await client.encrypt(value, type);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

/**
 * Get public key from FHEVM network
 */
export async function getPublicKey(client: FhevmClient): Promise<string> {
  try {
    return await client.getPublicKey();
  } catch (error) {
    console.error('Failed to get public key:', error);
    throw error;
  }
}
