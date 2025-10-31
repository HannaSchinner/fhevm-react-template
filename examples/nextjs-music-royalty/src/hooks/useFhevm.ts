import { useContext } from 'react';
import { FhevmContext } from '@/components/FhevmProvider';

/**
 * Custom hook to access FHEVM client
 *
 * Usage:
 * const { client, isInitialized } = useFhevm();
 */
export function useFhevm() {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }

  return context;
}
