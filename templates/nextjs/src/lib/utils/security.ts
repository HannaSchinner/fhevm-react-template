/**
 * Security Utilities
 *
 * Security-related helper functions
 */

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>\"']/g, '');
}

export function validateAddress(address: string): boolean {
  // Validate Ethereum address format
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateSignature(signature: string): boolean {
  // Validate signature format
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

export function hashData(data: string): string {
  // Simple hash function (use proper crypto in production)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
