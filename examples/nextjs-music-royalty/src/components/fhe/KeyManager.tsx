'use client';

import React, { useState, useEffect } from 'react';
import { useFhevm } from '@/hooks/useFhevm';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * Key Manager Component
 *
 * Displays and manages FHEVM public keys
 */
export default function KeyManager() {
  const { client, isInitialized } = useFhevm();
  const [publicKey, setPublicKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadPublicKey();
  }, [isInitialized, client]);

  const loadPublicKey = async () => {
    if (!client || !isInitialized) return;

    setIsLoading(true);
    setError('');

    try {
      const key = await client.getPublicKey();
      setPublicKey(key);
    } catch (err: any) {
      setError(err.message || 'Failed to load public key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      title="Key Manager"
      subtitle="FHEVM Network Public Key"
      headerAction={
        <Button
          size="sm"
          onClick={loadPublicKey}
          isLoading={isLoading}
          disabled={!isInitialized}
        >
          Refresh
        </Button>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading && !publicKey && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading public key...</p>
          </div>
        )}

        {publicKey && (
          <div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Public Key:</h4>
              <p className="text-xs text-gray-600 font-mono break-all">
                {publicKey.substring(0, 100)}...
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>• Used for client-side encryption</p>
              <p>• Managed by FHEVM validator network</p>
              <p>• Automatically rotated for security</p>
            </div>
          </div>
        )}

        {!isInitialized && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">FHEVM client not initialized</p>
            <p className="text-xs mt-1">Connect your wallet to continue</p>
          </div>
        )}
      </div>
    </Card>
  );
}
