/**
 * API-related type definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionRequest {
  value: number | bigint;
  valueType?: string;
}

export interface EncryptionResponse {
  success: boolean;
  encrypted?: any;
  originalValue?: number | bigint;
  type?: string;
  error?: string;
}

export interface DecryptionRequest {
  encryptedValue: string;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionResponse {
  success: boolean;
  decrypted?: number | bigint;
  error?: string;
  message?: string;
}

export interface ComputationRequest {
  operation: string;
  operands: any[];
}

export interface ComputationResponse {
  success: boolean;
  result?: any;
  operation?: string;
  error?: string;
  supportedOperations?: Record<string, string>;
}

export interface KeysResponse {
  success: boolean;
  publicKey?: string;
  network?: string;
  error?: string;
}

export interface FheOperationRequest {
  operation: 'initialize' | 'getPublicKey' | 'encrypt' | 'decrypt';
  data?: any;
}

export interface FheOperationResponse {
  success: boolean;
  publicKey?: string;
  message?: string;
  error?: string;
}
