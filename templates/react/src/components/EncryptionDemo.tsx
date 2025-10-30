import React, { useState } from 'react';
import { useFhevm } from './FhevmProvider';

export default function EncryptionDemo() {
  const { client, isInitialized } = useFhevm();
  const [value, setValue] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEncrypt() {
    if (!client || !value) return;

    setLoading(true);
    try {
      const result = await client.encrypt(parseInt(value));
      setEncrypted(result.toString());
    } catch (error) {
      console.error('Encryption error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="demo-card">
      <h2>Encryption Demo</h2>
      <p>Encrypt sensitive data using FHEVM</p>

      <div className="input-group">
        <label>Value to Encrypt:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
          disabled={!isInitialized}
        />
      </div>

      <button onClick={handleEncrypt} disabled={!isInitialized || loading}>
        {loading ? 'Encrypting...' : 'Encrypt Value'}
      </button>

      {encrypted && (
        <div className="result">
          <strong>Encrypted Value:</strong>
          <code>{encrypted}</code>
        </div>
      )}
    </div>
  );
}
