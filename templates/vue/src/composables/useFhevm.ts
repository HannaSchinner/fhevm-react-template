import { ref } from 'vue';
import { createFhevmClient, FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

const client = ref<FhevmClient | null>(null);
const isInitialized = ref(false);
const provider = ref<BrowserProvider | null>(null);

export function useFhevm() {
  async function initClient() {
    if (typeof window !== 'undefined' && window.ethereum) {
      provider.value = new BrowserProvider(window.ethereum);

      client.value = await createFhevmClient({
        provider: window.ethereum,
        network: 'sepolia',
      });

      isInitialized.value = true;
    }
  }

  return {
    client,
    isInitialized,
    provider,
    initClient,
  };
}
