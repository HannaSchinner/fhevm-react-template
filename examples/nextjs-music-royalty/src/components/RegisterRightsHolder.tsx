'use client';

import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { getContractWithSigner } from '@/lib/contract';

/**
 * Rights Holder Registration Component
 *
 * Features:
 * - Register as a rights holder in the contract
 * - Check registration and verification status
 * - Display rights holder information
 * - Handle transaction states and errors
 */
interface RegisterRightsHolderProps {
  provider: BrowserProvider | null;
  account: string | null;
}

export default function RegisterRightsHolder({ provider, account }: RegisterRightsHolderProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [trackIds, setTrackIds] = useState<bigint[]>([]);
  const [registeredAt, setRegisteredAt] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Load rights holder information when account changes
   */
  useEffect(() => {
    if (provider && account) {
      loadRightsHolderInfo();
    }
  }, [provider, account]);

  /**
   * Load rights holder information from contract
   */
  async function loadRightsHolderInfo() {
    if (!provider || !account) return;

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContractWithSigner(provider);

      // Get rights holder info
      const info = await contract.getRightsHolderInfo(account);

      setIsVerified(info.verified);
      setRegisteredAt(info.registeredAt);
      setTrackIds(info.trackIds);

      // Check if registered (registeredAt > 0)
      setIsRegistered(info.registeredAt > 0n);
    } catch (err) {
      console.error('Error loading rights holder info:', err);
      // If error, assume not registered
      setIsRegistered(false);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Register as a rights holder
   */
  async function registerAsRightsHolder() {
    if (!provider || !account) {
      setError('Please connect your wallet first');
      return;
    }

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = await getContractWithSigner(provider);

      console.log('Registering as rights holder...');

      // Call registerRightsHolder function
      const tx = await contract.registerRightsHolder();

      console.log('Transaction sent:', tx.hash);
      setSuccess('Registration transaction sent. Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      console.log('Transaction confirmed:', receipt.hash);
      setSuccess('Successfully registered as rights holder! Waiting for verification from contract owner.');

      // Reload rights holder info
      await loadRightsHolderInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      console.error('Registration error:', err);
      setError(errorMessage);
    } finally {
      setIsRegistering(false);
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Rights Holder Registration</h2>
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Rights Holder Registration</h2>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : !isRegistered ? (
        <div>
          <p className="text-gray-600 mb-4">
            Register as a rights holder to create tracks and receive royalty payments.
          </p>
          <button
            onClick={registerAsRightsHolder}
            disabled={isRegistering}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRegistering ? 'Registering...' : 'Register as Rights Holder'}
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>

            {registeredAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Registered:</span>
                <span className="font-semibold text-gray-800">{formatDate(registeredAt)}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tracks:</span>
              <span className="font-semibold text-gray-800">{trackIds.length}</span>
            </div>
          </div>

          {!isVerified && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Your registration is pending verification by the contract owner. You can create tracks once verified.
              </p>
            </div>
          )}

          {isVerified && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                You are verified! You can now register tracks and manage royalty distributions.
              </p>
            </div>
          )}

          {trackIds.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Your Tracks:</h3>
              <ul className="space-y-1">
                {trackIds.map((trackId) => (
                  <li key={trackId.toString()} className="text-gray-600">
                    Track #{trackId.toString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
