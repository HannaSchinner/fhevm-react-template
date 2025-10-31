/**
 * FHE-related type definitions
 */

import { BrowserProvider } from 'ethers';

export type FheType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';

export interface FhevmClientConfig {
  provider: BrowserProvider;
  network: string;
  gatewayUrl?: string;
}

export interface EncryptedData {
  data: Uint8Array | string;
  type: FheType;
  handles?: string[];
}

export interface DecryptionPermission {
  contractAddress: string;
  userAddress: string;
  signature: string;
  nonce: string;
}

export interface FhevmInstance {
  encrypt: (value: number | bigint, type?: FheType) => Promise<any>;
  decrypt: (handle: string, permission: DecryptionPermission) => Promise<any>;
  getPublicKey: () => Promise<string>;
  createDecryptionPermission: (contractAddress: string) => Promise<DecryptionPermission>;
}

export interface FhevmProviderProps {
  children: React.ReactNode;
  config?: Partial<FhevmClientConfig>;
}

export interface FhevmContextType {
  client: FhevmInstance | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  network: string;
  publicKey: string | null;
  initialize: (provider: BrowserProvider) => Promise<void>;
  reset: () => void;
}
