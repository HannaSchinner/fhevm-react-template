/**
 * Key management utilities for FHEVM
 */

/**
 * Validate public key format
 */
export function isValidPublicKey(key: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }

  // Public keys should be hex strings
  // Add more validation as needed based on FHEVM specs
  return key.length > 0;
}

/**
 * Format public key for display
 */
export function formatPublicKey(key: string, length: number = 20): string {
  if (!key || key.length <= length) {
    return key;
  }

  const start = key.substring(0, length / 2);
  const end = key.substring(key.length - length / 2);
  return `${start}...${end}`;
}

/**
 * Store public key in local storage (optional caching)
 */
export function cachePublicKey(network: string, key: string): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheKey = `fhevm_pubkey_${network}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      key,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache public key:', error);
  }
}

/**
 * Retrieve cached public key
 */
export function getCachedPublicKey(network: string, maxAge: number = 3600000): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cacheKey = `fhevm_pubkey_${network}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const { key, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > maxAge) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return key;
  } catch (error) {
    console.warn('Failed to retrieve cached public key:', error);
    return null;
  }
}

/**
 * Clear all cached keys
 */
export function clearKeyCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('fhevm_pubkey_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear key cache:', error);
  }
}
