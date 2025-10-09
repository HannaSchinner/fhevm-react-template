/**
 * Encryption and decryption utilities
 *
 * Provides simplified interfaces for common encryption and decryption operations.
 * These functions offer a more streamlined API compared to using the client directly.
 *
 * @module encryption
 */

import type { Signer } from 'ethers';
import type { FhevmInstance } from 'fhevmjs';
import { generatePublicKey, createEIP712Signature } from './utils';
import type { EncryptedUintType } from './types';

/**
 * Encrypt input value using FHEVM instance
 *
 * Provides a convenient function to encrypt a single value without needing
 * to create an encrypted input object manually.
 *
 * @param instance - FHEVM instance from client or instance manager
 * @param value - Value to encrypt (number or bigint)
 * @param type - Type of encrypted integer (default: 'uint32')
 * @returns Encrypted input with handles and proof
 *
 * @example
 * ```typescript
 * const instance = await createFhevmInstance(config);
 * const encrypted = await encryptInput(instance, 42, 'uint32');
 *
 * // Use in contract call
 * await contract.storeValue(encrypted.handles[0], encrypted.inputProof);
 * ```
 */
export async function encryptInput(
  instance: FhevmInstance,
  value: number | bigint,
  type: EncryptedUintType = 'uint32'
) {
  const input = instance.createEncryptedInput();

  // Add value to encrypted input based on type
  switch (type) {
    case 'uint8':
      input.add8(Number(value));
      break;
    case 'uint16':
      input.add16(Number(value));
      break;
    case 'uint32':
      input.add32(Number(value));
      break;
    case 'uint64':
      input.add64(BigInt(value));
      break;
    case 'uint128':
      input.add128(BigInt(value));
      break;
    case 'uint256':
      input.add256(BigInt(value));
      break;
  }

  return input.encrypt();
}

/**
 * Encrypt multiple values in a single input
 *
 * Efficiently encrypts multiple values that will be sent together in one transaction.
 * This is more efficient than encrypting values separately.
 *
 * @param instance - FHEVM instance
 * @param values - Array of values with their types
 * @returns Encrypted input with all handles and proof
 *
 * @example
 * ```typescript
 * const encrypted = await encryptMultiple(instance, [
 *   { value: 42, type: 'uint32' },
 *   { value: 100n, type: 'uint64' },
 *   { value: 7, type: 'uint8' }
 * ]);
 *
 * // Use all handles in contract call
 * await contract.storeMultiple(
 *   encrypted.handles,
 *   encrypted.inputProof
 * );
 * ```
 */
export async function encryptMultiple(
  instance: FhevmInstance,
  values: Array<{ value: number | bigint; type: EncryptedUintType }>
) {
  const input = instance.createEncryptedInput();

  for (const { value, type } of values) {
    switch (type) {
      case 'uint8':
        input.add8(Number(value));
        break;
      case 'uint16':
        input.add16(Number(value));
        break;
      case 'uint32':
        input.add32(Number(value));
        break;
      case 'uint64':
        input.add64(BigInt(value));
        break;
      case 'uint128':
        input.add128(BigInt(value));
        break;
      case 'uint256':
        input.add256(BigInt(value));
        break;
    }
  }

  return input.encrypt();
}

/**
 * User-authorized decryption using EIP-712 signature
 *
 * Decrypts data that belongs to or is authorized for a specific user.
 * The user must sign an EIP-712 message to prove authorization.
 *
 * @param signer - User's Ethereum signer
 * @param contractAddress - Contract address containing the encrypted data
 * @param handle - Encrypted data handle to decrypt
 * @param gatewayUrl - Gateway URL for decryption service
 * @returns Decrypted value as bigint
 * @throws Error if decryption fails or user is not authorized
 *
 * @example
 * ```typescript
 * try {
 *   const decrypted = await userDecrypt(
 *     signer,
 *     '0x123...',
 *     '0xabc...',
 *     'https://gateway.zama.ai'
 *   );
 *   console.log('Your balance:', decrypted.toString());
 * } catch (error) {
 *   console.error('Decryption failed:', error.message);
 * }
 * ```
 */
export async function userDecrypt(
  signer: Signer,
  contractAddress: string,
  handle: string,
  gatewayUrl: string
): Promise<bigint> {
  try {
    // Generate public key for the user
    const publicKey = await generatePublicKey(signer);

    // Create EIP-712 signature for authorization
    const signature = await createEIP712Signature(signer, contractAddress, handle, publicKey);

    // Request decryption from gateway
    const response = await fetch(`${gatewayUrl}/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractAddress,
        handle,
        signature,
        publicKey
      })
    });

    if (!response.ok) {
      throw new Error(`Decryption failed: ${response.statusText}`);
    }

    const result = await response.json();
    return BigInt(result.value);
  } catch (error) {
    throw new Error(`User decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Public decryption (no signature required)
 *
 * Decrypts publicly accessible encrypted data. This is used for data that
 * is intentionally made public but stored in encrypted form on-chain.
 *
 * @param contractAddress - Contract address containing the encrypted data
 * @param handle - Encrypted data handle to decrypt
 * @param gatewayUrl - Gateway URL for decryption service
 * @returns Decrypted value as bigint
 * @throws Error if decryption fails
 *
 * @example
 * ```typescript
 * const totalSupply = await publicDecrypt(
 *   '0x123...',
 *   '0xabc...',
 *   'https://gateway.zama.ai'
 * );
 * console.log('Total supply:', totalSupply.toString());
 * ```
 */
export async function publicDecrypt(
  contractAddress: string,
  handle: string,
  gatewayUrl: string
): Promise<bigint> {
  try {
    // Request public decryption from gateway
    const response = await fetch(`${gatewayUrl}/public-decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractAddress,
        handle
      })
    });

    if (!response.ok) {
      throw new Error(`Public decryption failed: ${response.statusText}`);
    }

    const result = await response.json();
    return BigInt(result.value);
  } catch (error) {
    throw new Error(`Public decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generic decrypt function that chooses between user and public decryption
 *
 * Automatically selects the appropriate decryption method based on whether
 * a signer is provided. This is useful when you want to handle both
 * authorized and public decryption with the same code path.
 *
 * @param contractAddress - Contract address
 * @param handle - Encrypted data handle
 * @param gatewayUrl - Gateway URL
 * @param signer - Optional signer for user-authorized decryption
 * @returns Decrypted value as bigint
 *
 * @example
 * ```typescript
 * // User-authorized decryption (if signer provided)
 * const value1 = await decryptData(
 *   '0x123...',
 *   '0xabc...',
 *   'https://gateway.zama.ai',
 *   signer
 * );
 *
 * // Public decryption (no signer)
 * const value2 = await decryptData(
 *   '0x123...',
 *   '0xdef...',
 *   'https://gateway.zama.ai'
 * );
 * ```
 */
export async function decryptData(
  contractAddress: string,
  handle: string,
  gatewayUrl: string,
  signer?: Signer
): Promise<bigint> {
  if (signer) {
    return userDecrypt(signer, contractAddress, handle, gatewayUrl);
  } else {
    return publicDecrypt(contractAddress, handle, gatewayUrl);
  }
}

/**
 * Batch decrypt multiple handles
 *
 * Efficiently decrypts multiple encrypted values. This is useful when you
 * need to retrieve several values at once (e.g., displaying a list).
 *
 * @param handles - Array of handles to decrypt
 * @param contractAddress - Contract address
 * @param gatewayUrl - Gateway URL
 * @param signer - Optional signer for user-authorized decryption
 * @returns Array of decrypted values
 *
 * @example
 * ```typescript
 * const handles = ['0xabc...', '0xdef...', '0x123...'];
 * const values = await batchDecrypt(
 *   handles,
 *   '0x123...',
 *   'https://gateway.zama.ai',
 *   signer
 * );
 * console.log('Decrypted values:', values);
 * ```
 */
export async function batchDecrypt(
  handles: string[],
  contractAddress: string,
  gatewayUrl: string,
  signer?: Signer
): Promise<bigint[]> {
  const decryptPromises = handles.map(handle =>
    decryptData(contractAddress, handle, gatewayUrl, signer)
  );

  return Promise.all(decryptPromises);
}

/**
 * Create encrypted input for contract address
 *
 * Encrypts an Ethereum address for use in confidential contracts.
 *
 * @param instance - FHEVM instance
 * @param address - Ethereum address to encrypt
 * @returns Encrypted input
 *
 * @example
 * ```typescript
 * const encrypted = await encryptAddress(instance, '0x742d35Cc...');
 * await contract.setEncryptedOwner(encrypted.handles[0], encrypted.inputProof);
 * ```
 */
export async function encryptAddress(
  instance: FhevmInstance,
  address: string
) {
  const input = instance.createEncryptedInput();
  input.addAddress(address);
  return input.encrypt();
}

/**
 * Create encrypted input for boolean value
 *
 * Encrypts a boolean value for use in confidential contracts.
 *
 * @param instance - FHEVM instance
 * @param value - Boolean value to encrypt
 * @returns Encrypted input
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBool(instance, true);
 * await contract.setEncryptedFlag(encrypted.handles[0], encrypted.inputProof);
 * ```
 */
export async function encryptBool(
  instance: FhevmInstance,
  value: boolean
) {
  const input = instance.createEncryptedInput();
  input.addBool(value);
  return input.encrypt();
}
