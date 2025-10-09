'use client';

import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import ConnectWallet from '@/components/ConnectWallet';
import RegisterRightsHolder from '@/components/RegisterRightsHolder';
import RegisterTrack from '@/components/RegisterTrack';
import CreateRoyaltyPool from '@/components/CreateRoyaltyPool';
import DistributeRoyalties from '@/components/DistributeRoyalties';
import ClaimRoyalty from '@/components/ClaimRoyalty';
import TracksList from '@/components/TracksList';

/**
 * Private Music Royalty - Main Page
 *
 * This application demonstrates FHEVM SDK integration for private music royalty distribution.
 *
 * Features:
 * - Rights holder registration and verification
 * - Track registration with encrypted royalty shares
 * - Royalty pool creation with encrypted amounts
 * - Private distribution calculations using FHE
 * - Secure claim process with decryption
 *
 * FHEVM SDK Usage:
 * - Encryption: Shares and amounts are encrypted on-chain
 * - Access Control: Only authorized parties can decrypt their values
 * - Privacy: Royalty splits remain confidential
 * - Computation: Distribution calculations on encrypted data
 */
export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('register');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Handle successful wallet connection
   */
  function handleWalletConnected(address: string, walletProvider: BrowserProvider) {
    setAccount(address);
    setProvider(walletProvider);
  }

  /**
   * Trigger refresh of tracks list
   */
  function triggerRefresh() {
    setRefreshTrigger(prev => prev + 1);
  }

  /**
   * Tab configuration
   */
  const tabs = [
    { id: 'register', label: 'Register', icon: '👤' },
    { id: 'track', label: 'Create Track', icon: '🎵' },
    { id: 'pool', label: 'Create Pool', icon: '💰' },
    { id: 'distribute', label: 'Distribute', icon: '📊' },
    { id: 'claim', label: 'Claim', icon: '✅' },
    { id: 'tracks', label: 'All Tracks', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Private Music Royalty Platform
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Powered by FHEVM - Fully Homomorphic Encryption for Confidential Royalty Distribution
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Example Application
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Wallet Connection */}
          <div className="lg:col-span-1">
            <ConnectWallet onWalletConnected={handleWalletConnected} />

            {/* Info Card */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">How It Works</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Register as a rights holder and get verified</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Create tracks with encrypted royalty splits</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Create royalty pools with ETH for distribution</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Distribute royalties using FHE calculations</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">5.</span>
                  <span>Rights holders claim their encrypted payments</span>
                </li>
              </ol>
            </div>

            {/* FHEVM Features */}
            <div className="mt-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">FHEVM Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Encrypted Shares:</strong> Royalty percentages hidden from public</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Private Calculations:</strong> Distribution computed on encrypted data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Selective Disclosure:</strong> Only holders see their amounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Secure Claims:</strong> Decryption via oracle callbacks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content - Main Interface */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'register' && (
                <RegisterRightsHolder provider={provider} account={account} />
              )}

              {activeTab === 'track' && (
                <RegisterTrack
                  provider={provider}
                  account={account}
                  onTrackRegistered={triggerRefresh}
                />
              )}

              {activeTab === 'pool' && (
                <CreateRoyaltyPool
                  provider={provider}
                  account={account}
                  onPoolCreated={triggerRefresh}
                />
              )}

              {activeTab === 'distribute' && (
                <DistributeRoyalties
                  provider={provider}
                  account={account}
                  onDistributed={triggerRefresh}
                />
              )}

              {activeTab === 'claim' && (
                <ClaimRoyalty
                  provider={provider}
                  account={account}
                  onClaimed={triggerRefresh}
                />
              )}

              {activeTab === 'tracks' && (
                <TracksList
                  provider={provider}
                  account={account}
                  key={refreshTrigger}
                />
              )}
            </div>

            {/* SDK Integration Info */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-yellow-900 mb-2">FHEVM SDK Integration</h4>
              <p className="text-xs text-yellow-800">
                This application uses the <code className="bg-yellow-100 px-1 py-0.5 rounded">@fhevm/sdk</code> package
                for client-side encryption and decryption. The SDK automatically handles WASM initialization,
                key generation, and secure communication with the FHEVM network.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Example Next.js Application - FHEVM Music Royalty Platform</p>
            <p className="mt-1">
              Built with Next.js 14, TypeScript, Tailwind CSS, and FHEVM SDK
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
