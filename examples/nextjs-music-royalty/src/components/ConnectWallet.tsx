'use client';

import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { useFhevm } from './FhevmProvider';

/**
 * Wallet Connection Component
 *
 * Features:
 * - Detects MetaMask or compatible wallet
 * - Connects to wallet and requests account access
 * - Initializes FHEVM SDK after connection
 * - Displays connected address and network
 * - Shows connection status and errors
 */
interface ConnectWalletProps {
  onWalletConnected?: (address: string, provider: BrowserProvider) => void;
}

export default function ConnectWallet({ onWalletConnected }: ConnectWalletProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { initializeFhevm, isInitializing, error: fhevmError } = useFhevm();

  /**
   * Check if wallet is already connected on mount
   */
  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  /**
   * Check if wallet is already connected
   */
  async function checkConnection() {
    if (!window.ethereum) return;

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.listAccounts();

      if (accounts.length > 0) {
        const address = accounts[0].address;
        const network = await browserProvider.getNetwork();

        setAccount(address);
        setProvider(browserProvider);
        setChainId(Number(network.chainId));

        // Initialize FHEVM
        await initializeFhevm(browserProvider);

        if (onWalletConnected) {
          onWalletConnected(address, browserProvider);
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  }

  /**
   * Handle account changes
   */
  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      // User disconnected wallet
      setAccount(null);
      setProvider(null);
      setChainId(null);
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      checkConnection();
    }
  }

  /**
   * Handle chain changes
   */
  function handleChainChanged() {
    // Reload the page on chain change as recommended by MetaMask
    window.location.reload();
  }

  /**
   * Connect to wallet
   */
  async function connectWallet() {
    if (!window.ethereum) {
      setError('Please install MetaMask or a compatible wallet');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const browserProvider = new BrowserProvider(window.ethereum);
      await browserProvider.send('eth_requestAccounts', []);

      // Get account and network info
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const network = await browserProvider.getNetwork();

      setAccount(address);
      setProvider(browserProvider);
      setChainId(Number(network.chainId));

      console.log('Connected to:', address);
      console.log('Chain ID:', network.chainId);

      // Initialize FHEVM SDK
      await initializeFhevm(browserProvider);

      if (onWalletConnected) {
        onWalletConnected(address, browserProvider);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      console.error('Connection error:', err);
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }

  /**
   * Disconnect wallet
   */
  function disconnectWallet() {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setError(null);
  }

  /**
   * Format address for display
   */
  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Get network name from chain ID
   */
  function getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      31337: 'Hardhat Local',
    };
    return networks[chainId] || `Chain ${chainId}`;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Wallet Connection</h2>

      {!account ? (
        <div>
          <p className="text-gray-600 mb-4">
            Connect your wallet to interact with the Private Music Royalty platform
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting || isInitializing}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : isInitializing ? 'Initializing FHEVM...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-mono font-semibold text-gray-800">{formatAddress(account)}</span>
            </div>
            {chainId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-semibold text-gray-800">{getNetworkName(chainId)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">FHEVM Status:</span>
              <span className={`font-semibold ${isInitializing ? 'text-yellow-600' : 'text-green-600'}`}>
                {isInitializing ? 'Initializing...' : 'Ready'}
              </span>
            </div>
          </div>

          <button
            onClick={disconnectWallet}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {(error || fhevmError) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error || fhevmError}</p>
        </div>
      )}

      {!window.ethereum && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            No Ethereum wallet detected. Please install{' '}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              MetaMask
            </a>{' '}
            or a compatible wallet.
          </p>
        </div>
      )}
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
