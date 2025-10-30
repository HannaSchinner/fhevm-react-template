import { useState, useCallback } from 'react';
import { useFHE } from '@/components/fhe/FHEProvider';
import { encryptValue, decryptValue } from '@/lib/fhe/client';

/**
 * Custom hook for FHE encryption
 */
export function useEncrypt() {
  const { client, isInitialized } = useFHE();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (value: number): Promise<string> => {
      if (!isInitialized || !client) {
        throw new Error('FHE client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await encryptValue(value);
        return encrypted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return { encrypt, isEncrypting, error };
}

/**
 * Custom hook for FHE decryption
 */
export function useDecrypt() {
  const { client, isInitialized } = useFHE();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decrypt = useCallback(
    async (encryptedValue: string): Promise<number> => {
      if (!isInitialized || !client) {
        throw new Error('FHE client not initialized');
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const decrypted = await decryptValue(encryptedValue);
        return decrypted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Decryption failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  return { decrypt, isDecrypting, error };
}
