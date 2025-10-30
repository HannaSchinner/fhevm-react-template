#!/usr/bin/env node

import { Command } from 'commander';
import { encryptCommand } from './commands/encrypt.js';
import { decryptCommand } from './commands/decrypt.js';

/**
 * FHEVM Node.js CLI
 *
 * Command-line tool for FHE operations
 */

const program = new Command();

program
  .name('fhevm-cli')
  .description('FHEVM CLI for encryption and decryption operations')
  .version('1.0.0');

program
  .command('encrypt')
  .description('Encrypt a value using FHE')
  .argument('<value>', 'Value to encrypt')
  .action(encryptCommand);

program
  .command('decrypt')
  .description('Decrypt an encrypted value')
  .argument('<encrypted>', 'Encrypted value to decrypt')
  .action(decryptCommand);

program.parse();
