'use client';

import React, { useState } from 'react';
import { useFhevm } from '@/hooks/useFhevm';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

/**
 * Encryption Demo Component
 *
 * Demonstrates client-side encryption using FHEVM SDK
 */
export default function EncryptionDemo() {
  const { client, isInitialized } = useFhevm();
  const [value, setValue] = useState<string>('');
  const [encrypted, setEncrypted] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleEncrypt = async () => {
    if (!client) {
      setError('FHEVM client not initialized');
      return;
    }

    if (!value || isNaN(Number(value))) {
      setError('Please enter a valid number');
      return;
    }

    setIsEncrypting(true);
    setError('');

    try {
      const encryptedValue = await client.encrypt(Number(value));
      setEncrypted(encryptedValue.toString());
    } catch (err: any) {
      setError(err.message || 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <Card
      title="Encryption Demo"
      subtitle="Encrypt values using FHEVM"
    >
      <div className="space-y-4">
        <Input
          label="Value to Encrypt"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number (e.g., 42)"
          disabled={!isInitialized}
        />

        <Button
          onClick={handleEncrypt}
          disabled={!isInitialized || !value}
          isLoading={isEncrypting}
        >
          Encrypt Value
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {encrypted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Encrypted Value:</h4>
            <p className="text-xs text-green-700 font-mono break-all">{encrypted}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Encryption happens client-side using TFHE</p>
          <p>• Encrypted values can be used in smart contracts</p>
          <p>• Values remain encrypted on-chain</p>
        </div>
      </div>
    </Card>
  );
}
