/**
 * FHE-related TypeScript types
 */

export interface FHEClientConfig {
  provider: any;
  network: string;
  gatewayUrl?: string;
}

export interface EncryptionResult {
  encrypted: string;
  type: EncryptionType;
  timestamp: number;
}

export interface DecryptionResult {
  decrypted: number;
  timestamp: number;
}

export type EncryptionType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';

export interface ContractCallParams {
  address: string;
  abi: any[];
  method: string;
  args: any[];
}
