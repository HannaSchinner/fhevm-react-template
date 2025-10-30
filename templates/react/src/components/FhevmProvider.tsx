import React, { createContext, useContext, useState, useEffect } from 'react';
import { createFhevmClient, FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

interface FhevmContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  provider: BrowserProvider | null;
}

const FhevmContext = createContext<FhevmContextType>({
  client: null,
  isInitialized: false,
  provider: null,
});

export function FhevmProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        const fhevmClient = await createFhevmClient({
          provider: window.ethereum,
          network: 'sepolia',
        });

        setClient(fhevmClient);
        setIsInitialized(true);
      }
    }

    init();
  }, []);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, provider }}>
      {children}
    </FhevmContext.Provider>
  );
}

export function useFhevm() {
  return useContext(FhevmContext);
}
