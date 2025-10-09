/**
 * Decrypt Command
 *
 * Decrypts an encrypted value from a smart contract.
 * Requires EIP-712 signature for user authorization.
 */

import chalk from 'chalk';
import ora from 'ora';
import { FhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet } from 'ethers';
import { getConfig } from '../lib/config.js';

interface DecryptOptions {
  contract?: string;
  network: string;
  rpc?: string;
  key: string;
}

export async function decryptCommand(
  handle: string,
  options: DecryptOptions
) {
  const spinner = ora('Initializing FHEVM client...').start();

  try {
    // Validate inputs
    if (!options.contract) {
      throw new Error('Contract address is required (use --contract)');
    }

    // Get configuration
    const config = getConfig();
    const rpcUrl = options.rpc || config.rpcUrl || 'https://devnet.zama.ai';
    const chainId = parseInt(options.network);
    const privateKey = options.key || config.privateKey;

    if (!privateKey) {
      throw new Error('Private key is required (use --key or set PRIVATE_KEY env var)');
    }

    // Create provider and wallet
    const provider = new JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);

    spinner.text = 'Creating FHEVM instance...';

    // Initialize FHEVM client
    const client = new FhevmClient({
      provider: provider as any,
      network: chainId,
      gatewayUrl: chainId === 8009 ? 'https://gateway.zama.ai' : undefined,
    });

    await client.initialize();

    spinner.text = 'Requesting decryption (signing with EIP-712)...';

    // Decrypt the value (requires user signature)
    const decryptedValue = await client.decrypt({
      contractAddress: options.contract,
      handle,
      signer: wallet,
    });

    spinner.succeed(chalk.green('✅ Decryption successful!'));

    // Display results
    console.log('');
    console.log(chalk.bold('Decryption Results:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.cyan('Contract:'), options.contract);
    console.log(chalk.cyan('Handle:'), handle);
    console.log(chalk.cyan('Network:'), chainId);
    console.log('');
    console.log(chalk.bold.green('Decrypted Value:'));
    console.log(chalk.green('  ' + decryptedValue.toString()));
    console.log('');
    console.log(chalk.yellow('💡 This value was decrypted using your EIP-712 signature'));
    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('❌ Decryption failed'));
    console.error('');
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    console.error('');
    console.error(chalk.yellow('Common issues:'));
    console.error(chalk.gray('  - Invalid contract address'));
    console.error(chalk.gray('  - Handle does not exist'));
    console.error(chalk.gray('  - No permission to decrypt (ACL not granted)'));
    console.error(chalk.gray('  - Gateway URL not configured correctly'));
    console.error('');
    process.exit(1);
  }
}
