'use client';

import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { getContractWithSigner } from '@/lib/contract';

/**
 * Distribute Royalties Component
 *
 * Features:
 * - Distribute royalties from a pool to rights holders
 * - Shows pool information before distribution
 * - Calculates encrypted payments based on shares
 * - Allows rights holders to decrypt their payment amounts
 */
interface DistributeRoyaltiesProps {
  provider: BrowserProvider | null;
  account: string | null;
  onDistributed?: () => void;
}

export default function DistributeRoyalties({ provider, account, onDistributed }: DistributeRoyaltiesProps) {
  const [poolId, setPoolId] = useState('');
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Load pool information when pool ID changes
   */
  useEffect(() => {
    if (poolId && provider) {
      loadPoolInfo();
    } else {
      setPoolInfo(null);
    }
  }, [poolId, provider]);

  /**
   * Load pool information from contract
   */
  async function loadPoolInfo() {
    if (!provider || !poolId) return;

    const poolIdNum = parseInt(poolId);
    if (isNaN(poolIdNum) || poolIdNum <= 0) return;

    setIsLoadingInfo(true);
    setError(null);

    try {
      const contract = await getContractWithSigner(provider);

      // Get pool info
      const info = await contract.getPoolInfo(poolIdNum);

      setPoolInfo({
        trackId: info.trackId.toString(),
        distributed: info.distributed,
        createdAt: info.createdAt,
        payees: info.payees,
      });
    } catch (err) {
      console.error('Error loading pool info:', err);
      setPoolInfo(null);
      setError('Pool not found or error loading information');
    } finally {
      setIsLoadingInfo(false);
    }
  }

  /**
   * Distribute royalties
   *
   * Steps:
   * 1. Validate pool exists and is not distributed
   * 2. Call distributeRoyalties function
   * 3. Contract calculates encrypted payment for each rights holder
   * 4. Each payment is (totalAmount * share) / 10000
   * 5. Rights holders can then claim their payments
   */
  async function distributeRoyalties() {
    if (!provider || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!poolId.trim()) {
      setError('Please enter a pool ID');
      return;
    }

    const poolIdNum = parseInt(poolId);
    if (isNaN(poolIdNum) || poolIdNum <= 0) {
      setError('Pool ID must be a positive number');
      return;
    }

    if (!poolInfo) {
      setError('Please load pool information first');
      return;
    }

    if (poolInfo.distributed) {
      setError('This pool has already been distributed');
      return;
    }

    setIsDistributing(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = await getContractWithSigner(provider);

      console.log('Distributing royalties for pool:', poolIdNum);

      // Call distributeRoyalties function
      // This will calculate encrypted payments for all rights holders
      const tx = await contract.distributeRoyalties(poolIdNum);

      console.log('Transaction sent:', tx.hash);
      setSuccess('Distribution transaction sent. Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();

      console.log('Transaction confirmed:', receipt.hash);
      setSuccess(`Royalties distributed successfully! Rights holders can now claim their payments.`);

      // Reload pool info
      await loadPoolInfo();

      // Notify parent
      if (onDistributed) {
        onDistributed();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to distribute royalties';
      console.error('Distribution error:', err);
      setError(errorMessage);
    } finally {
      setIsDistributing(false);
    }
  }

  /**
   * Format timestamp to readable date
   */
  function formatDate(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  }

  if (!provider || !account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Distribute Royalties</h2>
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Distribute Royalties</h2>

      <div className="space-y-4">
        {/* Pool ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pool ID
          </label>
          <input
            type="number"
            value={poolId}
            onChange={(e) => setPoolId(e.target.value)}
            placeholder="1"
            min="1"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isDistributing}
          />
        </div>

        {/* Pool Information */}
        {isLoadingInfo && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading pool information...</p>
          </div>
        )}

        {poolInfo && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-800 mb-2">Pool Information</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Track ID:</span>
              <span className="font-semibold text-gray-800">{poolInfo.trackId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${poolInfo.distributed ? 'text-green-600' : 'text-yellow-600'}`}>
                {poolInfo.distributed ? 'Distributed' : 'Pending Distribution'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold text-gray-800">{formatDate(poolInfo.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rights Holders:</span>
              <span className="font-semibold text-gray-800">{poolInfo.payees.length}</span>
            </div>
            {poolInfo.payees.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Payees:</p>
                <ul className="space-y-1">
                  {poolInfo.payees.map((payee: string, index: number) => (
                    <li key={index} className="text-xs font-mono text-gray-700">
                      {payee.slice(0, 10)}...{payee.slice(-8)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Distribute Button */}
        <button
          onClick={distributeRoyalties}
          disabled={isDistributing || isLoadingInfo || !poolInfo || poolInfo?.distributed}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isDistributing ? 'Distributing...' : 'Distribute Royalties'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong> This calculates encrypted payment amounts for each rights holder
          based on their encrypted shares. Each payment is (totalAmount × share) / 10000.
          Rights holders can then claim and decrypt their payments.
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
