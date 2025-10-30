'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createFhevmClient, FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

interface FHEContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: string | null;
  provider: BrowserProvider | null;
}

const FHEContext = createContext<FHEContextType>({
  client: null,
  isInitialized: false,
  error: null,
  provider: null,
});

/**
 * FHE Provider Component
 *
 * Provides FHEVM client context to all child components
 * Handles automatic initialization and provider management
 */
export function FHEProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    async function initializeFHE() {
      try {
        // Check for Ethereum provider
        if (typeof window !== 'undefined' && window.ethereum) {
          const browserProvider = new BrowserProvider(window.ethereum);
          setProvider(browserProvider);

          // Initialize FHEVM client
          const fhevmClient = await createFhevmClient({
            provider: window.ethereum,
            network: 'sepolia',
          });

          setClient(fhevmClient);
          setIsInitialized(true);
        } else {
          setError('No Ethereum provider found. Please install MetaMask.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize FHE client');
        console.error('FHE initialization error:', err);
      }
    }

    initializeFHE();
  }, []);

  return (
    <FHEContext.Provider value={{ client, isInitialized, error, provider }}>
      {children}
    </FHEContext.Provider>
  );
}

/**
 * Hook to access FHE context
 */
export function useFHE() {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHE must be used within FHEProvider');
  }
  return context;
}
