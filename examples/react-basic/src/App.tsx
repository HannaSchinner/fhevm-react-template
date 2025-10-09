import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmProvider } from '@fhevm/sdk';
import WalletConnect from './components/WalletConnect';
import EncryptionDemo from './components/EncryptionDemo';

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [network, setNetwork] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      handleWalletConnect();
    }
  }, []);

  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const networkInfo = await browserProvider.getNetwork();

      setProvider(browserProvider);
      setNetwork(Number(networkInfo.chainId));
      setAccount(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = () => {
    setProvider(null);
    setNetwork(null);
    setAccount(null);
  };

  return (
    <div>
      <header>
        <h1>FHEVM SDK React Example</h1>
        <p>Demonstrating encryption and decryption with Fully Homomorphic Encryption</p>
      </header>

      <WalletConnect
        account={account}
        network={network}
        onConnect={handleWalletConnect}
        onDisconnect={handleDisconnect}
      />

      {provider && network ? (
        <FhevmProvider config={{ provider, network }}>
          <EncryptionDemo account={account!} />
        </FhevmProvider>
      ) : (
        <div className="info">
          <strong>Getting Started:</strong>
          <ol style={{ marginTop: '0.5em', paddingLeft: '1.5em' }}>
            <li>Connect your Web3 wallet (MetaMask recommended)</li>
            <li>Make sure you're on a supported network (Sepolia or Zama testnet)</li>
            <li>Try encrypting and decrypting values using FHEVM</li>
          </ol>
        </div>
      )}

      <footer style={{ marginTop: '3em', padding: '1em 0', borderTop: '1px solid #333' }}>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9em' }}>
          Built with FHEVM SDK - Framework-agnostic encryption for Web3
        </p>
      </footer>
    </div>
  );
}

export default App;
