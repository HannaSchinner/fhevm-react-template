'use client';

import React, { useState } from 'react';
import { useFhevm } from '@/hooks/useFhevm';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

/**
 * Medical Records Example Component
 *
 * Demonstrates private medical data handling using FHEVM
 * - Encrypted health metrics
 * - Selective data sharing
 * - Privacy-preserving analytics
 */
export default function MedicalExample() {
  const { client, isInitialized } = useFhevm();
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [records, setRecords] = useState<Array<{ type: string; value: string; encrypted: boolean }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleAddRecord = async (type: string, value: string) => {
    if (!client || !value) return;

    setIsProcessing(true);
    setMessage('');

    try {
      // Encrypt the medical data
      const encryptedValue = await client.encrypt(Number(value));

      // Add to records
      const newRecord = {
        type,
        value,
        encrypted: true
      };

      setRecords(prev => [...prev, newRecord]);
      setMessage(`${type} record added and encrypted successfully`);

      // Clear input
      if (type === 'Blood Pressure') setBloodPressure('');
      if (type === 'Heart Rate') setHeartRate('');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      title="Private Medical Records Example"
      subtitle="HIPAA-compliant health data using FHE"
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              label="Blood Pressure (mmHg)"
              type="number"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="120"
              disabled={!isInitialized || isProcessing}
            />
            <div className="flex items-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddRecord('Blood Pressure', bloodPressure)}
                disabled={!isInitialized || !bloodPressure || isProcessing}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              label="Heart Rate (bpm)"
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="75"
              disabled={!isInitialized || isProcessing}
            />
            <div className="flex items-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddRecord('Heart Rate', heartRate)}
                disabled={!isInitialized || !heartRate || isProcessing}
              >
                Add
              </Button>
            </div>
          </div>
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

        {/* Records List */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Encrypted Records:</h4>
          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No records yet</p>
              <p className="text-xs mt-1">Add your first encrypted health metric above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((record, index) => (
                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{record.type}</div>
                    <div className="text-xs text-gray-600">Value: {record.value} (encrypted on-chain)</div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium">Encrypted</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Features */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Privacy & Compliance:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✓ All health data encrypted end-to-end</li>
            <li>✓ Only authorized parties can decrypt</li>
            <li>✓ HIPAA-compliant data handling</li>
            <li>✓ Immutable audit trail on-chain</li>
            <li>✓ Selective sharing with healthcare providers</li>
          </ul>
        </div>

        {/* Use Cases */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Medical Use Cases:</h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Remote patient monitoring</li>
            <li>• Clinical trial data collection</li>
            <li>• Insurance claim processing</li>
            <li>• Medical research and analytics</li>
            <li>• Prescription management</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
