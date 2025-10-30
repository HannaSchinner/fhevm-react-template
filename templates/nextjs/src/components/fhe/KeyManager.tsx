'use client';

import React, { useState, useEffect } from 'react';
import { useFHE } from './FHEProvider';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Key Manager Component
 *
 * Displays and manages FHE cryptographic keys
 */
export default function KeyManager() {
  const { client, isInitialized } = useFHE();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && client) {
      // Fetch public key information
      fetchKeyInfo();
    }
  }, [isInitialized, client]);

  async function fetchKeyInfo() {
    try {
      const response = await fetch('/api/keys?operation=public');
      const data = await response.json();
      if (data.success) {
        setPublicKey(data.publicKey);
        setKeyId(data.keyId);
      }
    } catch (error) {
      console.error('Failed to fetch key info:', error);
    }
  }

  async function handleRotateKey() {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'rotate' }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchKeyInfo();
      }
    } catch (error) {
      console.error('Key rotation failed:', error);
    }
  }

  return (
    <Card title="Key Management" description="View and manage cryptographic keys">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-1">Key ID</p>
            <p className="text-xs font-mono text-gray-600">
              {keyId || 'Loading...'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
            <p className="text-xs text-gray-600">
              {isInitialized ? (
                <span className="text-green-600 font-semibold">✓ Active</span>
              ) : (
                <span className="text-yellow-600">Initializing...</span>
              )}
            </p>
          </div>
        </div>

        {publicKey && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Public Key (Preview)
            </p>
            <p className="text-xs font-mono text-blue-700 break-all">
              {publicKey.substring(0, 100)}...
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchKeyInfo}
            disabled={!isInitialized}
          >
            Refresh Keys
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRotateKey}
            disabled={!isInitialized}
          >
            Rotate Key
          </Button>
        </div>
      </div>
    </Card>
  );
}
