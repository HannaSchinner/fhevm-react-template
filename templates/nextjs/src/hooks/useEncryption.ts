import { useState, useCallback } from 'react';
import { useFHE } from '@/components/fhe/FHEProvider';

/**
 * Hook for encryption operations
 */
export function useEncryption() {
  const { client, isInitialized } = useFHE();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const encryptData = useCallback(
    async (value: number, type: 'euint8' | 'euint16' | 'euint32' | 'euint64' = 'euint32') => {
      if (!isInitialized || !client) {
        throw new Error('FHE client not initialized');
      }

      setLoading(true);
      setError(null);

      try {
        // Encrypt the value
        const encrypted = await client.encrypt(value);
        setResult(encrypted);
        return encrypted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client, isInitialized]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    encryptData,
    loading,
    result,
    error,
    reset,
  };
}
