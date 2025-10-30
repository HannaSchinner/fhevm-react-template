'use client';

import React, { useState } from 'react';
import { useFHE } from './FHEProvider';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useComputation } from '@/hooks/useComputation';

/**
 * Computation Demo Component
 *
 * Demonstrates homomorphic computations on encrypted data
 */
export default function ComputationDemo() {
  const { isInitialized } = useFHE();
  const { compute, isComputing } = useComputation();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState('');

  async function handleCompute() {
    if (!value1 || !value2) return;

    try {
      const computedResult = await compute({
        operation,
        operands: [parseInt(value1), parseInt(value2)],
      });
      setResult(computedResult);
    } catch (error) {
      console.error('Computation error:', error);
    }
  }

  return (
    <Card
      title="Computation Demo"
      description="Perform calculations on encrypted data"
    >
      <div className="space-y-4">
        <Input
          label="First Value"
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Enter first number"
          disabled={!isInitialized}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isInitialized}
          >
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
            <option value="multiply">Multiply (×)</option>
          </select>
        </div>

        <Input
          label="Second Value"
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder="Enter second number"
          disabled={!isInitialized}
        />

        <Button
          onClick={handleCompute}
          loading={isComputing}
          disabled={!isInitialized || !value1 || !value2}
          className="w-full"
        >
          Compute on Encrypted Data
        </Button>

        {result && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Encrypted Result:
            </p>
            <p className="text-xs text-blue-700 font-mono break-all">
              {result}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
