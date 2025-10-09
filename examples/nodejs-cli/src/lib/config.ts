/**
 * Configuration Management
 *
 * Loads configuration from environment variables and .env file
 */

import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

// Load .env file if it exists
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  dotenvConfig({ path: envPath });
}

export interface Config {
  privateKey?: string;
  rpcUrl?: string;
  networkId?: number;
  gatewayUrl?: string;
}

/**
 * Get configuration from environment variables
 */
export function getConfig(): Config {
  return {
    privateKey: process.env.PRIVATE_KEY,
    rpcUrl: process.env.RPC_URL,
    networkId: process.env.NETWORK_ID ? parseInt(process.env.NETWORK_ID) : undefined,
    gatewayUrl: process.env.GATEWAY_URL,
  };
}

/**
 * Validate required configuration
 */
export function validateConfig(required: (keyof Config)[]): void {
  const config = getConfig();
  const missing: string[] = [];

  for (const key of required) {
    if (!config[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(', ')}\n` +
      `Set these in .env file or as environment variables`
    );
  }
}
