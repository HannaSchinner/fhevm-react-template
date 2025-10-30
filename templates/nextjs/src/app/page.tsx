'use client';

import React from 'react';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import EncryptionDemo from '@/components/fhe/EncryptionDemo';
import ComputationDemo from '@/components/fhe/ComputationDemo';
import KeyManager from '@/components/fhe/KeyManager';
import BankingExample from '@/components/examples/BankingExample';
import MedicalExample from '@/components/examples/MedicalExample';

/**
 * FHEVM Next.js Template - Main Page
 *
 * This template demonstrates complete FHEVM SDK integration with Next.js 14
 *
 * Features:
 * - Client-side encryption and decryption
 * - FHE computations on encrypted data
 * - Key management and security
 * - Real-world use case examples
 */
export default function Home() {
  return (
    <FHEProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              FHEVM Next.js Template
            </h1>
            <p className="mt-2 text-gray-600">
              Fully Homomorphic Encryption for Privacy-Preserving Applications
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <EncryptionDemo />
            <ComputationDemo />
          </div>

          <div className="mb-8">
            <KeyManager />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Use Case Examples</h2>
            <BankingExample />
            <MedicalExample />
          </div>
        </main>

        <footer className="mt-12 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>FHEVM Next.js Template - Built with @fhevm/sdk</p>
          </div>
        </footer>
      </div>
    </FHEProvider>
  );
}
