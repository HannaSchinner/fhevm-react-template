/**
 * Core type definitions for FHEVM SDK
 */

import { BrowserProvider, Signer, Contract } from 'ethers';
import type { FhevmInstance } from 'fhevmjs';

/**
 * Configuration for initializing the FHEVM client
 */
export interface FhevmConfig {
  /** Ethereum provider (MetaMask, WalletConnect, etc.) */
  provider: BrowserProvider;
  /** Network ID (e.g., 11155111 for Sepolia, 8009 for Zama testnet) */
  network: number;
  /** Gateway URL for ACL (Access Control List) */
  gatewayUrl?: string;
  /** Contract address for the ACL contract */
  aclAddress?: string;
}

/**
 * Encrypted input data structure
 */
export interface EncryptedInput {
  /** Encrypted data handles */
  handles: string[];
  /** Input proof for verification */
  inputProof: string;
}

/**
 * Decryption request parameters
 */
export interface DecryptParams {
  /** Contract address */
  contractAddress: string;
  /** Encrypted data handle */
  handle: string;
  /** User's signer for EIP-712 signature */
  signer: Signer;
}

/**
 * Public decryption parameters (no signature required)
 */
export interface PublicDecryptParams {
  /** Contract address */
  contractAddress: string;
  /** Encrypted data handle */
  handle: string;
}

/**
 * Result of encryption operation
 */
export interface EncryptResult {
  /** Encrypted data */
  data: Uint8Array;
  /** Handles for the encrypted values */
  handles: string[];
  /** Input proof */
  proof: string;
}

/**
 * FHEVM client interface
 */
export interface IFhevmClient {
  /** Get the underlying FHEVM instance */
  getInstance(): FhevmInstance;
  /** Encrypt input data */
  encrypt(value: number | bigint, type: EncryptedUintType): Promise<EncryptResult>;
  /** Decrypt data with user signature */
  decrypt(params: DecryptParams): Promise<bigint>;
  /** Public decryption (no signature) */
  publicDecrypt(params: PublicDecryptParams): Promise<bigint>;
  /** Check if client is initialized */
  isInitialized(): boolean;
}

/**
 * React context value for FHEVM provider
 */
export interface FhevmContextValue {
  /** FHEVM client instance */
  client: IFhevmClient | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Initialize the client */
  initialize: (config: FhevmConfig) => Promise<void>;
}

/**
 * Supported encrypted unsigned integer types
 */
export type EncryptedUintType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256';

/**
 * Supported encrypted types (including booleans and addresses)
 */
export type EncryptedType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'ebool' | 'eaddress';

/**
 * Contract interaction parameters
 */
export interface ContractCallParams {
  /** Contract address */
  address: string;
  /** Contract ABI */
  abi: any[];
  /** Function name to call */
  functionName: string;
  /** Function arguments */
  args?: any[];
  /** Signer for transaction */
  signer: Signer;
  /** Gas limit override */
  gasLimit?: bigint;
  /** Value to send with transaction (in wei) */
  value?: bigint;
}

/**
 * Result of contract write operation
 */
export interface ContractWriteResult {
  /** Transaction hash */
  hash: string;
  /** Wait for transaction confirmation */
  wait: () => Promise<any>;
}

/**
 * Hook options for contract reads
 */
export interface UseContractReadOptions {
  /** Watch for changes and auto-refresh */
  watch?: boolean;
  /** Polling interval in milliseconds */
  pollingInterval?: number;
}

/**
 * EIP-712 signature parameters
 */
export interface EIP712Params {
  /** Domain for EIP-712 */
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  /** Types for EIP-712 */
  types: Record<string, any>;
  /** Message for EIP-712 */
  message: Record<string, any>;
}
