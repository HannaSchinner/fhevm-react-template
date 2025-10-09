/**
 * FHEVM Client - Core client for interacting with FHEVM
 *
 * This module provides the main client class for Fully Homomorphic Encryption
 * operations on the blockchain. It handles encryption, decryption, and instance
 * management for confidential smart contract interactions.
 *
 * @module client
 */

import { createInstance, FhevmInstance } from 'fhevmjs';
import { BrowserProvider, Signer } from 'ethers';
import type {
  FhevmConfig,
  IFhevmClient,
  EncryptResult,
  DecryptParams,
  PublicDecryptParams,
  EncryptedUintType
} from './types';
import { generatePublicKey, createEIP712Signature } from './utils';

/**
 * Main FHEVM client class
 *
 * Provides methods for encryption, decryption, and FHEVM operations.
 * This is the primary interface for interacting with encrypted data on-chain.
 *
 * @example
 * ```typescript
 * const client = new FhevmClient({
 *   provider: browserProvider,
 *   network: 8009,
 *   gatewayUrl: 'https://gateway.zama.ai',
 *   aclAddress: '0x...'
 * });
 *
 * await client.initialize();
 * const encrypted = await client.encrypt(42, 'uint32');
 * ```
 */
export class FhevmClient implements IFhevmClient {
  private instance: FhevmInstance | null = null;
  private provider: BrowserProvider;
  private network: number;
  private gatewayUrl?: string;
  private aclAddress?: string;
  private initialized = false;

  /**
   * Creates a new FHEVM client instance
   *
   * @param config - Configuration object for the client
   */
  constructor(config: FhevmConfig) {
    this.provider = config.provider;
    this.network = config.network;
    this.gatewayUrl = config.gatewayUrl;
    this.aclAddress = config.aclAddress;
  }

  /**
   * Initialize the FHEVM instance
   *
   * This method must be called before any encryption or decryption operations.
   * It sets up the cryptographic infrastructure required for FHE operations.
   *
   * @throws {Error} If initialization fails
   *
   * @example
   * ```typescript
   * await client.initialize();
   * console.log('Client ready:', client.isInitialized());
   * ```
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Create FHEVM instance with network configuration
      this.instance = await createInstance({
        chainId: this.network,
        networkUrl: this.provider._getConnection().url,
        gatewayUrl: this.gatewayUrl,
        aclAddress: this.aclAddress
      });

      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the underlying FHEVM instance
   *
   * Provides direct access to the fhevmjs instance for advanced operations.
   *
   * @returns The FHEVM instance
   * @throws {Error} If client is not initialized
   *
   * @example
   * ```typescript
   * const instance = client.getInstance();
   * const input = instance.createEncryptedInput();
   * ```
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  /**
   * Check if client is initialized
   *
   * @returns True if the client is ready to use
   *
   * @example
   * ```typescript
   * if (!client.isInitialized()) {
   *   await client.initialize();
   * }
   * ```
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Encrypt input data for on-chain use
   *
   * Encrypts a value using fully homomorphic encryption so it can be
   * used in confidential smart contract operations.
   *
   * @param value - Value to encrypt (number or bigint)
   * @param type - Encrypted type (uint8, uint16, uint32, uint64, uint128, uint256)
   * @returns Encrypted data with handles and proof
   * @throws {Error} If encryption fails or client is not initialized
   *
   * @example
   * ```typescript
   * // Encrypt a 32-bit unsigned integer
   * const encrypted = await client.encrypt(42, 'uint32');
   *
   * // Encrypt a large number
   * const bigValue = await client.encrypt(1000000n, 'uint64');
   *
   * // Use in contract call
   * await contract.storeEncrypted(encrypted.handles[0], encrypted.proof);
   * ```
   */
  async encrypt(
    value: number | bigint,
    type: EncryptedUintType
  ): Promise<EncryptResult> {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }

    try {
      const input = this.instance.createEncryptedInput();

      // Add the value to encrypted input based on type
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
        default:
          throw new Error(`Unsupported type: ${type}`);
      }

      const encrypted = input.encrypt();

      return {
        data: encrypted.data,
        handles: encrypted.handles || [],
        proof: encrypted.inputProof
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt data using user signature (EIP-712)
   *
   * Requests decryption of encrypted on-chain data. The user must sign an
   * EIP-712 message to prove ownership and authorization.
   *
   * @param params - Decryption parameters including contract address, handle, and signer
   * @returns Decrypted value as bigint
   * @throws {Error} If decryption fails or client is not initialized
   *
   * @example
   * ```typescript
   * const decrypted = await client.decrypt({
   *   contractAddress: '0x123...',
   *   handle: '0xabc...',
   *   signer: userSigner
   * });
   * console.log('Decrypted value:', decrypted.toString());
   * ```
   */
  async decrypt(params: DecryptParams): Promise<bigint> {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }

    const { contractAddress, handle, signer } = params;

    try {
      // Generate public key for the user
      const publicKey = await generatePublicKey(signer);

      // Create EIP-712 signature for authorization
      const signature = await createEIP712Signature(
        signer,
        contractAddress,
        handle,
        publicKey
      );

      // Request decryption from gateway
      const response = await fetch(`${this.gatewayUrl}/decrypt`, {
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
        throw new Error(`Decryption request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return BigInt(result.value);
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Public decryption (no signature required)
   *
   * Decrypts publicly accessible encrypted data. Unlike regular decryption,
   * this does not require user authorization.
   *
   * @param params - Public decryption parameters
   * @returns Decrypted value as bigint
   * @throws {Error} If decryption fails or client is not initialized
   *
   * @example
   * ```typescript
   * const publicValue = await client.publicDecrypt({
   *   contractAddress: '0x123...',
   *   handle: '0xabc...'
   * });
   * console.log('Public decrypted value:', publicValue.toString());
   * ```
   */
  async publicDecrypt(params: PublicDecryptParams): Promise<bigint> {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }

    const { contractAddress, handle } = params;

    try {
      // Request public decryption from gateway
      const response = await fetch(`${this.gatewayUrl}/public-decrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress,
          handle
        })
      });

      if (!response.ok) {
        throw new Error(`Public decryption request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return BigInt(result.value);
    } catch (error) {
      throw new Error(`Public decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
