/**
 * Utility functions for FHEVM operations
 *
 * Provides helper functions for cryptographic operations, address validation,
 * formatting, and async utilities commonly used in FHEVM applications.
 *
 * @module utils
 */

import { Signer, TypedDataDomain, TypedDataField } from 'ethers';

/**
 * Generate a public key for encryption
 *
 * Creates a signature-based public key for the user. This is used in
 * encryption operations and authorization flows.
 *
 * @param signer - Ethereum signer (e.g., from wallet)
 * @returns Promise resolving to the public key string
 *
 * @example
 * ```typescript
 * const publicKey = await generatePublicKey(signer);
 * console.log('User public key:', publicKey);
 * ```
 */
export async function generatePublicKey(signer: Signer): Promise<string> {
  const address = await signer.getAddress();
  const message = `Generate public key for ${address}`;
  const signature = await signer.signMessage(message);
  return signature;
}

/**
 * Create EIP-712 signature for decryption authorization
 *
 * Generates a typed data signature according to EIP-712 standard.
 * This signature proves the user's authorization to decrypt specific data.
 *
 * @param signer - Ethereum signer
 * @param contractAddress - Contract address containing the encrypted data
 * @param handle - Encrypted data handle (identifier)
 * @param publicKey - User's public key for encryption
 * @returns Promise resolving to the signature string
 *
 * @example
 * ```typescript
 * const signature = await createEIP712Signature(
 *   signer,
 *   '0x123...',
 *   '0xabc...',
 *   publicKey
 * );
 * ```
 */
export async function createEIP712Signature(
  signer: Signer,
  contractAddress: string,
  handle: string,
  publicKey: string
): Promise<string> {
  const domain: TypedDataDomain = {
    name: 'Authorization',
    version: '1',
    chainId: await signer.provider?.getNetwork().then(n => Number(n.chainId)),
    verifyingContract: contractAddress
  };

  const types: Record<string, TypedDataField[]> = {
    Reencrypt: [
      { name: 'publicKey', type: 'bytes' },
      { name: 'handle', type: 'uint256' }
    ]
  };

  const value = {
    publicKey,
    handle
  };

  return await signer.signTypedData(domain, types, value);
}

/**
 * Convert BigInt to hex string
 *
 * @param value - BigInt value to convert
 * @returns Hex string with 0x prefix
 *
 * @example
 * ```typescript
 * const hex = bigIntToHex(42n);
 * console.log(hex); // "0x2a"
 * ```
 */
export function bigIntToHex(value: bigint): string {
  return '0x' + value.toString(16);
}

/**
 * Convert hex string to BigInt
 *
 * @param hex - Hex string (with or without 0x prefix)
 * @returns BigInt value
 *
 * @example
 * ```typescript
 * const value = hexToBigInt('0x2a');
 * console.log(value); // 42n
 * ```
 */
export function hexToBigInt(hex: string): bigint {
  return BigInt(hex);
}

/**
 * Validate Ethereum address format
 *
 * Checks if a string is a valid Ethereum address (0x followed by 40 hex characters).
 *
 * @param address - Address string to validate
 * @returns True if valid Ethereum address
 *
 * @example
 * ```typescript
 * if (isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')) {
 *   console.log('Valid address');
 * }
 * ```
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format encrypted handle for display
 *
 * Shortens long handles to make them more readable by showing
 * only the first and last few characters.
 *
 * @param handle - Handle string to format
 * @returns Formatted handle string
 *
 * @example
 * ```typescript
 * const formatted = formatHandle('0x123456789abcdef123456789');
 * console.log(formatted); // "0x1234...6789"
 * ```
 */
export function formatHandle(handle: string): string {
  if (handle.length <= 10) return handle;
  return `${handle.slice(0, 6)}...${handle.slice(-4)}`;
}

/**
 * Format address for display
 *
 * Shortens Ethereum addresses for better readability.
 *
 * @param address - Ethereum address
 * @param chars - Number of characters to show on each side (default: 4)
 * @returns Formatted address
 *
 * @example
 * ```typescript
 * const formatted = formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
 * console.log(formatted); // "0x742d...0bEb"
 * ```
 */
export function formatAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Sleep utility for async operations
 *
 * Creates a promise that resolves after a specified delay.
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 *
 * @example
 * ```typescript
 * console.log('Waiting...');
 * await sleep(1000);
 * console.log('Done!');
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 *
 * Attempts to execute an async function multiple times with increasing
 * delays between attempts. Useful for handling transient failures.
 *
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise resolving to the function result
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * const result = await retry(
 *   async () => {
 *     const response = await fetch('https://api.example.com/data');
 *     return response.json();
 *   },
 *   3,
 *   1000
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (i < maxRetries - 1) {
        await sleep(baseDelay * Math.pow(2, i));
      }
    }
  }

  throw lastError!;
}

/**
 * Parse encrypted type from contract event
 *
 * Extracts the type information from an encrypted value event.
 *
 * @param eventData - Event data from contract
 * @returns Encrypted type string
 *
 * @example
 * ```typescript
 * const type = parseEncryptedType(eventData);
 * console.log('Type:', type); // "euint32"
 * ```
 */
export function parseEncryptedType(eventData: any): string {
  // Implementation depends on event structure
  return eventData.type || 'unknown';
}

/**
 * Validate encrypted handle format
 *
 * Checks if a string appears to be a valid encrypted handle.
 *
 * @param handle - Handle to validate
 * @returns True if valid handle format
 *
 * @example
 * ```typescript
 * if (isValidHandle('0xabc123...')) {
 *   console.log('Valid handle');
 * }
 * ```
 */
export function isValidHandle(handle: string): boolean {
  return typeof handle === 'string' && handle.length > 0;
}

/**
 * Create a debounced function
 *
 * Returns a function that delays invoking the provided function until
 * after a specified delay has elapsed since the last invocation.
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce(async (query: string) => {
 *   const results = await searchAPI(query);
 *   console.log(results);
 * }, 300);
 *
 * debouncedSearch('hello'); // Only executes after 300ms of no calls
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Safely parse JSON with error handling
 *
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 *
 * @example
 * ```typescript
 * const data = safeJsonParse('{"name": "Alice"}', {});
 * console.log(data.name); // "Alice"
 * ```
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Convert error to readable message
 *
 * @param error - Error object or unknown value
 * @returns Error message string
 *
 * @example
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   console.error(getErrorMessage(error));
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
