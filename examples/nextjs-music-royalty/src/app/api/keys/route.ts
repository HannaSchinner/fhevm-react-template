import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

/**
 * Key Management API Route
 *
 * Handles FHEVM public key retrieval and management
 */
export async function GET() {
  try {
    // Initialize FHEVM client
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const client = await createFhevmClient({
      provider,
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia'
    });

    // Get public key from FHEVM network
    const publicKey = await client.getPublicKey();

    return NextResponse.json({
      success: true,
      publicKey,
      network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia'
    });
  } catch (error: any) {
    console.error('Keys API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'rotate') {
      // Key rotation would be handled by FHEVM network
      // This is typically not done client-side
      return NextResponse.json({
        success: true,
        message: 'Key rotation is handled by the FHEVM network',
        note: 'Public keys are managed by the blockchain validator set'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Keys API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
