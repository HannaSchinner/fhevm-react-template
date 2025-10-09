'use client';

import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { getContractWithSigner, percentageToShare, validateShares } from '@/lib/contract';

/**
 * Track Registration Component
 *
 * Features:
 * - Register new music tracks with metadata
 * - Add multiple rights holders with encrypted royalty shares
 * - Validate share splits (must total 100%)
 * - Dynamic form for adding/removing rights holders
 * - Integration with FHEVM SDK for encryption
 *
 * The shares are encrypted on-chain to keep royalty splits private
 */
interface RegisterTrackProps {
  provider: BrowserProvider | null;
  account: string | null;
  onTrackRegistered?: () => void;
}

interface RightsHolderShare {
  address: string;
  percentage: string;
}

export default function RegisterTrack({ provider, account, onTrackRegistered }: RegisterTrackProps) {
  const [metadataURI, setMetadataURI] = useState('');
  const [rightsHolders, setRightsHolders] = useState<RightsHolderShare[]>([
    { address: '', percentage: '' },
  ]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Add a new rights holder field
   */
  function addRightsHolder() {
    setRightsHolders([...rightsHolders, { address: '', percentage: '' }]);
  }

  /**
   * Remove a rights holder field
   */
  function removeRightsHolder(index: number) {
    if (rightsHolders.length === 1) return; // Keep at least one
    const updated = rightsHolders.filter((_, i) => i !== index);
    setRightsHolders(updated);
  }

  /**
   * Update rights holder address
   */
  function updateAddress(index: number, address: string) {
    const updated = [...rightsHolders];
    updated[index].address = address;
    setRightsHolders(updated);
  }

  /**
   * Update rights holder percentage
   */
  function updatePercentage(index: number, percentage: string) {
    const updated = [...rightsHolders];
    updated[index].percentage = percentage;
    setRightsHolders(updated);
  }

  /**
   * Calculate total percentage
   */
  function calculateTotalPercentage(): number {
    return rightsHolders.reduce((total, holder) => {
      const percentage = parseFloat(holder.percentage) || 0;
      return total + percentage;
    }, 0);
  }

  /**
   * Validate form inputs
   */
  function validateForm(): string | null {
    if (!metadataURI.trim()) {
      return 'Please enter metadata URI';
    }

    if (rightsHolders.length === 0) {
      return 'At least one rights holder is required';
    }

    // Check all addresses are filled
    for (const holder of rightsHolders) {
      if (!holder.address.trim()) {
        return 'All rights holder addresses must be filled';
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(holder.address)) {
        return `Invalid Ethereum address: ${holder.address}`;
      }
    }

    // Check all percentages are filled and valid
    for (const holder of rightsHolders) {
      if (!holder.percentage.trim()) {
        return 'All percentages must be filled';
      }
      const percentage = parseFloat(holder.percentage);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        return 'Percentages must be between 0 and 100';
      }
    }

    // Check total equals 100%
    const total = calculateTotalPercentage();
    if (Math.abs(total - 100) > 0.01) {
      return `Total percentage must equal 100% (current: ${total.toFixed(2)}%)`;
    }

    return null;
  }

  /**
   * Register track on the blockchain
   *
   * Steps:
   * 1. Validate form inputs
   * 2. Convert percentages to share values (0-10000)
   * 3. Call contract registerTrack function
   * 4. The contract will encrypt the shares on-chain
   */
  async function registerTrack() {
    if (!provider || !account) {
      setError('Please connect your wallet first');
      return;
    }

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = await getContractWithSigner(provider);

      // Prepare data
      const addresses = rightsHolders.map(h => h.address);
      const shares = rightsHolders.map(h => {
        const percentage = parseFloat(h.percentage);
        return percentageToShare(percentage);
      });

      // Validate shares total 10000
      if (!validateShares(shares)) {
        setError('Share calculation error. Total must equal 10000.');
        setIsRegistering(false);
        return;
      }

      console.log('Registering track...');
      console.log('Metadata URI:', metadataURI);
      console.log('Rights holders:', addresses);
      console.log('Shares:', shares);

      // Call contract function
      // The contract will encrypt shares on-chain using FHEVM
      const tx = await contract.registerTrack(metadataURI, addresses, shares);

      console.log('Transaction sent:', tx.hash);
      setSuccess('Track registration transaction sent. Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();

      console.log('Transaction confirmed:', receipt.hash);
      setSuccess('Track registered successfully with encrypted royalty shares!');

      // Reset form
      setMetadataURI('');
      setRightsHolders([{ address: '', percentage: '' }]);

      // Notify parent component
      if (onTrackRegistered) {
        onTrackRegistered();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register track';
      console.error('Track registration error:', err);
      setError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  }

  if (!provider || !account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Register Track</h2>
        <p className="text-gray-600">Please connect your wallet and register as a verified rights holder</p>
      </div>
    );
  }

  const totalPercentage = calculateTotalPercentage();
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Register Track</h2>

      <div className="space-y-4">
        {/* Metadata URI */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Metadata URI
          </label>
          <input
            type="text"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
            placeholder="ipfs://... or https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isRegistering}
          />
          <p className="mt-1 text-xs text-gray-500">
            IPFS or HTTP URL containing track metadata (title, artist, etc.)
          </p>
        </div>

        {/* Rights Holders */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rights Holders & Shares
          </label>
          <div className="space-y-3">
            {rightsHolders.map((holder, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={holder.address}
                  onChange={(e) => updateAddress(index, e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isRegistering}
                />
                <input
                  type="number"
                  value={holder.percentage}
                  onChange={(e) => updatePercentage(index, e.target.value)}
                  placeholder="25.00"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-28 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isRegistering}
                />
                <span className="flex items-center px-2 text-gray-600">%</span>
                {rightsHolders.length > 1 && (
                  <button
                    onClick={() => removeRightsHolder(index)}
                    disabled={isRegistering}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={addRightsHolder}
              disabled={isRegistering}
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold disabled:text-gray-400"
            >
              + Add Rights Holder
            </button>
            <div className="text-sm">
              <span className="text-gray-600">Total: </span>
              <span className={`font-semibold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage.toFixed(2)}%
              </span>
              {isValidTotal && <span className="ml-2 text-green-600">✓</span>}
            </div>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Shares are encrypted on-chain. Only the rights holder can decrypt their own share.
          </p>
        </div>

        {/* Register Button */}
        <button
          onClick={registerTrack}
          disabled={isRegistering || !isValidTotal}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isRegistering ? 'Registering Track...' : 'Register Track'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}
    </div>
  );
}
