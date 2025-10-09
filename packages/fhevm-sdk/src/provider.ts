/**
 * React provider for FHEVM context
 *
 * Enables React applications to use FHEVM through context and hooks.
 * This provider manages the FHEVM client lifecycle and makes it available
 * throughout the component tree.
 *
 * @module provider
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FhevmClient } from './client';
import type { FhevmConfig, FhevmContextValue } from './types';

/**
 * React context for FHEVM
 *
 * Provides access to the FHEVM client throughout the component tree.
 */
const FhevmContext = createContext<FhevmContextValue | null>(null);

/**
 * Props for FhevmProvider component
 */
export interface FhevmProviderProps {
  /** Child components that will have access to FHEVM context */
  children: React.ReactNode;
  /** Optional configuration for auto-initialization */
  config?: FhevmConfig;
}

/**
 * Provider component for FHEVM
 *
 * Wraps your application (or part of it) to provide FHEVM functionality
 * through React hooks. The provider manages client initialization and
 * error handling.
 *
 * @example
 * ```typescript
 * // Basic usage with auto-initialization
 * function App() {
 *   return (
 *     <FhevmProvider config={{
 *       provider: browserProvider,
 *       network: 8009,
 *       gatewayUrl: 'https://gateway.zama.ai'
 *     }}>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 *
 * // Manual initialization
 * function App() {
 *   return (
 *     <FhevmProvider>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 * ```
 */
export function FhevmProvider({
  children,
  config
}: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize the FHEVM client
   *
   * Creates a new client instance and initializes it. Can be called
   * manually or automatically if config is provided.
   */
  const initialize = useCallback(async (initConfig: FhevmConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const newClient = new FhevmClient(initConfig);
      await newClient.initialize();
      setClient(newClient);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize FHEVM');
      setError(error);
      console.error('FHEVM initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Auto-initialize if config is provided
   *
   * This effect runs when the config prop changes and automatically
   * initializes the client if needed.
   */
  useEffect(() => {
    if (config && !client) {
      initialize(config);
    }
  }, [config, client, initialize]);

  const value: FhevmContextValue = {
    client,
    isLoading,
    error,
    initialize
  };

  return React.createElement(FhevmContext.Provider, { value }, children);
}

/**
 * Hook to access FHEVM context
 *
 * Provides access to the FHEVM client and related state from any component
 * within the FhevmProvider tree.
 *
 * @returns FHEVM context value with client, loading state, error, and initialize function
 * @throws Error if used outside of FhevmProvider
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { client, isLoading, error, initialize } = useFhevm();
 *
 *   // Wait for initialization
 *   if (isLoading) {
 *     return <div>Initializing FHEVM...</div>;
 *   }
 *
 *   // Handle errors
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *
 *   // Use client
 *   if (client) {
 *     const encrypt = async () => {
 *       const encrypted = await client.encrypt(42, 'uint32');
 *       console.log('Encrypted:', encrypted);
 *     };
 *     return <button onClick={encrypt}>Encrypt</button>;
 *   }
 *
 *   // Manual initialization
 *   return (
 *     <button onClick={() => initialize(config)}>
 *       Initialize FHEVM
 *     </button>
 *   );
 * }
 * ```
 */
export function useFhevm(): FhevmContextValue {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevm must be used within a FhevmProvider');
  }

  return context;
}

/**
 * Higher-order component to provide FHEVM context
 *
 * Wraps a component with the FhevmProvider, useful for testing or
 * isolated component usage.
 *
 * @param Component - Component to wrap
 * @param config - FHEVM configuration
 * @returns Wrapped component with FHEVM context
 *
 * @example
 * ```typescript
 * const MyComponentWithFhevm = withFhevm(MyComponent, {
 *   provider: browserProvider,
 *   network: 8009
 * });
 * ```
 */
export function withFhevm<P extends object>(
  Component: React.ComponentType<P>,
  config?: FhevmConfig
) {
  return function WrappedComponent(props: P) {
    return React.createElement(
      FhevmProvider,
      { config },
      React.createElement(Component, props)
    );
  };
}
