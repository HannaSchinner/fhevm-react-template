# Private Music Royalty Platform - FHEVM Example

A complete Next.js application demonstrating FHEVM SDK integration for confidential music royalty distribution using Fully Homomorphic Encryption.

## Overview

This example showcases how to build a privacy-preserving music royalty platform where:
- Royalty share percentages are encrypted on-chain
- Distribution calculations are performed on encrypted data
- Only rights holders can decrypt their payment amounts
- All royalty information remains confidential

## Features

### FHEVM SDK Integration
- **Client-side Encryption**: Uses `@fhevm/sdk` for encrypting sensitive data
- **Secure Decryption**: Rights holders decrypt their own payment amounts
- **Access Control**: FHE permissions ensure only authorized parties can decrypt
- **Private Computation**: Distribution calculations on encrypted values

### Application Features
1. **Rights Holder Registration**: Register and verify music rights holders
2. **Track Registration**: Create tracks with encrypted royalty splits
3. **Royalty Pools**: Fund pools with ETH for distribution
4. **Private Distribution**: Calculate payments on encrypted shares
5. **Secure Claims**: Decrypt and claim royalty payments
6. **Track Management**: View and manage all registered tracks

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Ethers.js v6**: Ethereum interaction
- **FHEVM SDK**: Fully Homomorphic Encryption
- **Hardhat**: Smart contract compilation and deployment

## Project Structure

```
nextjs-music-royalty/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with FHEVM provider
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── FhevmProvider.tsx   # FHEVM SDK context provider
│   │   ├── ConnectWallet.tsx   # Wallet connection
│   │   ├── RegisterRightsHolder.tsx
│   │   ├── RegisterTrack.tsx   # Track creation with encrypted shares
│   │   ├── CreateRoyaltyPool.tsx
│   │   ├── DistributeRoyalties.tsx
│   │   ├── ClaimRoyalty.tsx    # Claim with decryption
│   │   └── TracksList.tsx
│   └── lib/
│       └── contract.ts         # Contract utilities and ABI
├── scripts/
│   └── deploy.ts               # Deployment script
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── hardhat.config.ts
└── package.json
```

## Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Access to Zama Sepolia testnet (or local FHEVM network)
- Test ETH for transactions

## Installation

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **Install required packages**:
```bash
npm install next@latest react react-dom
npm install @fhevm/sdk ethers@^6
npm install --save-dev typescript @types/node @types/react
npm install --save-dev tailwindcss postcss autoprefixer
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

3. **Configure environment**:
Create `.env.local` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # After deployment
NEXT_PUBLIC_CHAIN_ID=11155111 # Sepolia testnet

# For deployment (keep private)
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

## Deployment

### 1. Compile Contract

```bash
npx hardhat compile
```

### 2. Deploy Contract

**Local Network**:
```bash
npx hardhat node # In separate terminal
npx hardhat run scripts/deploy.ts --network hardhat
```

**Sepolia Testnet**:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### 3. Update Environment

After deployment, update `.env.local` with the contract address:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Usage Guide

### 1. Connect Wallet

- Click "Connect Wallet" button
- Approve MetaMask connection
- Wait for FHEVM SDK initialization
- Ensure you're on the correct network

### 2. Register as Rights Holder

- Navigate to "Register" tab
- Click "Register as Rights Holder"
- Wait for transaction confirmation
- Contact contract owner for verification

### 3. Create Track with Encrypted Shares

- Go to "Create Track" tab
- Enter metadata URI (IPFS or HTTP URL)
- Add rights holders and their percentages
- Ensure total equals 100%
- Click "Register Track"
- Shares are encrypted on-chain automatically

### 4. Create Royalty Pool

- Navigate to "Create Pool" tab
- Enter track ID
- Specify ETH amount for distribution
- Click "Create Royalty Pool"
- Amount is encrypted on-chain

### 5. Distribute Royalties

- Go to "Distribute" tab
- Enter pool ID
- Review pool information
- Click "Distribute Royalties"
- Contract calculates encrypted payments

### 6. Claim Royalty

- Navigate to "Claim" tab
- Enter pool ID
- (Optional) Decrypt to preview amount
- Click "Claim Royalty Payment"
- Oracle decrypts and transfers ETH

### 7. View Tracks

- Go to "All Tracks" tab
- Browse registered tracks
- Expand for details
- See your tracks highlighted

## FHEVM SDK Usage Examples

### Initialize FHEVM

```typescript
import { createFhevmInstance } from '@fhevm/sdk';

const fhevmInstance = await createFhevmInstance({
  chainId: 11155111,
  provider: browserProvider,
});
```

### Encrypt Data

```typescript
// Encryption happens on-chain in the contract
const encryptedShare = FHE.asEuint32(shareValue);
FHE.allowThis(encryptedShare);
FHE.allow(encryptedShare, holderAddress);
```

### Decrypt Data

```typescript
// Client-side decryption (for viewing)
const decrypted = await fhevmInstance.decrypt(
  encryptedValue,
  userAddress
);
```

### Request Decryption (On-chain)

```typescript
// Contract requests oracle decryption
bytes32[] memory cts = new bytes32[](1);
cts[0] = FHE.toBytes32(encryptedPayment);
FHE.requestDecryption(cts, this.processClaimPayment.selector);
```

## Smart Contract Integration

### Contract Functions

**Registration**:
- `registerRightsHolder()`: Register as rights holder
- `verifyRightsHolder(address)`: Verify holder (owner only)

**Track Management**:
- `registerTrack(metadataURI, holders[], shares[])`: Create track with encrypted shares
- `getTrackInfo(trackId)`: Get track information
- `deactivateTrack(trackId)`: Deactivate track

**Royalty Distribution**:
- `createRoyaltyPool(trackId)`: Create pool with ETH
- `distributeRoyalties(poolId)`: Calculate encrypted payments
- `claimRoyalty(poolId)`: Claim payment (triggers decryption)
- `getEncryptedPayment(poolId, holder)`: Get encrypted amount

### Events

- `TrackRegistered(trackId, creator, metadataURI)`
- `RoyaltyPoolCreated(poolId, trackId)`
- `RoyaltyDistributed(poolId, recipient)`
- `RoyaltyClaimed(poolId, claimant)`
- `RightsHolderVerified(holder)`

## Security Considerations

### FHEVM Security
- Encrypted shares prevent public visibility of royalty splits
- Access control ensures only holders can decrypt their shares
- FHE operations maintain confidentiality during computation
- Oracle-based decryption for secure claim processing

### Application Security
- Private keys never exposed in client code
- Environment variables for sensitive configuration
- Transaction validation before submission
- Error handling for failed operations

### Best Practices
- Always verify contract addresses
- Test on testnet before mainnet
- Use secure RPC endpoints
- Keep private keys safe
- Validate all user inputs

## Development Tips

### Testing FHEVM Features

1. **Local Testing**: Use Hardhat network with FHEVM emulation
2. **Testnet Testing**: Deploy to Zama Sepolia for full FHE features
3. **Mock Decryption**: Test UI without waiting for oracle callbacks

### Debugging

- Check browser console for SDK initialization
- Monitor transaction events in block explorer
- Use Hardhat console for contract debugging
- Verify FHE permissions are set correctly

### Common Issues

**FHEVM Not Initializing**:
- Ensure correct chain ID in configuration
- Check network connectivity
- Verify WASM support in browser

**Transaction Failures**:
- Verify sufficient gas and ETH balance
- Check contract address is correct
- Ensure wallet is connected to right network

**Decryption Errors**:
- Confirm FHE permissions are granted
- Verify user is authorized rights holder
- Check oracle is running (on testnet)

## Customization

### Styling

Modify Tailwind configuration in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
    },
  },
}
```

### Adding Features

1. Create new component in `src/components/`
2. Add contract interaction in component
3. Update contract ABI in `src/lib/contract.ts`
4. Add tab in main page if needed

### Contract Modifications

1. Update Solidity contract
2. Recompile with Hardhat
3. Redeploy to network
4. Update ABI and address

## Resources

### FHEVM Documentation
- [FHEVM Overview](https://docs.zama.ai/fhevm)
- [FHEVM SDK Guide](https://docs.zama.ai/fhevm/sdk)
- [Solidity Library](https://docs.zama.ai/fhevm/solidity)

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/getting-started/react-essentials)

### Ethereum Development
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [Hardhat](https://hardhat.org/docs)
- [Solidity](https://docs.soliditylang.org/)

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check FHEVM documentation
- Review example code comments
- Open issue in repository
- Join Zama community Discord

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Acknowledgments

- Built with FHEVM by Zama
- Example for educational purposes
- Demonstrates privacy-preserving smart contracts
- Shows real-world FHEVM SDK integration
