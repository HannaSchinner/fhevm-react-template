import { useState } from 'react';
import { useFhevmEncrypt, useFhevmDecrypt } from '@fhevm/sdk';
import { formatNumber, validateEncryptedInput, copyToClipboard } from '../lib/fhevm';

interface EncryptionDemoProps {
  account: string;
}

type EncryptedUintType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256';

export default function EncryptionDemo({ account }: EncryptionDemoProps) {
  // Encryption state
  const [encryptValue, setEncryptValue] = useState('42');
  const [encryptType, setEncryptType] = useState<EncryptedUintType>('uint32');
  const [encryptResult, setEncryptResult] = useState<{
    handles: string[];
    proof: string;
  } | null>(null);
  const [encryptError, setEncryptError] = useState<string | null>(null);

  // Decryption state
  const [decryptHandle, setDecryptHandle] = useState('');
  const [decryptContractAddress, setDecryptContractAddress] = useState('');
  const [decryptResult, setDecryptResult] = useState<bigint | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  // FHEVM hooks
  const { encrypt, isLoading: isEncrypting } = useFhevmEncrypt();
  const { decrypt, isLoading: isDecrypting } = useFhevmDecrypt();

  const handleEncrypt = async () => {
    setEncryptError(null);
    setEncryptResult(null);

    // Validate input
    const validation = validateEncryptedInput(encryptValue, encryptType);
    if (!validation.valid) {
      setEncryptError(validation.error || 'Invalid input');
      return;
    }

    try {
      const result = await encrypt(BigInt(encryptValue), encryptType);
      setEncryptResult({
        handles: result.handles,
        proof: result.proof,
      });
    } catch (error) {
      console.error('Encryption failed:', error);
      setEncryptError(error instanceof Error ? error.message : 'Encryption failed');
    }
  };

  const handleDecrypt = async () => {
    setDecryptError(null);
    setDecryptResult(null);

    if (!decryptHandle || !decryptContractAddress) {
      setDecryptError('Please provide both handle and contract address');
      return;
    }

    try {
      const result = await decrypt({
        contractAddress: decryptContractAddress,
        handle: decryptHandle,
      });
      setDecryptResult(result);
    } catch (error) {
      console.error('Decryption failed:', error);
      setDecryptError(error instanceof Error ? error.message : 'Decryption failed');
    }
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      alert(`${label} copied to clipboard!`);
    }
  };

  return (
    <div>
      {/* Encryption Section */}
      <div className="card">
        <h2>Encrypt Value</h2>
        <p style={{ color: '#888', marginBottom: '1.5em' }}>
          Encrypt a numeric value using FHEVM. The encrypted data can be used in smart contracts
          while maintaining privacy.
        </p>

        <div className="form-group">
          <label htmlFor="encrypt-value">Value to Encrypt</label>
          <input
            id="encrypt-value"
            type="text"
            value={encryptValue}
            onChange={(e) => setEncryptValue(e.target.value)}
            placeholder="Enter a number"
            disabled={isEncrypting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="encrypt-type">Encrypted Type</label>
          <select
            id="encrypt-type"
            value={encryptType}
            onChange={(e) => setEncryptType(e.target.value as EncryptedUintType)}
            disabled={isEncrypting}
            style={{
              padding: '0.6em 1em',
              fontSize: '1em',
              borderRadius: '8px',
              border: '1px solid #646cff',
              backgroundColor: '#1a1a1a',
              color: 'white',
            }}
          >
            <option value="uint8">uint8 (0-255)</option>
            <option value="uint16">uint16 (0-65,535)</option>
            <option value="uint32">uint32 (0-4,294,967,295)</option>
            <option value="uint64">uint64 (0-18,446,744,073,709,551,615)</option>
            <option value="uint128">uint128 (very large)</option>
            <option value="uint256">uint256 (extremely large)</option>
          </select>
        </div>

        <button onClick={handleEncrypt} disabled={isEncrypting}>
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </button>

        {encryptError && <div className="error">{encryptError}</div>}

        {encryptResult && (
          <div className="success">
            <strong>Encryption Successful!</strong>

            <div style={{ marginTop: '1em' }}>
              <div style={{ marginBottom: '0.5em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Handle:</strong>
                <button
                  onClick={() => handleCopy(encryptResult.handles[0], 'Handle')}
                  style={{ fontSize: '0.85em', padding: '0.4em 0.8em' }}
                >
                  Copy
                </button>
              </div>
              <div className="result-box">{encryptResult.handles[0]}</div>
            </div>

            <div style={{ marginTop: '1em' }}>
              <div style={{ marginBottom: '0.5em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Proof:</strong>
                <button
                  onClick={() => handleCopy(encryptResult.proof, 'Proof')}
                  style={{ fontSize: '0.85em', padding: '0.4em 0.8em' }}
                >
                  Copy
                </button>
              </div>
              <div className="result-box" style={{ fontSize: '0.75em' }}>
                {encryptResult.proof.substring(0, 100)}...
              </div>
            </div>

            <div className="info" style={{ marginTop: '1em', fontSize: '0.85em' }}>
              Use this handle in smart contract calls to work with the encrypted value.
              The proof is used to verify the encryption is valid.
            </div>
          </div>
        )}
      </div>

      {/* Decryption Section */}
      <div className="card">
        <h2>Decrypt Value</h2>
        <p style={{ color: '#888', marginBottom: '1.5em' }}>
          Decrypt a value using its handle and the contract address where it's stored.
          This requires a signature from your wallet for authorization.
        </p>

        <div className="form-group">
          <label htmlFor="decrypt-handle">Encrypted Handle</label>
          <input
            id="decrypt-handle"
            type="text"
            value={decryptHandle}
            onChange={(e) => setDecryptHandle(e.target.value)}
            placeholder="0x..."
            disabled={isDecrypting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="decrypt-contract">Contract Address</label>
          <input
            id="decrypt-contract"
            type="text"
            value={decryptContractAddress}
            onChange={(e) => setDecryptContractAddress(e.target.value)}
            placeholder="0x..."
            disabled={isDecrypting}
          />
        </div>

        <button onClick={handleDecrypt} disabled={isDecrypting}>
          {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
        </button>

        {decryptError && <div className="error">{decryptError}</div>}

        {decryptResult !== null && (
          <div className="success">
            <strong>Decryption Successful!</strong>
            <div style={{ marginTop: '1em' }}>
              <strong>Decrypted Value:</strong>
              <div className="result-box" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {formatNumber(decryptResult)}
              </div>
            </div>
          </div>
        )}

        <div className="info" style={{ marginTop: '1em', fontSize: '0.85em' }}>
          <strong>Note:</strong> Decryption requires the encrypted value to be stored in a
          smart contract with proper access control. This demo shows the client-side API.
        </div>
      </div>

      {/* Information Section */}
      <div className="card">
        <h2>About FHEVM SDK</h2>
        <p style={{ marginBottom: '1em' }}>
          The FHEVM SDK provides a simple, framework-agnostic way to work with Fully Homomorphic
          Encryption in blockchain applications. It enables:
        </p>
        <ul style={{ paddingLeft: '1.5em', lineHeight: '1.8' }}>
          <li><strong>Private Computation:</strong> Perform calculations on encrypted data</li>
          <li><strong>Confidential Transactions:</strong> Keep transaction details private</li>
          <li><strong>Selective Disclosure:</strong> Choose who can decrypt specific values</li>
          <li><strong>Zero-Knowledge Proofs:</strong> Verify without revealing data</li>
        </ul>
        <p style={{ marginTop: '1em', color: '#888' }}>
          This example demonstrates basic encryption and decryption. Check out the Next.js
          example for a complete application with smart contract integration.
        </p>
      </div>
    </div>
  );
}
