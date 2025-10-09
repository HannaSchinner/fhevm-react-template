'use client';

import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { getContractWithSigner } from '@/lib/contract';
import { useFhevm } from './FhevmProvider';

/**
 * Claim Royalty Component
 *
 * Features:
 * - View encrypted payment amount for connected user
 * - Decrypt payment using FHEVM SDK
 * - Claim royalty payment from pool
 * - Shows claim status and history
 *
 * This demonstrates the full FHEVM workflow:
 * 1. Encrypted value stored on-chain
 * 2. User decrypts with their permission
 * 3. Contract processes decrypted value
 */
interface ClaimRoyaltyProps {
  provider: BrowserProvider | null;
  account: string | null;
  onClaimed?: () => void;
}

export default function ClaimRoyalty({ provider, account, onClaimed }: ClaimRoyaltyProps) {
  const [poolId, setPoolId] = useState('');
  const [claimStatus, setClaimStatus] = useState<boolean | null>(null);
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [encryptedPayment, setEncryptedPayment] = useState<string | null>(null);
  const [decryptedPayment, setDecryptedPayment] = useState<string | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { fhevmInstance } = useFhevm();

  /**
   * Load pool and claim information when pool ID changes
   */
  useEffect(() => {
    if (poolId && provider && account) {
      loadClaimInfo();
    } else {
      resetInfo();
    }
  }, [poolId, provider, account]);

  /**
   * Reset information
   */
  function resetInfo() {
    setClaimStatus(null);
    setPoolInfo(null);
    setEncryptedPayment(null);
    setDecryptedPayment(null);
  }

  /**
   * Load claim information
   */
  async function loadClaimInfo() {
    if (!provider || !account || !poolId) return;

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
        payees: info.payees,
      });

      // Check if user is a rights holder
      const isRightsHolder = info.payees.some(
        (payee: string) => payee.toLowerCase() === account.toLowerCase()
      );

      if (!isRightsHolder) {
        setError('You are not a rights holder for this pool');
        setIsLoadingInfo(false);
        return;
      }

      // Get claim status
      const claimed = await contract.getClaimStatus(poolIdNum, account);
      setClaimStatus(claimed);

      // Get encrypted payment if distributed
      if (info.distributed && !claimed) {
        try {
          const payment = await contract.getEncryptedPayment(poolIdNum, account);
          setEncryptedPayment(payment.toString());
        } catch (err) {
          console.error('Error getting encrypted payment:', err);
        }
      }
    } catch (err) {
      console.error('Error loading claim info:', err);
      setError('Failed to load claim information');
    } finally {
      setIsLoadingInfo(false);
    }
  }

  /**
   * Decrypt payment amount using FHEVM SDK
   *
   * Steps:
   * 1. Get encrypted payment from contract
   * 2. Request decryption using FHEVM instance
   * 3. Display decrypted amount to user
   * 4. Note: In production, decryption happens during claim via callback
   */
  async function decryptPayment() {
    if (!fhevmInstance || !provider || !account || !encryptedPayment) {
      setError('Missing required data for decryption');
      return;
    }

    setIsDecrypting(true);
    setError(null);

    try {
      console.log('Decrypting payment amount...');
      console.log('Encrypted payment:', encryptedPayment);

      const contract = await getContractWithSigner(provider);
      const poolIdNum = parseInt(poolId);

      // Get the encrypted value handle
      const encryptedValue = await contract.getEncryptedPayment(poolIdNum, account);

      // Request decryption through FHEVM SDK
      // Note: This is a simplified example. In production, decryption
      // happens automatically during the claim process via oracle callback
      const decrypted = await fhevmInstance.decrypt(encryptedValue, account);

      // The decrypted value is (totalAmount * share), needs to be divided by 10000
      const finalAmount = BigInt(decrypted) / 10000n;

      setDecryptedPayment(formatEther(finalAmount));
      console.log('Decrypted payment:', formatEther(finalAmount), 'ETH');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrypt payment';
      console.error('Decryption error:', err);
      setError(errorMessage);
    } finally {
      setIsDecrypting(false);
    }
  }

  /**
   * Claim royalty payment
   *
   * Steps:
   * 1. Call claimRoyalty function
   * 2. Contract requests decryption via oracle
   * 3. Oracle decrypts and calls processClaimPayment callback
   * 4. Payment is transferred to claimer
   */
  async function claimRoyalty() {
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

    if (!poolInfo?.distributed) {
      setError('Royalties have not been distributed yet');
      return;
    }

    if (claimStatus) {
      setError('You have already claimed from this pool');
      return;
    }

    setIsClaiming(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = await getContractWithSigner(provider);

      console.log('Claiming royalty from pool:', poolIdNum);

      // Call claimRoyalty function
      // This initiates the decryption process via oracle
      const tx = await contract.claimRoyalty(poolIdNum);

      console.log('Transaction sent:', tx.hash);
      setSuccess('Claim transaction sent. Waiting for confirmation and decryption...');

      // Wait for confirmation
      const receipt = await tx.wait();

      console.log('Transaction confirmed:', receipt.hash);
      setSuccess('Royalty claim initiated! The oracle will decrypt your payment and transfer it.');

      // Reload claim info
      await loadClaimInfo();

      // Notify parent
      if (onClaimed) {
        onClaimed();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim royalty';
      console.error('Claim error:', err);
      setError(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  }

  if (!provider || !account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Claim Royalty</h2>
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Claim Royalty</h2>

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
            disabled={isClaiming}
          />
        </div>

        {/* Loading State */}
        {isLoadingInfo && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading claim information...</p>
          </div>
        )}

        {/* Pool Information */}
        {poolInfo && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-800 mb-2">Pool Information</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Track ID:</span>
              <span className="font-semibold text-gray-800">{poolInfo.trackId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distribution Status:</span>
              <span className={`font-semibold ${poolInfo.distributed ? 'text-green-600' : 'text-yellow-600'}`}>
                {poolInfo.distributed ? 'Distributed' : 'Not Distributed'}
              </span>
            </div>
            {claimStatus !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Claim Status:</span>
                <span className={`font-semibold ${claimStatus ? 'text-green-600' : 'text-yellow-600'}`}>
                  {claimStatus ? 'Claimed' : 'Not Claimed'}
                </span>
              </div>
            )}
            {decryptedPayment && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Payment:</span>
                <span className="font-semibold text-green-600">{decryptedPayment} ETH</span>
              </div>
            )}
          </div>
        )}

        {/* Decrypt Button */}
        {encryptedPayment && !decryptedPayment && !claimStatus && (
          <button
            onClick={decryptPayment}
            disabled={isDecrypting || !fhevmInstance}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isDecrypting ? 'Decrypting...' : 'Decrypt Payment Amount'}
          </button>
        )}

        {/* Claim Button */}
        <button
          onClick={claimRoyalty}
          disabled={isClaiming || isLoadingInfo || !poolInfo?.distributed || claimStatus === true}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isClaiming ? 'Claiming...' : 'Claim Royalty Payment'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong> When you claim, the contract requests decryption from the oracle.
          The oracle decrypts your encrypted payment amount and transfers the ETH to your address.
          This ensures your payment amount remains private until you claim.
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
