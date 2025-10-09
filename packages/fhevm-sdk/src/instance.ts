/**
 * FHEVM instance management
 *
 * Provides singleton pattern for managing FHEVM instances across the application.
 * This ensures efficient resource usage by reusing instances for the same network.
 *
 * @module instance
 */

import { createInstance, FhevmInstance } from 'fhevmjs';

/**
 * Global instance cache
 * Stores FHEVM instances by chain ID to avoid recreating them
 */
const instanceCache = new Map<number, FhevmInstance>();

/**
 * Configuration for creating FHEVM instance
 */
export interface InstanceConfig {
  /** Network chain ID (e.g., 8009 for Zama testnet) */
  chainId: number;
  /** Network RPC URL */
  networkUrl?: string;
  /** Gateway URL for decryption services */
  gatewayUrl?: string;
  /** ACL (Access Control List) contract address */
  aclAddress?: string;
}

/**
 * Create or retrieve a cached FHEVM instance
 *
 * This function implements a singleton pattern to ensure only one instance
 * exists per network. If an instance already exists for the given chain ID,
 * it will be returned from cache instead of creating a new one.
 *
 * @param config - Instance configuration
 * @returns Promise resolving to the FHEVM instance
 *
 * @example
 * ```typescript
 * const instance = await createFhevmInstance({
 *   chainId: 8009,
 *   networkUrl: 'https://devnet.zama.ai',
 *   gatewayUrl: 'https://gateway.zama.ai',
 *   aclAddress: '0x...'
 * });
 *
 * // Use the instance for encryption
 * const input = instance.createEncryptedInput();
 * input.add32(42);
 * const encrypted = input.encrypt();
 * ```
 */
export async function createFhevmInstance(config: InstanceConfig): Promise<FhevmInstance> {
  // Check cache first
  if (instanceCache.has(config.chainId)) {
    const cached = instanceCache.get(config.chainId);
    if (cached) {
      return cached;
    }
  }

  // Create new instance
  const instance = await createInstance({
    chainId: config.chainId,
    networkUrl: config.networkUrl,
    gatewayUrl: config.gatewayUrl,
    aclAddress: config.aclAddress
  });

  // Cache it for future use
  instanceCache.set(config.chainId, instance);

  return instance;
}

/**
 * Get cached FHEVM instance
 *
 * Retrieves an existing FHEVM instance from cache if available.
 * Returns null if no instance exists for the given chain ID.
 *
 * @param chainId - Network chain ID
 * @returns The cached FHEVM instance or null if not found
 *
 * @example
 * ```typescript
 * const instance = getFhevmInstance(8009);
 * if (instance) {
 *   console.log('Found cached instance');
 * } else {
 *   console.log('No instance in cache');
 * }
 * ```
 */
export function getFhevmInstance(chainId: number): FhevmInstance | null {
  return instanceCache.get(chainId) || null;
}

/**
 * Clear instance cache
 *
 * Removes cached instances from memory. Can clear a specific chain ID
 * or all instances if no chain ID is provided.
 *
 * @param chainId - Optional chain ID to clear specific instance
 *
 * @example
 * ```typescript
 * // Clear specific chain
 * clearInstanceCache(8009);
 *
 * // Clear all instances
 * clearInstanceCache();
 * ```
 */
export function clearInstanceCache(chainId?: number): void {
  if (chainId !== undefined) {
    instanceCache.delete(chainId);
  } else {
    instanceCache.clear();
  }
}

/**
 * Check if an instance exists in cache
 *
 * @param chainId - Network chain ID
 * @returns True if instance exists in cache
 *
 * @example
 * ```typescript
 * if (!hasInstance(8009)) {
 *   await createFhevmInstance(config);
 * }
 * ```
 */
export function hasInstance(chainId: number): boolean {
  return instanceCache.has(chainId);
}

/**
 * Get all cached chain IDs
 *
 * @returns Array of chain IDs that have cached instances
 *
 * @example
 * ```typescript
 * const chains = getCachedChainIds();
 * console.log('Cached networks:', chains);
 * ```
 */
export function getCachedChainIds(): number[] {
  return Array.from(instanceCache.keys());
}
