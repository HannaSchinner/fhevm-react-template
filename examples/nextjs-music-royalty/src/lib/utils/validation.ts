/**
 * Validation utilities for FHEVM applications
 */

/**
 * Validate encryption parameters
 */
export interface EncryptionParams {
  value: number | bigint;
  type?: string;
}

export function validateEncryptionParams(params: EncryptionParams): {
  valid: boolean;
  error?: string;
} {
  const { value, type = 'uint32' } = params;

  // Check if value is a valid number
  if (typeof value !== 'number' && typeof value !== 'bigint') {
    return { valid: false, error: 'Value must be a number or bigint' };
  }

  // Check if value is negative
  if (value < 0) {
    return { valid: false, error: 'Value cannot be negative' };
  }

  // Validate type
  const validTypes = ['bool', 'uint8', 'uint16', 'uint32', 'uint64', 'address'];
  if (!validTypes.includes(type)) {
    return { valid: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` };
  }

  // Type-specific validation
  const numValue = typeof value === 'bigint' ? Number(value) : value;

  switch (type) {
    case 'bool':
      if (numValue !== 0 && numValue !== 1) {
        return { valid: false, error: 'Bool value must be 0 or 1' };
      }
      break;
    case 'uint8':
      if (numValue > 255) {
        return { valid: false, error: 'Value exceeds uint8 maximum (255)' };
      }
      break;
    case 'uint16':
      if (numValue > 65535) {
        return { valid: false, error: 'Value exceeds uint16 maximum (65535)' };
      }
      break;
    case 'uint32':
      if (numValue > 4294967295) {
        return { valid: false, error: 'Value exceeds uint32 maximum (4294967295)' };
      }
      break;
  }

  return { valid: true };
}

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): {
  valid: boolean;
  error?: string;
} {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(network: string): {
  valid: boolean;
  error?: string;
} {
  const supportedNetworks = ['sepolia', 'mainnet', 'localhost'];

  if (!supportedNetworks.includes(network.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported network. Must be one of: ${supportedNetworks.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Validate transaction parameters
 */
export interface TransactionParams {
  to: string;
  value?: string;
  data?: string;
}

export function validateTransactionParams(params: TransactionParams): {
  valid: boolean;
  error?: string;
} {
  // Validate recipient address
  const addressValidation = validateContractAddress(params.to);
  if (!addressValidation.valid) {
    return addressValidation;
  }

  // Validate value if present
  if (params.value) {
    try {
      const value = BigInt(params.value);
      if (value < 0) {
        return { valid: false, error: 'Transaction value cannot be negative' };
      }
    } catch {
      return { valid: false, error: 'Invalid transaction value' };
    }
  }

  return { valid: true };
}
