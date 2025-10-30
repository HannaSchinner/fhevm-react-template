'use client';

import React, { useState } from 'react';
import { useFHE } from './FHEProvider';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useEncrypt } from '@/hooks/useFhevm';

/**
 * Encryption Demo Component
 *
 * Demonstrates client-side encryption of sensitive data
 */
export default function EncryptionDemo() {
  const { isInitialized } = useFHE();
  const { encrypt, isEncrypting } = useEncrypt();
  const [value, setValue] = useState('');
  const [encryptedValue, setEncryptedValue] = useState('');

  async function handleEncrypt() {
    if (!value) return;

    try {
      const encrypted = await encrypt(parseInt(value));
      setEncryptedValue(encrypted.toString());
    } catch (error) {
      console.error('Encryption error:', error);
    }
  }

  return (
    <Card
      title="Encryption Demo"
      description="Encrypt sensitive data before sending to blockchain"
    >
      <div className="space-y-4">
        <Input
          label="Value to Encrypt"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          disabled={!isInitialized}
        />

        <Button
          onClick={handleEncrypt}
          loading={isEncrypting}
          disabled={!isInitialized || !value}
          className="w-full"
        >
          Encrypt Value
        </Button>

        {encryptedValue && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-900 mb-1">
              Encrypted Value:
            </p>
            <p className="text-xs text-green-700 font-mono break-all">
              {encryptedValue}
            </p>
          </div>
        )}

        {!isInitialized && (
          <p className="text-sm text-yellow-600">
            Initializing FHE client...
          </p>
        )}
      </div>
    </Card>
  );
}
