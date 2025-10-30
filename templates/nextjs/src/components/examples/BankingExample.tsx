'use client';

import React, { useState } from 'react';
import { useFHE } from '../fhe/FHEProvider';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useEncrypt } from '@/hooks/useFhevm';

/**
 * Banking Example Component
 *
 * Demonstrates a privacy-preserving banking application
 * where account balances and transactions remain encrypted
 */
export default function BankingExample() {
  const { isInitialized } = useFHE();
  const { encrypt, isEncrypting } = useEncrypt();
  const [amount, setAmount] = useState('');
  const [encryptedBalance, setEncryptedBalance] = useState('');
  const [transactions, setTransactions] = useState<Array<{
    type: string;
    amount: string;
    timestamp: string;
  }>>([]);

  async function handleDeposit() {
    if (!amount) return;

    try {
      const encrypted = await encrypt(parseInt(amount));
      setEncryptedBalance(encrypted.toString());
      setTransactions([
        ...transactions,
        {
          type: 'Deposit',
          amount,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  }

  return (
    <Card
      title="Banking Use Case"
      description="Private account balances and confidential transactions"
    >
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Encrypted Balance
          </p>
          <p className="text-2xl font-bold text-indigo-600">
            {encryptedBalance ? '****' : '$0.00'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Balance is encrypted and hidden from public view
          </p>
        </div>

        <Input
          label="Deposit Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={!isInitialized}
        />

        <Button
          onClick={handleDeposit}
          loading={isEncrypting}
          disabled={!isInitialized || !amount}
          className="w-full"
        >
          Make Private Deposit
        </Button>

        {transactions.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Transaction History
            </p>
            <div className="space-y-2">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{tx.type}</span>
                  <span className="text-sm font-semibold text-green-600">
                    +${tx.amount}
                  </span>
                  <span className="text-xs text-gray-500">{tx.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
