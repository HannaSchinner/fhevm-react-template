#!/usr/bin/env node

/**
 * FHEVM CLI Tool
 *
 * Command-line interface demonstrating framework-agnostic FHEVM SDK usage.
 * This tool can be used for:
 * - Encrypting values for smart contracts
 * - Decrypting encrypted data
 * - Interacting with FHEVM contracts
 * - Automation and scripting
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { encryptCommand } from './commands/encrypt.js';
import { decryptCommand } from './commands/decrypt.js';
import { contractCommand } from './commands/contract.js';

const program = new Command();

program
  .name('fhevm-cli')
  .description('CLI tool for FHEVM (Fully Homomorphic Encryption) operations')
  .version('1.0.0');

// Encrypt command
program
  .command('encrypt')
  .description('Encrypt a value using FHEVM')
  .argument('<value>', 'Value to encrypt')
  .option('-t, --type <type>', 'Encryption type (uint8, uint16, uint32, uint64, uint128, uint256)', 'uint32')
  .option('-n, --network <chainId>', 'Network chain ID', '8009')
  .option('-r, --rpc <url>', 'RPC URL')
  .action(encryptCommand);

// Decrypt command
program
  .command('decrypt')
  .description('Decrypt an encrypted value')
  .argument('<handle>', 'Encrypted data handle')
  .option('-c, --contract <address>', 'Contract address (required)')
  .option('-n, --network <chainId>', 'Network chain ID', '8009')
  .option('-r, --rpc <url>', 'RPC URL')
  .requiredOption('-k, --key <privateKey>', 'Private key for signing')
  .action(decryptCommand);

// Contract command
program
  .command('contract')
  .description('Interact with an FHEVM contract')
  .argument('<address>', 'Contract address')
  .argument('<method>', 'Method name to call')
  .option('-a, --args <args...>', 'Method arguments (space-separated)')
  .option('-n, --network <chainId>', 'Network chain ID', '8009')
  .option('-r, --rpc <url>', 'RPC URL')
  .option('-k, --key <privateKey>', 'Private key for signing (required for write operations)')
  .option('--read', 'Read-only call (default: false)')
  .option('--abi <path>', 'Path to contract ABI JSON file (required)')
  .action(contractCommand);

// Help examples
program.on('--help', () => {
  console.log('');
  console.log(chalk.bold('Examples:'));
  console.log('');
  console.log('  ' + chalk.cyan('$ fhevm-cli encrypt 42 --type uint32'));
  console.log('  ' + chalk.gray('  Encrypt the value 42 as uint32'));
  console.log('');
  console.log('  ' + chalk.cyan('$ fhevm-cli decrypt <handle> --contract 0x... --key <privateKey>'));
  console.log('  ' + chalk.gray('  Decrypt encrypted data from a contract'));
  console.log('');
  console.log('  ' + chalk.cyan('$ fhevm-cli contract 0x... getBalance --args 0x... --abi ./abi.json --read'));
  console.log('  ' + chalk.gray('  Call getBalance method on contract'));
  console.log('');
  console.log(chalk.bold('Environment Variables:'));
  console.log('');
  console.log('  ' + chalk.yellow('PRIVATE_KEY') + '     - Default private key for signing');
  console.log('  ' + chalk.yellow('RPC_URL') + '        - Default RPC URL');
  console.log('  ' + chalk.yellow('NETWORK_ID') + '     - Default network chain ID');
  console.log('');
});

program.parse();
