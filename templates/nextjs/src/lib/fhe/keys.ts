/**
 * Key Management
 *
 * Handles cryptographic key operations
 */

export interface KeyInfo {
  publicKey: string;
  keyId: string;
  timestamp: string;
}

export async function getPublicKey(): Promise<KeyInfo> {
  const response = await fetch('/api/keys?operation=public');
  const data = await response.json();

  if (!data.success) {
    throw new Error('Failed to fetch public key');
  }

  return {
    publicKey: data.publicKey,
    keyId: data.keyId,
    timestamp: data.timestamp,
  };
}

export async function rotateKey(): Promise<string> {
  const response = await fetch('/api/keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'rotate' }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error('Key rotation failed');
  }

  return data.newKeyId;
}

export async function validateKey(key: string): Promise<boolean> {
  const response = await fetch(`/api/keys?operation=validate&key=${encodeURIComponent(key)}`);
  const data = await response.json();

  return data.success && data.valid;
}
