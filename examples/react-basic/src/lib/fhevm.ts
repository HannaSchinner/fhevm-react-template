/**
 * FHEVM utility functions for encryption and decryption
 */

import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

/**
 * Create and initialize an FHEVM client
 */
export async function createFhevmClient(
  provider: BrowserProvider,
  network: number
): Promise<FhevmClient> {
  const client = new FhevmClient({ provider, network });
  await client.initialize();
  return client;
}

/**
 * Format a large number for display (with thousand separators)
 */
export function formatNumber(value: bigint | number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate a long string (like addresses or handles) for display
 */
export function truncateString(str: string, startLength = 6, endLength = 4): string {
  if (str.length <= startLength + endLength) {
    return str;
  }
  return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    11155111: 'Sepolia Testnet',
    8009: 'Zama Testnet',
    31337: 'Local Hardhat',
  };
  return networks[chainId] || `Unknown Network (${chainId})`;
}

/**
 * Check if a network is supported by FHEVM
 */
export function isSupportedNetwork(chainId: number): boolean {
  // Add supported network IDs here
  const supportedNetworks = [8009, 11155111, 31337];
  return supportedNetworks.includes(chainId);
}

/**
 * Validate input value based on encrypted type
 */
export function validateEncryptedInput(
  value: string,
  type: string
): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: 'Value is required' };
  }

  const numValue = BigInt(value);

  // Define max values for each type
  const maxValues: Record<string, bigint> = {
    uint8: BigInt(2 ** 8 - 1),
    uint16: BigInt(2 ** 16 - 1),
    uint32: BigInt(2 ** 32 - 1),
    uint64: BigInt(2 ** 64 - 1),
    uint128: BigInt(2 ** 128 - 1),
    uint256: BigInt(2 ** 256 - 1),
  };

  if (numValue < 0) {
    return { valid: false, error: 'Value must be non-negative' };
  }

  const maxValue = maxValues[type];
  if (maxValue && numValue > maxValue) {
    return { valid: false, error: `Value exceeds maximum for ${type}: ${maxValue}` };
  }

  return { valid: true };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
