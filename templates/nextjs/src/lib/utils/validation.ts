/**
 * Validation Utilities
 *
 * Input validation helper functions
 */

export function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function isPositiveInteger(value: any): boolean {
  const num = parseInt(value, 10);
  return Number.isInteger(num) && num > 0;
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function validateEncryptedData(data: string): {
  valid: boolean;
  error?: string;
} {
  if (!data || typeof data !== 'string') {
    return { valid: false, error: 'Data must be a non-empty string' };
  }

  if (!data.startsWith('0x')) {
    return { valid: false, error: 'Encrypted data must start with 0x' };
  }

  if (data.length < 10) {
    return { valid: false, error: 'Encrypted data too short' };
  }

  return { valid: true };
}

export function validateComputationInput(operation: string, operands: number[]): {
  valid: boolean;
  error?: string;
} {
  const validOperations = ['add', 'subtract', 'multiply', 'divide'];

  if (!validOperations.includes(operation)) {
    return { valid: false, error: 'Invalid operation' };
  }

  if (!Array.isArray(operands) || operands.length < 2) {
    return { valid: false, error: 'At least 2 operands required' };
  }

  if (!operands.every(isValidNumber)) {
    return { valid: false, error: 'All operands must be valid numbers' };
  }

  return { valid: true };
}
