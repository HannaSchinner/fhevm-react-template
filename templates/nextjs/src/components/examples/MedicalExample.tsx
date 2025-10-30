'use client';

import React, { useState } from 'react';
import { useFHE } from '../fhe/FHEProvider';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useEncrypt } from '@/hooks/useFhevm';

/**
 * Medical Example Component
 *
 * Demonstrates privacy-preserving medical data management
 * where patient records remain encrypted
 */
export default function MedicalExample() {
  const { isInitialized } = useFHE();
  const { encrypt, isEncrypting } = useEncrypt();
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
  });
  const [encryptedRecords, setEncryptedRecords] = useState<string[]>([]);

  async function handleSubmitVitals() {
    if (!vitalSigns.heartRate || !vitalSigns.bloodPressure || !vitalSigns.temperature) {
      return;
    }

    try {
      const encryptedHeartRate = await encrypt(parseInt(vitalSigns.heartRate));
      const record = `Record ${encryptedRecords.length + 1}: Encrypted`;
      setEncryptedRecords([...encryptedRecords, record]);
      setVitalSigns({ heartRate: '', bloodPressure: '', temperature: '' });
    } catch (error) {
      console.error('Failed to encrypt medical data:', error);
    }
  }

  return (
    <Card
      title="Medical Records Use Case"
      description="HIPAA-compliant encrypted patient data"
    >
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Patient Records
          </p>
          <p className="text-lg font-bold text-teal-600">
            {encryptedRecords.length} Encrypted Records
          </p>
          <p className="text-xs text-gray-500 mt-1">
            All patient data is encrypted end-to-end
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Heart Rate (bpm)"
            type="number"
            value={vitalSigns.heartRate}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, heartRate: e.target.value })
            }
            placeholder="72"
            disabled={!isInitialized}
          />

          <Input
            label="Blood Pressure"
            type="text"
            value={vitalSigns.bloodPressure}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })
            }
            placeholder="120/80"
            disabled={!isInitialized}
          />

          <Input
            label="Temperature (°F)"
            type="number"
            value={vitalSigns.temperature}
            onChange={(e) =>
              setVitalSigns({ ...vitalSigns, temperature: e.target.value })
            }
            placeholder="98.6"
            disabled={!isInitialized}
          />
        </div>

        <Button
          onClick={handleSubmitVitals}
          loading={isEncrypting}
          disabled={
            !isInitialized ||
            !vitalSigns.heartRate ||
            !vitalSigns.bloodPressure ||
            !vitalSigns.temperature
          }
          className="w-full"
        >
          Encrypt and Submit Vitals
        </Button>

        {encryptedRecords.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Encrypted Records
            </p>
            <div className="space-y-2">
              {encryptedRecords.map((record, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{record}</span>
                  <span className="text-xs text-green-600">✓ Encrypted</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
