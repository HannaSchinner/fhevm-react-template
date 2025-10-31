/**
 * Type definitions for FHEVM operations
 */

export type FheValueType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';

export interface EncryptionOptions {
  type?: FheValueType;
  publicKey?: string;
}

export interface DecryptionOptions {
  contractAddress: string;
  userAddress: string;
}

export interface FhevmConfig {
  network: string;
  rpcUrl?: string;
  gatewayUrl?: string;
}

export interface EncryptedValue {
  data: Uint8Array;
  type: FheValueType;
}

export interface DecryptionRequest {
  handle: string;
  contractAddress: string;
  signature: string;
}

export interface ComputationOperation {
  type: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte' | 'min' | 'max';
  operands: EncryptedValue[];
}

export interface FhevmContextValue {
  client: any | null;
  isInitialized: boolean;
  network: string;
  publicKey: string | null;
  error: string | null;
}
