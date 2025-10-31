import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * Encryption API Route
 *
 * Handles server-side encryption of values using FHEVM
 */
export async function POST(request: NextRequest) {
  try {
    const { value, valueType } = await request.json();

    if (value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Value is required' },
        { status: 400 }
      );
    }

    // Initialize FHEVM client
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const client = await createFhevmClient({
      provider,
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia'
    });

    // Encrypt the value based on type
    const encryptedValue = await client.encrypt(value, valueType || 'uint32');

    return NextResponse.json({
      success: true,
      encrypted: encryptedValue,
      originalValue: value,
      type: valueType || 'uint32'
    });
  } catch (error: any) {
    console.error('Encryption API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Encryption API',
    usage: {
      method: 'POST',
      body: {
        value: 'number or bigint',
        valueType: 'optional - uint8|uint16|uint32|uint64 (default: uint32)'
      }
    }
  });
}
