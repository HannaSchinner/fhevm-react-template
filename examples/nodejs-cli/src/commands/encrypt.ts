/**
 * Encrypt Command
 *
 * Encrypts a value using FHEVM SDK (framework-agnostic core).
 * Demonstrates how to use the SDK without React.
 */

import chalk from 'chalk';
import ora from 'ora';
import { FhevmClient, type EncryptedUintType } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';
import { getConfig } from '../lib/config.js';

interface EncryptOptions {
  type: EncryptedUintType;
  network: string;
  rpc?: string;
}

export async function encryptCommand(
  value: string,
  options: EncryptOptions
) {
  const spinner = ora('Initializing FHEVM client...').start();

  try {
    // Parse value
    const numValue = BigInt(value);

    // Get configuration
    const config = getConfig();
    const rpcUrl = options.rpc || config.rpcUrl || 'https://devnet.zama.ai';
    const chainId = parseInt(options.network);

    // Create provider (framework-agnostic)
    const provider = new JsonRpcProvider(rpcUrl);

    spinner.text = 'Creating FHEVM instance...';

    // Initialize FHEVM client (no React needed!)
    const client = new FhevmClient({
      provider: provider as any,
      network: chainId,
    });

    await client.initialize();

    spinner.text = `Encrypting value ${value} as ${options.type}...`;

    // Encrypt the value
    const encrypted = await client.encrypt(numValue, options.type);

    spinner.succeed(chalk.green('✅ Encryption successful!'));

    // Display results
    console.log('');
    console.log(chalk.bold('Encryption Results:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.cyan('Original Value:'), value);
    console.log(chalk.cyan('Type:'), options.type);
    console.log(chalk.cyan('Network:'), chainId);
    console.log('');
    console.log(chalk.bold('Encrypted Data:'));
    console.log(chalk.gray(Buffer.from(encrypted.data).toString('hex').slice(0, 128) + '...'));
    console.log('');
    console.log(chalk.bold('Handles:'));
    encrypted.handles.forEach((handle, i) => {
      console.log(chalk.gray(`  [${i}]`), handle);
    });
    console.log('');
    console.log(chalk.bold('Input Proof:'));
    console.log(chalk.gray(encrypted.proof.slice(0, 128) + '...'));
    console.log('');
    console.log(chalk.yellow('💡 Tip: Use this encrypted data when calling smart contract functions'));
    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('❌ Encryption failed'));
    console.error('');
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    console.error('');
    process.exit(1);
  }
}
