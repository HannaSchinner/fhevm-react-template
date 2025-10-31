import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';

/**
 * Hook for encryption operations
 *
 * Provides simplified encryption functionality
 */
export function useEncryption() {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(async (value: number | bigint, type: string = 'uint32') => {
    if (!client) {
      throw new Error('FHEVM client not initialized');
    }

    setIsEncrypting(true);
    setError(null);

    try {
      const encrypted = await client.encrypt(value, type);
      return encrypted;
    } catch (err: any) {
      setError(err.message || 'Encryption failed');
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  }, [client]);

  return {
    encrypt,
    isEncrypting,
    error,
    isReady: isInitialized
  };
}
