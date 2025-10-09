'use client';

import React, { useState } from 'react';
import { BrowserProvider, parseEther } from 'ethers';
import { getContractWithSigner } from '@/lib/contract';

/**
 * Create Royalty Pool Component
 *
 * Features:
 * - Create a new royalty pool for a track
 * - Send ETH to fund royalties
 * - Automatically encrypts total amount on-chain
 * - Validates track existence
 * - Handles transaction states
 */
interface CreateRoyaltyPoolProps {
  provider: BrowserProvider | null;
  account: string | null;
  onPoolCreated?: () => void;
}

export default function CreateRoyaltyPool({ provider, account, onPoolCreated }: CreateRoyaltyPoolProps) {
  const [trackId, setTrackId] = useState('');
  const [amount, setAmount] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Validate form inputs
   */
  function validateForm(): string | null {
    if (!trackId.trim()) {
      return 'Please enter a track ID';
    }

    const trackIdNum = parseInt(trackId);
    if (isNaN(trackIdNum) || trackIdNum <= 0) {
      return 'Track ID must be a positive number';
    }

    if (!amount.trim()) {
      return 'Please enter an amount';
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return 'Amount must be greater than 0';
    }

    return null;
  }

  /**
   * Create royalty pool
   *
   * Steps:
   * 1. Validate inputs
   * 2. Call createRoyaltyPool with ETH value
   * 3. The contract encrypts the total amount on-chain
   * 4. Pool is ready for distribution
   */
  async function createPool() {
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

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = await getContractWithSigner(provider);

      // Parse track ID and amount
      const trackIdNum = parseInt(trackId);
      const amountWei = parseEther(amount);

      console.log('Creating royalty pool...');
      console.log('Track ID:', trackIdNum);
      console.log('Amount:', amount, 'ETH');

      // Call contract function with ETH value
      // The contract will encrypt the amount on-chain
      const tx = await contract.createRoyaltyPool(trackIdNum, {
        value: amountWei,
      });

      console.log('Transaction sent:', tx.hash);
      setSuccess('Pool creation transaction sent. Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();

      console.log('Transaction confirmed:', receipt.hash);

      // Extract pool ID from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'RoyaltyPoolCreated';
        } catch {
          return false;
        }
      });

      let poolId = 'unknown';
      if (event) {
        const parsed = contract.interface.parseLog(event);
        poolId = parsed?.args.poolId.toString() || 'unknown';
      }

      setSuccess(`Royalty pool #${poolId} created successfully with ${amount} ETH!`);

      // Reset form
      setTrackId('');
      setAmount('');

      // Notify parent
      if (onPoolCreated) {
        onPoolCreated();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create pool';
      console.error('Pool creation error:', err);
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  }

  if (!provider || !account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Royalty Pool</h2>
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Royalty Pool</h2>

      <div className="space-y-4">
        {/* Track ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Track ID
          </label>
          <input
            type="number"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="1"
            min="1"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isCreating}
          />
          <p className="mt-1 text-xs text-gray-500">
            The ID of the track to create a royalty pool for
          </p>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Royalty Amount (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            min="0"
            step="0.001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isCreating}
          />
          <p className="mt-1 text-xs text-gray-500">
            Total amount to distribute to rights holders (encrypted on-chain)
          </p>
        </div>

        {/* Create Button */}
        <button
          onClick={createPool}
          disabled={isCreating}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating Pool...' : 'Create Royalty Pool'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong> The total amount is encrypted on-chain using FHEVM.
          After distribution, each rights holder can decrypt only their own payment amount.
        </p>
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
