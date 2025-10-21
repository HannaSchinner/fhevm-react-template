# FHEVM SDK Examples

This document provides a comprehensive overview of all example applications included in this repository. Each example demonstrates different aspects and use cases of the Universal FHEVM SDK.

---

## 📂 Available Examples

### 1. Next.js Music Royalty Platform 🎵

**Path**: `examples/nextjs-music-royalty/`

**Description**: A complete, production-ready privacy-preserving music royalty distribution platform built with Next.js 14 and the FHEVM SDK. This is the **featured example** showcasing the full capabilities of the SDK in a real-world application.

**Key Features**:
- Privacy-preserving music royalty distribution with encrypted shares
- Complete smart contract integration using Hardhat
- Full-stack implementation with Next.js 14 App Router
- React hooks from FHEVM SDK (`useFhevmEncrypt`, `useFhevmDecrypt`, etc.)
- Encrypted on-chain calculations (FHE multiplication and division)
- User-authorized decryption with EIP-712 signatures
- Modern UI with Tailwind CSS

**Technology Stack**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Ethers.js v6
- Hardhat (for smart contracts)
- FHEVM SDK with React integration
- Solidity 0.8.24 with FHEVM library

**Use Case**: Rights holders can register tracks with encrypted royalty share percentages, create royalty pools, and distribute payments. Each rights holder can only decrypt their own payment amount, ensuring complete privacy.

**Quick Start**:
```bash
cd examples/nextjs-music-royalty
npm install
npm run dev
# Opens at http://localhost:3000
```

**Smart Contracts**:
- `contracts/PrivateMusicRoyalty.sol` - Main contract with FHE operations
- Deployment scripts in `scripts/`
- Hardhat configuration for multiple networks

**Documentation**:
- [README.md](./examples/nextjs-music-royalty/README.md) - Full documentation
- [QUICKSTART.md](./examples/nextjs-music-royalty/QUICKSTART.md) - Quick start guide

---

### 2. React Basic Example ⚛️

**Path**: `examples/react-basic/`

**Description**: A lightweight React application demonstrating the core encryption and decryption capabilities of the FHEVM SDK. Built with Vite for fast development and hot module replacement.

**Key Features**:
- Simple, clean interface for encryption/decryption
- Demonstrates core SDK APIs without smart contract complexity
- React hooks usage (`useFhevmEncrypt`, `useFhevmDecrypt`)
- Wallet connection with MetaMask
- Input validation and error handling
- Support for all encrypted types (uint8, uint16, uint32, uint64, etc.)
- Educational focus - perfect for learning

**Technology Stack**:
- React 18
- TypeScript
- Vite (build tool)
- Ethers.js v6
- FHEVM SDK with React hooks

**Use Case**: Learn the basics of FHEVM encryption/decryption without the complexity of smart contracts. Perfect for developers new to FHE or wanting to understand the SDK's core functionality.

**Quick Start**:
```bash
cd examples/react-basic
npm install
npm run dev
# Opens at http://localhost:3000
```

**What You Can Do**:
1. Connect your Web3 wallet
2. Encrypt numeric values with different types
3. Get encryption handles and proofs
4. Decrypt encrypted handles (requires contract address)
5. See encryption/decryption in action

**Documentation**:
- [README.md](./examples/react-basic/README.md) - Complete guide

---

### 3. Node.js CLI Tool 🖥️

**Path**: `examples/nodejs-cli/`

**Description**: A command-line interface tool demonstrating framework-agnostic usage of the FHEVM SDK in a Node.js environment. Shows how to use the SDK for backend operations, automated workflows, and server-side encryption/decryption.

**Key Features**:
- Framework-agnostic SDK usage (no React)
- CLI commands for encryption, decryption, and contract interaction
- Backend/server-side integration patterns
- Automated workflow examples
- Colorful CLI output with ora and chalk
- Environment-based configuration
- Demonstrates core SDK without browser dependencies

**Technology Stack**:
- Node.js 18+
- TypeScript
- Commander.js (CLI framework)
- Ethers.js v6
- FHEVM SDK (core only, no React)
- Chalk (colored output)
- Ora (loading spinners)

**Use Case**: Use FHEVM in backend services, automated scripts, CI/CD pipelines, or any Node.js environment. Perfect for server-side encryption before contract calls or automated decryption workflows.

**Quick Start**:
```bash
cd examples/nodejs-cli
npm install
npm run dev
# Or run specific commands:
npm run encrypt
npm run decrypt
npm run contract
```

**CLI Commands**:
```bash
# Encrypt a value
fhevm-cli encrypt <value> --type uint32

# Decrypt a handle
fhevm-cli decrypt <handle> --contract <address>

# Interact with contract
fhevm-cli contract --address <addr> --function <name>
```

**Documentation**:
- [README.md](./examples/nodejs-cli/README.md) - Full CLI guide

---

## 🎯 Example Comparison

| Feature | Next.js Music Royalty | React Basic | Node.js CLI |
|---------|----------------------|-------------|-------------|
| **Framework** | Next.js 14 | React 18 + Vite | Node.js |
| **Complexity** | Advanced | Beginner | Intermediate |
| **Smart Contracts** | ✅ Included | ❌ Not included | ⚠️ Optional |
| **React Hooks** | ✅ Full usage | ✅ Basic usage | ❌ Not applicable |
| **Use Case** | Production app | Learning SDK | Backend/CLI |
| **UI** | Full featured | Simple demo | Terminal only |
| **Best For** | Real-world example | Getting started | Automation |
| **Setup Time** | 10 minutes | 5 minutes | 3 minutes |

---

## 🚀 Running All Examples

### Quick Start Commands

From the repository root:

```bash
# Install all dependencies
npm run install:all

# Build the SDK first
npm run build:sdk

# Run Next.js example
npm run dev:nextjs

# Run React example
npm run dev:react

# Run Node.js CLI
npm run dev:nodejs
```

### Individual Setup

Each example can be run independently:

```bash
# Next.js
cd examples/nextjs-music-royalty
npm install
npm run dev

# React
cd examples/react-basic
npm install
npm run dev

# Node.js
cd examples/nodejs-cli
npm install
npm run dev
```

---

## 📚 Learning Path

**Recommended order for learning**:

1. **Start with React Basic** (`react-basic/`)
   - Learn core encryption/decryption
   - Understand SDK hooks
   - Get familiar with FHEVM concepts

2. **Explore Node.js CLI** (`nodejs-cli/`)
   - See framework-agnostic usage
   - Learn backend integration
   - Understand core SDK without React

3. **Deep dive into Next.js** (`nextjs-music-royalty/`)
   - Full application architecture
   - Smart contract integration
   - Real-world use case implementation

---

## 🛠️ Development Scripts

### Build Commands

```bash
# Build all examples
npm run build:examples

# Build individual examples
npm run build --workspace=examples/nextjs-music-royalty
npm run build --workspace=examples/react-basic
npm run build --workspace=examples/nodejs-cli
```

### Test Commands

```bash
# Test all workspaces
npm run test:all

# Test individual examples
npm run test --workspace=examples/nextjs-music-royalty
```

### Contract Commands (Next.js example)

```bash
# Compile smart contracts
npm run compile:contracts

# Deploy contracts
cd examples/nextjs-music-royalty
npm run deploy
```

---

## 📖 Documentation Links

### Example Documentation
- [Next.js Music Royalty README](./examples/nextjs-music-royalty/README.md)
- [Next.js Quick Start Guide](./examples/nextjs-music-royalty/QUICKSTART.md)
- [React Basic README](./examples/react-basic/README.md)
- [Node.js CLI README](./examples/nodejs-cli/README.md)

### SDK Documentation
- [FHEVM SDK API Reference](./packages/fhevm-sdk/README.md)
- [Main README](./README.md)

### Additional Resources
- [Submission Guide](./SUBMISSION.md)
- [Verification Checklist](./VERIFICATION.md)
- [Demo Video Instructions](./DEMO_VIDEO_INSTRUCTIONS.md)

---

## 🎨 Example Features

### Common Features (All Examples)

✅ TypeScript support
✅ FHEVM SDK integration
✅ Ethers.js v6 integration
✅ Comprehensive error handling
✅ Detailed documentation
✅ Environment configuration
✅ Development mode with hot reload

### Next.js Specific Features

✅ App Router architecture
✅ Smart contract deployment
✅ Hardhat integration
✅ Tailwind CSS styling
✅ Multiple components
✅ Full CRUD operations
✅ Event listening
✅ Transaction management

### React Basic Specific Features

✅ Vite build tool
✅ Minimal dependencies
✅ Clean UI
✅ Learning focused
✅ Quick setup
✅ Type validation

### Node.js CLI Specific Features

✅ Commander.js CLI
✅ Colored terminal output
✅ Loading spinners
✅ Environment variables
✅ Executable binary
✅ No browser dependencies

---

## 🔧 Customization

### Adding New Examples

To add a new example to the monorepo:

1. Create directory in `examples/`
2. Add `package.json` with workspace dependencies
3. Create `README.md` with documentation
4. Add development script to root `package.json`
5. Update this `EXAMPLES.md` file

Example package.json:
```json
{
  "name": "your-example",
  "dependencies": {
    "@fhevm/sdk": "workspace:*"
  }
}
```

### Modifying Examples

Each example is self-contained and can be modified independently:
- Edit source files in `src/` directory
- Update dependencies in `package.json`
- Modify configuration files as needed
- Changes won't affect other examples

---

## 🐛 Troubleshooting

### Common Issues

**Example won't start**:
- Make sure you've run `npm run install:all` from the root
- Build the SDK first: `npm run build:sdk`
- Check Node.js version: `node --version` (requires 18+)

**TypeScript errors**:
- Ensure SDK is built: `npm run build:sdk`
- Clean and reinstall: `npm run clean && npm run install:all`

**Smart contracts fail to compile**:
- Check Hardhat configuration
- Ensure Solidity version matches
- Install contract dependencies

**Wallet connection issues**:
- Install MetaMask or compatible wallet
- Check network configuration
- Ensure you're on correct network

---

## 📊 Example Statistics

| Example | Files | Lines of Code | Components | Contracts |
|---------|-------|---------------|------------|-----------|
| Next.js Music Royalty | 30+ | 2,000+ | 8+ | 1 |
| React Basic | 10+ | 500+ | 3+ | 0 |
| Node.js CLI | 5+ | 300+ | N/A | 0 |
| **Total** | **45+** | **2,800+** | **11+** | **1** |

---

## 🌟 Example Highlights

### Next.js Music Royalty
**Highlight**: First-ever privacy-preserving music royalty platform using FHE. Demonstrates real-world application of homomorphic encryption for financial privacy.

### React Basic
**Highlight**: Simplest possible implementation showing SDK can be used with minimal code. Perfect starting point for developers.

### Node.js CLI
**Highlight**: Proves SDK is truly framework-agnostic. Can be used in any JavaScript environment, not just browsers.

---

## 🎓 Educational Value

Each example is designed for different learning objectives:

**Next.js**: Learn how to build complete privacy-preserving applications
**React**: Understand core SDK APIs and React integration
**Node.js**: Master backend/CLI usage and automation

Together, they provide a comprehensive understanding of FHEVM SDK capabilities across all JavaScript environments.

---

## 🔗 Related Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)
- [FHEVM Solidity](https://github.com/zama-ai/fhevm)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)

---

**Last Updated**: 2025-10-28
**Total Examples**: 3
**Supported Frameworks**: React, Next.js, Node.js
**SDK Version**: 1.0.0
