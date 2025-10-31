import { NextRequest, NextResponse } from 'next/server';

/**
 * Homomorphic Computation API Route
 *
 * Demonstrates FHE computation capabilities
 * All actual computations happen on-chain in smart contracts
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, operands } = await request.json();

    if (!operation || !operands) {
      return NextResponse.json(
        { success: false, error: 'Operation and operands required' },
        { status: 400 }
      );
    }

    // FHE computations happen on-chain via smart contracts
    // This endpoint serves as documentation/reference

    const supportedOperations = {
      add: 'Addition on encrypted values',
      sub: 'Subtraction on encrypted values',
      mul: 'Multiplication on encrypted values',
      div: 'Division on encrypted values (limited)',
      eq: 'Equality comparison',
      ne: 'Not equal comparison',
      lt: 'Less than comparison',
      lte: 'Less than or equal comparison',
      gt: 'Greater than comparison',
      gte: 'Greater than or equal comparison',
      min: 'Minimum of encrypted values',
      max: 'Maximum of encrypted values'
    };

    if (!Object.keys(supportedOperations).includes(operation)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported operation',
          supportedOperations
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'FHE computations are performed on-chain',
      operation,
      note: 'Use smart contract methods for actual FHE computations',
      supportedOperations
    });
  } catch (error: any) {
    console.error('Compute API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE Computation API',
    note: 'Homomorphic computations are performed on-chain in smart contracts',
    supportedOperations: {
      arithmetic: ['add', 'sub', 'mul', 'div'],
      comparison: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte'],
      utility: ['min', 'max']
    }
  });
}
