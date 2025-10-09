# Quick Start Guide

Get the Private Music Royalty example up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- MetaMask wallet extension
- Git (to clone if needed)

## Step 1: Install Dependencies

```bash
cd examples/nextjs-music-royalty
npm install
```

## Step 2: Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your contract address (after deployment).

## Step 3: Compile and Deploy Contract

### Option A: Local Development (Hardhat)

Terminal 1 - Start local node:
```bash
npm run node
```

Terminal 2 - Deploy contract:
```bash
npm run deploy:local
```

### Option B: Sepolia Testnet

Add your private key to `.env.local`:
```env
PRIVATE_KEY=your_private_key_here
```

Deploy:
```bash
npm run deploy:sepolia
```

**Copy the deployed contract address** and update `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

## Step 4: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Use the Application

### 5.1 Connect Wallet
- Click "Connect Wallet"
- Approve MetaMask connection
- Wait for FHEVM initialization

### 5.2 Register
- Go to "Register" tab
- Click "Register as Rights Holder"
- Confirm transaction

### 5.3 Get Verified
**For local testing**: You need to verify yourself using Hardhat console.

Open a new terminal:
```bash
npx hardhat console --network localhost
```

In the console:
```javascript
const Contract = await ethers.getContractFactory("PrivateMusicRoyalty");
const contract = await Contract.attach("YOUR_CONTRACT_ADDRESS");
await contract.verifyRightsHolder("YOUR_WALLET_ADDRESS");
```

### 5.4 Create a Track
- Go to "Create Track" tab
- Enter metadata URI: `https://example.com/track1.json`
- Add rights holders (use your address)
- Set percentages (must total 100%)
- Click "Register Track"

Example with 2 holders:
- Holder 1: `0xYourAddress` - 60.00%
- Holder 2: `0xAnotherAddress` - 40.00%

### 5.5 Create Royalty Pool
- Go to "Create Pool" tab
- Enter Track ID: `1`
- Enter Amount: `0.1` ETH
- Click "Create Royalty Pool"

### 5.6 Distribute Royalties
- Go to "Distribute" tab
- Enter Pool ID: `1`
- View pool information
- Click "Distribute Royalties"

### 5.7 Claim Payment
- Go to "Claim" tab
- Enter Pool ID: `1`
- (Optional) Click "Decrypt Payment Amount" to preview
- Click "Claim Royalty Payment"
- Receive ETH based on your encrypted share

### 5.8 View All Tracks
- Go to "All Tracks" tab
- See all registered tracks
- Expand for details

## Common Issues

### "Please install MetaMask"
- Install MetaMask browser extension
- Refresh the page

### "Failed to initialize FHEVM"
- Check you're on the correct network
- For local: Network ID should be 31337
- For Sepolia: Network ID should be 11155111

### "Contract address not set"
- Make sure you updated `.env.local` with deployed address
- Restart the dev server after changing environment variables

### "Not verified rights holder"
- You need to be verified before creating tracks
- Use Hardhat console to verify yourself (see step 5.3)
- Or contact contract owner for verification

### Transactions failing
- Ensure you have enough ETH for gas
- Check you're connected to the right network
- Verify contract address is correct

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the component code to understand FHEVM integration
- Customize the styling and add new features
- Deploy your own version to testnet

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure contract is deployed correctly
4. Review the README.md troubleshooting section

## Architecture Overview

```
User (Browser)
    ↓
Next.js App (React Components)
    ↓
FHEVM SDK (Encryption/Decryption)
    ↓
Ethers.js (Blockchain Interaction)
    ↓
PrivateMusicRoyalty Contract (Solidity)
    ↓
FHEVM Network (Encrypted Computation)
```

## Key Files to Explore

1. **FhevmProvider.tsx** - SDK initialization and context
2. **RegisterTrack.tsx** - Encrypted share registration
3. **ClaimRoyalty.tsx** - Decryption and claiming
4. **contract.ts** - Contract ABI and utilities
5. **PrivateMusicRoyalty.sol** - Smart contract

Happy coding with FHEVM!
