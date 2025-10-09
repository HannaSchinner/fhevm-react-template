/**
 * React hooks for FHEVM operations
 *
 * Provides wagmi-style hooks for encryption, decryption, and contract interactions.
 * These hooks integrate seamlessly with React applications and handle loading states,
 * errors, and async operations automatically.
 *
 * @module react/hooks
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Contract, Signer } from 'ethers';
import { useFhevm } from '../provider';
import type {
  EncryptResult,
  DecryptParams,
  ContractCallParams,
  EncryptedUintType,
  UseContractReadOptions
} from '../types';

/**
 * Hook for encrypting data
 *
 * Provides a function to encrypt values with automatic loading and error handling.
 *
 * @returns Object with encrypt function, loading state, and error
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { encrypt, isEncrypting, error } = useFhevmEncrypt();
 *
 *   const handleEncrypt = async () => {
 *     const encrypted = await encrypt(42, 'uint32');
 *     if (encrypted) {
 *       console.log('Encrypted data:', encrypted);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleEncrypt} disabled={isEncrypting}>
 *       {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useFhevmEncrypt() {
  const { client } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (
      value: number | bigint,
      type: EncryptedUintType = 'uint32'
    ): Promise<EncryptResult | null> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encrypt(value, type);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return {
    encrypt,
    isEncrypting,
    error
  };
}

/**
 * Hook for decrypting data
 *
 * Provides functions for both user-authorized and public decryption
 * with automatic loading and error handling.
 *
 * @returns Object with decrypt functions, loading state, and error
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { decrypt, publicDecrypt, isDecrypting, error } = useFhevmDecrypt();
 *   const signer = useSigner(); // Your wallet signer
 *
 *   const handleDecrypt = async () => {
 *     const value = await decrypt({
 *       contractAddress: '0x123...',
 *       handle: '0xabc...',
 *       signer
 *     });
 *     if (value !== null) {
 *       console.log('Decrypted value:', value.toString());
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleDecrypt} disabled={isDecrypting}>
 *       Decrypt
 *     </button>
 *   );
 * }
 * ```
 */
export function useFhevmDecrypt() {
  const { client } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (params: DecryptParams): Promise<bigint | null> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.decrypt(params);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  const publicDecrypt = useCallback(
    async (contractAddress: string, handle: string): Promise<bigint | null> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.publicDecrypt({ contractAddress, handle });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Public decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return {
    decrypt,
    publicDecrypt,
    isDecrypting,
    error
  };
}

/**
 * Hook for interacting with smart contracts
 *
 * Provides functions for both read (view) and write operations on contracts.
 *
 * @returns Object with call and read functions, loading state, and error
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { call, read, isLoading, error } = useFhevmContract();
 *   const signer = useSigner();
 *
 *   const handleWrite = async () => {
 *     const result = await call({
 *       address: '0x123...',
 *       abi: contractAbi,
 *       functionName: 'storeValue',
 *       args: [encryptedHandle, proof],
 *       signer
 *     });
 *     console.log('Transaction:', result);
 *   };
 *
 *   const handleRead = async () => {
 *     const value = await read({
 *       address: '0x123...',
 *       abi: contractAbi,
 *       functionName: 'getValue'
 *     });
 *     console.log('Value:', value);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleWrite} disabled={isLoading}>Write</button>
 *       <button onClick={handleRead} disabled={isLoading}>Read</button>
 *     </>
 *   );
 * }
 * ```
 */
export function useFhevmContract() {
  const { client } = useFhevm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async (params: ContractCallParams): Promise<any> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const contract = new Contract(params.address, params.abi, params.signer);
        const result = await contract[params.functionName](...(params.args || []), {
          ...(params.gasLimit && { gasLimit: params.gasLimit }),
          ...(params.value && { value: params.value })
        });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Contract call failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const read = useCallback(
    async (params: Omit<ContractCallParams, 'signer'>): Promise<any> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const provider = client.getInstance();
        if (!provider) {
          throw new Error('Provider not available');
        }

        const contract = new Contract(params.address, params.abi, provider as any);
        const result = await contract[params.functionName](...(params.args || []));
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Contract read failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    call,
    read,
    isLoading,
    error
  };
}

/**
 * Hook for encrypting and sending to contract in one operation
 *
 * Combines encryption and contract call into a single operation for convenience.
 *
 * @returns Object with encryptAndCall function, loading state, and error
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { encryptAndCall, isLoading, error } = useFhevmEncryptedCall();
 *   const signer = useSigner();
 *
 *   const handleSubmit = async () => {
 *     const result = await encryptAndCall(
 *       42,
 *       'uint32',
 *       {
 *         address: '0x123...',
 *         abi: contractAbi,
 *         functionName: 'storeEncryptedValue',
 *         signer
 *       }
 *     );
 *     console.log('Submitted:', result);
 *   };
 *
 *   return (
 *     <button onClick={handleSubmit} disabled={isLoading}>
 *       {isLoading ? 'Processing...' : 'Submit Encrypted Value'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useFhevmEncryptedCall() {
  const { client } = useFhevm();
  const { encrypt } = useFhevmEncrypt();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptAndCall = useCallback(
    async (
      value: number | bigint,
      type: EncryptedUintType,
      contractParams: ContractCallParams
    ): Promise<any> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Encrypt the value
        const encrypted = await encrypt(value, type);
        if (!encrypted) {
          throw new Error('Encryption failed');
        }

        // Call contract with encrypted data
        const contract = new Contract(
          contractParams.address,
          contractParams.abi,
          contractParams.signer
        );

        const result = await contract[contractParams.functionName](
          encrypted.handles[0],
          encrypted.proof,
          ...(contractParams.args || [])
        );

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encrypted call failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client, encrypt]
  );

  return {
    encryptAndCall,
    isLoading,
    error
  };
}

/**
 * Hook for watching contract values with auto-refresh
 *
 * Automatically polls a contract function and updates when the value changes.
 *
 * @param params - Contract read parameters
 * @param options - Watch options including polling interval
 * @returns Object with data, loading state, error, and refetch function
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { data, isLoading, error, refetch } = useFhevmContractWatch(
 *     {
 *       address: '0x123...',
 *       abi: contractAbi,
 *       functionName: 'getTotalSupply'
 *     },
 *     {
 *       watch: true,
 *       pollingInterval: 5000 // Poll every 5 seconds
 *     }
 *   );
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>Total Supply: {data?.toString()}</p>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFhevmContractWatch(
  params: Omit<ContractCallParams, 'signer'>,
  options: UseContractReadOptions = {}
) {
  const { read, isLoading, error } = useFhevmContract();
  const [data, setData] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    const result = await read(params);
    if (result !== null) {
      setData(result);
    }
  }, [read, params.address, params.functionName, JSON.stringify(params.args)]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling if watch is enabled
    if (options.watch && options.pollingInterval) {
      intervalRef.current = setInterval(fetchData, options.pollingInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, options.watch, options.pollingInterval]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook for batch encrypting multiple values
 *
 * Efficiently encrypts multiple values that will be sent together.
 *
 * @returns Object with encryptBatch function, loading state, and error
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { encryptBatch, isEncrypting, error } = useFhevmBatchEncrypt();
 *
 *   const handleBatchEncrypt = async () => {
 *     const encrypted = await encryptBatch([
 *       { value: 42, type: 'uint32' },
 *       { value: 100n, type: 'uint64' }
 *     ]);
 *     console.log('Encrypted batch:', encrypted);
 *   };
 *
 *   return (
 *     <button onClick={handleBatchEncrypt} disabled={isEncrypting}>
 *       Encrypt Batch
 *     </button>
 *   );
 * }
 * ```
 */
export function useFhevmBatchEncrypt() {
  const { client } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptBatch = useCallback(
    async (
      values: Array<{ value: number | bigint; type: EncryptedUintType }>
    ): Promise<EncryptResult | null> => {
      if (!client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const instance = client.getInstance();
        const input = instance.createEncryptedInput();

        for (const { value, type } of values) {
          switch (type) {
            case 'uint8':
              input.add8(Number(value));
              break;
            case 'uint16':
              input.add16(Number(value));
              break;
            case 'uint32':
              input.add32(Number(value));
              break;
            case 'uint64':
              input.add64(BigInt(value));
              break;
            case 'uint128':
              input.add128(BigInt(value));
              break;
            case 'uint256':
              input.add256(BigInt(value));
              break;
          }
        }

        const encrypted = input.encrypt();

        return {
          data: encrypted.data,
          handles: encrypted.handles || [],
          proof: encrypted.inputProof
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Batch encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return {
    encryptBatch,
    isEncrypting,
    error
  };
}
