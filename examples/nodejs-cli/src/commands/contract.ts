/**
 * Contract Command
 *
 * Interact with FHEVM smart contracts.
 * Supports both read and write operations.
 */

import chalk from 'chalk';
import ora from 'ora';
import { FhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import { getConfig } from '../lib/config.js';
import { readFileSync } from 'fs';

interface ContractOptions {
  args?: string[];
  network: string;
  rpc?: string;
  key?: string;
  read?: boolean;
  abi?: string;
}

export async function contractCommand(
  address: string,
  method: string,
  options: ContractOptions
) {
  const spinner = ora('Initializing...').start();

  try {
    // Validate inputs
    if (!options.abi) {
      throw new Error('ABI file path is required (use --abi)');
    }

    // Load ABI
    const abiJson = JSON.parse(readFileSync(options.abi, 'utf-8'));
    const abi = Array.isArray(abiJson) ? abiJson : abiJson.abi;

    // Get configuration
    const config = getConfig();
    const rpcUrl = options.rpc || config.rpcUrl || 'https://devnet.zama.ai';
    const chainId = parseInt(options.network);

    // Create provider
    const provider = new JsonRpcProvider(rpcUrl);

    let contract: Contract;
    let client: FhevmClient | null = null;

    if (options.read) {
      // Read-only call
      contract = new Contract(address, abi, provider);
      spinner.text = `Calling ${method} (read-only)...`;
    } else {
      // Write operation - requires private key
      const privateKey = options.key || config.privateKey;
      if (!privateKey) {
        throw new Error('Private key required for write operations (use --key or set PRIVATE_KEY)');
      }

      const wallet = new Wallet(privateKey, provider);
      contract = new Contract(address, abi, wallet);

      // Initialize FHEVM client for potential encrypted inputs
      spinner.text = 'Creating FHEVM instance...';
      client = new FhevmClient({
        provider: provider as any,
        network: chainId,
      });
      await client.initialize();

      spinner.text = `Calling ${method}...`;
    }

    // Parse arguments
    const args = options.args || [];

    // Call contract method
    const result = await contract[method](...args);

    if (options.read) {
      spinner.succeed(chalk.green('✅ Call successful!'));
    } else {
      spinner.text = 'Waiting for transaction confirmation...';
      const receipt = await result.wait();
      spinner.succeed(chalk.green('✅ Transaction confirmed!'));

      console.log('');
      console.log(chalk.cyan('Transaction Hash:'), receipt.hash);
      console.log(chalk.cyan('Block Number:'), receipt.blockNumber);
      console.log(chalk.cyan('Gas Used:'), receipt.gasUsed.toString());
    }

    // Display results
    console.log('');
    console.log(chalk.bold('Result:'));
    console.log(chalk.gray('─'.repeat(60)));

    if (typeof result === 'object' && result !== null) {
      if (result.hash) {
        console.log(chalk.cyan('Transaction Hash:'), result.hash);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } else {
      console.log(chalk.green(result.toString()));
    }

    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('❌ Contract call failed'));
    console.error('');
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    console.error('');
    console.error(chalk.yellow('Common issues:'));
    console.error(chalk.gray('  - Invalid contract address'));
    console.error(chalk.gray('  - Method does not exist in ABI'));
    console.error(chalk.gray('  - Wrong number or type of arguments'));
    console.error(chalk.gray('  - Insufficient gas or funds'));
    console.error(chalk.gray('  - Contract reverted'));
    console.error('');
    process.exit(1);
  }
}
