/**
 * API-related TypeScript types
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionAPIRequest {
  value: number;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64';
}

export interface DecryptionAPIRequest {
  encryptedValue: string;
  signature: string;
}

export interface ComputationAPIRequest {
  operation: string;
  operands: number[];
}

export interface KeyAPIResponse {
  publicKey: string;
  keyId: string;
  timestamp: string;
}
