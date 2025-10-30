import { useState, useCallback } from 'react';
import { ComputationRequest } from '@/lib/fhe/types';

/**
 * Hook for homomorphic computation operations
 */
export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(
    async (request: ComputationRequest): Promise<string> => {
      setIsComputing(true);
      setError(null);

      try {
        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Computation failed');
        }

        setResult(data.result);
        return data.result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsComputing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    result,
    error,
    reset,
  };
}
