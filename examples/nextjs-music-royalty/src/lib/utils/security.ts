/**
 * Security utilities for FHEVM applications
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize user input for encryption
 */
export function sanitizeNumericInput(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid numeric input');
  }

  if (num < 0) {
    throw new Error('Negative values not allowed');
  }

  return num;
}

/**
 * Validate value range for encryption type
 */
export function validateValueRange(value: number, type: string): boolean {
  const ranges: Record<string, [number, number]> = {
    'uint8': [0, 255],
    'uint16': [0, 65535],
    'uint32': [0, 4294967295],
    'uint64': [0, Number.MAX_SAFE_INTEGER]
  };

  const range = ranges[type];
  if (!range) return true; // Unknown type, skip validation

  return value >= range[0] && value <= range[1];
}

/**
 * Generate secure random nonce
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for server-side
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private window: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }

  check(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.window);

    if (this.requests.length >= this.limit) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  reset(): void {
    this.requests = [];
  }
}
