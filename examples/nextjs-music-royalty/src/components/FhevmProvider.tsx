'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { createFhevmInstance, FhevmInstance } from '@fhevm/sdk';

/**
 * FHEVM Context for managing the FHE instance
 *
 * This provider:
 * - Initializes the FHEVM SDK with the correct chain configuration
 * - Manages the FHE instance lifecycle
 * - Provides the instance to all child components
 * - Handles initialization errors and loading states
 */
interface FhevmContextType {
  fhevmInstance: FhevmInstance | null;
  isInitializing: boolean;
  error: string | null;
  initializeFhevm: (provider: BrowserProvider) => Promise<void>;
}

const FhevmContext = createContext<FhevmContextType | undefined>(undefined);

export function FhevmProvider({ children }: { children: React.ReactNode }) {
  const [fhevmInstance, setFhevmInstance] = useState<FhevmInstance | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize FHEVM SDK with the current provider
   *
   * Steps:
   * 1. Get network information from provider
   * 2. Create FHEVM instance with appropriate configuration
   * 3. Store instance for use throughout the application
   */
  const initializeFhevm = async (provider: BrowserProvider) => {
    if (fhevmInstance) {
      console.log('FHEVM already initialized');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      console.log('Initializing FHEVM SDK...');

      // Get network information
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      console.log('Network:', {
        name: network.name,
        chainId: chainId,
      });

      // Create FHEVM instance
      // The SDK will automatically load the appropriate configuration
      // based on the chain ID (e.g., Sepolia testnet)
      const instance = await createFhevmInstance({
        chainId,
        provider,
      });

      setFhevmInstance(instance);
      console.log('✓ FHEVM SDK initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHEVM';
      console.error('FHEVM initialization error:', err);
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <FhevmContext.Provider
      value={{
        fhevmInstance,
        isInitializing,
        error,
        initializeFhevm,
      }}
    >
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access FHEVM instance
 *
 * Usage:
 * ```tsx
 * const { fhevmInstance, isInitializing, error } = useFhevm();
 * ```
 */
export function useFhevm() {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }
  return context;
}
