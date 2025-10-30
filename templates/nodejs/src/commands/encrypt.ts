import { createFhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

export async function encryptCommand(value: string) {
  try {
    console.log('Initializing FHEVM client...');

    const provider = new JsonRpcProvider(process.env.RPC_URL || 'https://rpc.sepolia.eth');

    const client = await createFhevmClient({
      provider,
      network: 'sepolia',
    });

    console.log('Encrypting value:', value);

    const encrypted = await client.encrypt(parseInt(value));

    console.log('Encrypted value:', encrypted);
    console.log('\nSuccess!');
  } catch (error) {
    console.error('Encryption failed:', error);
    process.exit(1);
  }
}
