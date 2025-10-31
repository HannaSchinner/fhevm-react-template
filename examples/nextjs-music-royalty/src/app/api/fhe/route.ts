import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * FHE Operations API Route
 *
 * Provides server-side FHE operations for the application
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, data } = await request.json();

    // Initialize FHEVM client
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const client = await createFhevmClient({
      provider,
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia'
    });

    switch (operation) {
      case 'initialize':
        return NextResponse.json({
          success: true,
          message: 'FHEVM client initialized successfully'
        });

      case 'getPublicKey':
        const publicKey = await client.getPublicKey();
        return NextResponse.json({
          success: true,
          publicKey
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown operation' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('FHE API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE Operations API',
    endpoints: {
      POST: {
        operations: ['initialize', 'getPublicKey']
      }
    }
  });
}
