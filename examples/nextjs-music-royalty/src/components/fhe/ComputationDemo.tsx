'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * Computation Demo Component
 *
 * Demonstrates FHE computation capabilities
 * Note: Actual computations happen on-chain in smart contracts
 */
export default function ComputationDemo() {
  const [selectedOp, setSelectedOp] = useState<string>('add');

  const operations = [
    { id: 'add', name: 'Addition', symbol: '+', description: 'Add two encrypted values' },
    { id: 'sub', name: 'Subtraction', symbol: '-', description: 'Subtract encrypted values' },
    { id: 'mul', name: 'Multiplication', symbol: '×', description: 'Multiply encrypted values' },
    { id: 'eq', name: 'Equality', symbol: '==', description: 'Compare if values are equal' },
    { id: 'lt', name: 'Less Than', symbol: '<', description: 'Check if value is less than' },
    { id: 'gt', name: 'Greater Than', symbol: '>', description: 'Check if value is greater than' },
    { id: 'min', name: 'Minimum', symbol: 'min', description: 'Get minimum of values' },
    { id: 'max', name: 'Maximum', symbol: 'max', description: 'Get maximum of values' }
  ];

  return (
    <Card
      title="FHE Computation Demo"
      subtitle="Homomorphic operations on encrypted data"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Operation
          </label>
          <div className="grid grid-cols-2 gap-2">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => setSelectedOp(op.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left
                  ${selectedOp === op.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-semibold text-gray-900">{op.name}</div>
                <div className="text-xs text-gray-600">{op.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            How FHE Computation Works:
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Computations are performed on encrypted data</li>
            <li>• Results remain encrypted throughout</li>
            <li>• Operations executed in smart contracts</li>
            <li>• No decryption needed during computation</li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-600">
          See the smart contracts for actual FHE computation implementation
        </div>
      </div>
    </Card>
  );
}
