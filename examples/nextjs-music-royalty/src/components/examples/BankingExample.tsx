'use client';

import React, { useState } from 'react';
import { useFhevm } from '@/hooks/useFhevm';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * Banking Example Component
 *
 * Demonstrates private banking operations using FHEVM
 * - Private balance tracking
 * - Encrypted transfers
 * - Confidential transaction history
 */
export default function BankingExample() {
  const { client, isInitialized } = useFhevm();
  const [balance, setBalance] = useState<number>(1000);
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleDeposit = async () => {
    if (!client || !transferAmount) return;

    setIsProcessing(true);
    setMessage('');

    try {
      const amount = Number(transferAmount);
      // In real implementation, encrypt and send to contract
      const encryptedAmount = await client.encrypt(amount);

      // Simulate deposit
      setTimeout(() => {
        setBalance(prev => prev + amount);
        setMessage(`Successfully deposited ${amount} (encrypted)`);
        setTransferAmount('');
        setIsProcessing(false);
      }, 1000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!client || !transferAmount) return;

    const amount = Number(transferAmount);
    if (amount > balance) {
      setMessage('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      // In real implementation, encrypt and send to contract
      const encryptedAmount = await client.encrypt(amount);

      // Simulate withdrawal
      setTimeout(() => {
        setBalance(prev => prev - amount);
        setMessage(`Successfully withdrew ${amount} (encrypted)`);
        setTransferAmount('');
        setIsProcessing(false);
      }, 1000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    if (!client || !transferAmount || !recipient) return;

    const amount = Number(transferAmount);
    if (amount > balance) {
      setMessage('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      // In real implementation, encrypt and send to contract
      const encryptedAmount = await client.encrypt(amount);

      // Simulate transfer
      setTimeout(() => {
        setBalance(prev => prev - amount);
        setMessage(`Successfully transferred ${amount} to ${recipient.substring(0, 10)}... (encrypted)`);
        setTransferAmount('');
        setRecipient('');
        setIsProcessing(false);
      }, 1000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <Card
      title="Private Banking Example"
      subtitle="Confidential balance and transactions using FHE"
    >
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Your Private Balance</div>
          <div className="text-3xl font-bold text-gray-900">
            ${balance.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            (In real implementation, this would be encrypted on-chain)
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={!isInitialized || isProcessing}
          />

          <Input
            label="Recipient Address (for transfers)"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={!isInitialized || isProcessing}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="success"
            onClick={handleDeposit}
            disabled={!isInitialized || !transferAmount || isProcessing}
            isLoading={isProcessing}
          >
            Deposit
          </Button>

          <Button
            variant="secondary"
            onClick={handleWithdraw}
            disabled={!isInitialized || !transferAmount || isProcessing}
            isLoading={isProcessing}
          >
            Withdraw
          </Button>

          <Button
            variant="primary"
            onClick={handleTransfer}
            disabled={!isInitialized || !transferAmount || !recipient || isProcessing}
            isLoading={isProcessing}
          >
            Transfer
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.startsWith('Error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Features */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Privacy Features:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ Balance encrypted on-chain</li>
            <li>✓ Transaction amounts hidden from public</li>
            <li>✓ Only account owner can decrypt their balance</li>
            <li>✓ Transfer amounts remain confidential</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
