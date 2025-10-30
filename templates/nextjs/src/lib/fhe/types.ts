/**
 * FHE Type Definitions
 *
 * TypeScript types for FHE operations
 */

export interface EncryptedValue {
  data: string;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64';
  timestamp: number;
}

export interface DecryptionRequest {
  encryptedValue: string;
  signature: string;
  address: string;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operands: number[];
}

export interface FHEConfig {
  network: 'sepolia' | 'mainnet' | 'local';
  gatewayUrl?: string;
  aclAddress?: string;
}

export type EncryptionType = 'euint8' | 'euint16' | 'euint32' | 'euint64';
