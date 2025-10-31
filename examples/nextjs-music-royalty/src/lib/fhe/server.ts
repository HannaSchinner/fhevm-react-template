import { createFhevmClient, FhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * Server-side FHE operations
 *
 * Functions for FHEVM operations in Node.js/API routes
 */

let serverClient: FhevmClient | null = null;

/**
 * Initialize FHEVM client for server environment
 */
export async function initializeServerClient(): Promise<FhevmClient> {
  if (serverClient) {
    return serverClient;
  }

  try {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || process.env.RPC_URL;
    const network = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';

    if (!rpcUrl) {
      throw new Error('RPC URL not configured');
    }

    const provider = new JsonRpcProvider(rpcUrl);

    serverClient = await createFhevmClient({
      provider,
      network
    });

    return serverClient;
  } catch (error) {
    console.error('Failed to initialize server FHEVM client:', error);
    throw error;
  }
}

/**
 * Get server client instance
 */
export function getServerClient(): FhevmClient | null {
  return serverClient;
}

/**
 * Server-side encryption
 */
export async function serverEncrypt(
  value: number | bigint,
  type: string = 'uint32'
): Promise<any> {
  const client = await initializeServerClient();
  return await client.encrypt(value, type);
}

/**
 * Server-side public key retrieval
 */
export async function getServerPublicKey(): Promise<string> {
  const client = await initializeServerClient();
  return await client.getPublicKey();
}
