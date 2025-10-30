import { createFhevmClient } from '@fhevm/sdk';
import { JsonRpcProvider } from 'ethers';

export async function decryptCommand(encrypted: string) {
  try {
    console.log('Initializing FHEVM client...');

    const provider = new JsonRpcProvider(process.env.RPC_URL || 'https://rpc.sepolia.eth');

    const client = await createFhevmClient({
      provider,
      network: 'sepolia',
    });

    console.log('Decrypting value...');

    const decrypted = await client.decrypt(encrypted);

    console.log('Decrypted value:', decrypted);
    console.log('\nSuccess!');
  } catch (error) {
    console.error('Decryption failed:', error);
    process.exit(1);
  }
}
