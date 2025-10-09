# Examples

Comprehensive examples demonstrating various use cases of the Universal FHEVM SDK.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Privacy Voting](#privacy-voting)
- [Sealed Auctions](#sealed-auctions)
- [Confidential Identity](#confidential-identity)
- [Private Payments](#private-payments)
- [Healthcare Data](#healthcare-data)

---

## Basic Examples

### Simple Encryption/Decryption

```typescript
import { FhevmSDK } from '@fhevm/sdk';

async function basicExample() {
  // Initialize
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });

  // Encrypt
  const value = 42;
  const encrypted = await fhevm.encryptUint8(value);
  console.log('Encrypted data:', encrypted.data);
  console.log('Proof:', encrypted.proof);

  // Decrypt (requires authorization)
  const decrypted = await fhevm.decryptUint8(encrypted.data);
  console.log('Decrypted value:', decrypted); // 42
}
```

### Contract Interaction

```typescript
import { FhevmSDK } from '@fhevm/sdk';

const contractABI = [
  'function store(bytes memory encryptedValue, bytes memory proof) external',
  'function retrieve() external view returns (bytes32)'
];

async function contractExample() {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });

  // Get contract
  const contract = fhevm.getContract('0xContractAddress', contractABI);

  // Encrypt and store
  const encrypted = await fhevm.encryptUint32(12345);
  const tx = await contract.store(encrypted.data, encrypted.proof);
  await tx.wait();

  console.log('Stored encrypted value');
}
```

---

## Privacy Voting

Complete voting system with encrypted scores.

### Smart Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8 } from "@fhevm/solidity/lib/FHE.sol";

contract PrivacyVoting {
    mapping(uint8 => mapping(address => euint8)) public votes;
    mapping(uint8 => bool) public hasVoted;

    function submitVote(uint8 projectId, uint8 score) external {
        require(score >= 1 && score <= 10, "Invalid score");
        require(!hasVoted[projectId], "Already voted");

        euint8 encryptedScore = FHE.asEuint8(score);
        votes[projectId][msg.sender] = encryptedScore;
        hasVoted[projectId] = true;

        FHE.allowThis(encryptedScore);
        FHE.allow(encryptedScore, msg.sender);
    }
}
```

### Frontend Implementation

```typescript
import { FhevmSDK } from '@fhevm/sdk';
import { ethers } from 'ethers';

const votingABI = [
  'function submitVote(uint8 projectId, uint8 score) external',
  'function hasVoted(uint8 projectId) external view returns (bool)'
];

async function submitPrivateVote(projectId: number, score: number) {
  // Initialize SDK
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });

  // Get contract
  const votingContract = fhevm.getContract(
    '0xVotingContractAddress',
    votingABI
  );

  // Check if already voted
  const signer = fhevm.getSigner();
  const address = await signer!.getAddress();
  const alreadyVoted = await votingContract.hasVoted(projectId);

  if (alreadyVoted) {
    throw new Error('Already voted for this project');
  }

  // Encrypt score (1-10)
  const encrypted = await fhevm.encryptUint8(score);

  // Submit vote
  const tx = await votingContract.submitVote(
    projectId,
    encrypted.data,
    encrypted.proof
  );

  const receipt = await tx.wait();
  console.log('Vote submitted:', receipt.hash);

  return receipt;
}

// Usage
submitPrivateVote(1, 7)
  .then(() => console.log('Success!'))
  .catch(console.error);
```

### React Component

```tsx
import { useState } from 'react';
import { useEncrypt, useContract } from '@fhevm/sdk';

function VotingInterface({ projectId }) {
  const [score, setScore] = useState(5);
  const { encrypt, isEncrypting } = useEncrypt();
  const contract = useContract(votingAddress, votingABI);

  const handleVote = async () => {
    try {
      // Encrypt score
      const encrypted = await encrypt.uint8(score);

      // Submit to contract
      const tx = await contract.submitVote(projectId, encrypted.data, encrypted.proof);
      await tx.wait();

      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Failed to submit vote');
    }
  };

  return (
    <div>
      <h2>Vote for Project {projectId}</h2>
      <input
        type="range"
        min="1"
        max="10"
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
      />
      <p>Score: {score}/10</p>
      <button onClick={handleVote} disabled={isEncrypting}>
        {isEncrypting ? 'Submitting...' : 'Submit Vote'}
      </button>
    </div>
  );
}
```

---

## Sealed Auctions

Private bidding system where bids remain confidential.

### Smart Contract

```solidity
contract SealedAuction {
    mapping(uint256 => mapping(address => euint32)) public bids;
    mapping(uint256 => bool) public auctionEnded;

    function placeBid(uint256 auctionId, uint32 bidAmount) external payable {
        require(!auctionEnded[auctionId], "Auction ended");
        require(msg.value > 0, "Must send ETH");

        euint32 encryptedBid = FHE.asEuint32(bidAmount);
        bids[auctionId][msg.sender] = encryptedBid;

        FHE.allowThis(encryptedBid);
        FHE.allow(encryptedBid, msg.sender);
    }

    function endAuction(uint256 auctionId) external {
        auctionEnded[auctionId] = true;
        // Trigger decryption to find winner
    }
}
```

### Frontend Implementation

```typescript
async function placeSealedBid(auctionId: number, bidAmount: number) {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const auctionContract = fhevm.getContract(auctionAddress, auctionABI);

  // Encrypt bid amount
  const encrypted = await fhevm.encryptUint32(bidAmount);

  // Place bid with ETH deposit
  const tx = await auctionContract.placeBid(
    auctionId,
    encrypted.data,
    encrypted.proof,
    { value: ethers.parseEther('0.1') }
  );

  await tx.wait();
  console.log('Bid placed successfully');
}
```

---

## Confidential Identity

Age verification without revealing actual age.

### Smart Contract

```solidity
contract ConfidentialIdentity {
    mapping(address => euint8) public ages;

    function setAge(uint8 age) external {
        euint8 encryptedAge = FHE.asEuint8(age);
        ages[msg.sender] = encryptedAge;

        FHE.allowThis(encryptedAge);
        FHE.allow(encryptedAge, msg.sender);
    }

    function isOver18(address user) external view returns (bool) {
        euint8 age = ages[user];
        euint8 threshold = FHE.asEuint8(18);
        ebool isAdult = FHE.gte(age, threshold);
        return FHE.decrypt(isAdult);
    }
}
```

### Frontend Implementation

```typescript
async function setConfidentialAge(age: number) {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const identityContract = fhevm.getContract(identityAddress, identityABI);

  // Encrypt age
  const encrypted = await fhevm.encryptUint8(age);

  // Store on-chain
  const tx = await identityContract.setAge(encrypted.data, encrypted.proof);
  await tx.wait();

  console.log('Age stored confidentially');
}

async function verifyAge(userAddress: string) {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const identityContract = fhevm.getContract(identityAddress, identityABI);

  // Check if over 18 (without revealing actual age)
  const isAdult = await identityContract.isOver18(userAddress);
  console.log('User is adult:', isAdult);

  return isAdult;
}
```

---

## Private Payments

Confidential transaction amounts.

### Smart Contract

```solidity
contract PrivatePayments {
    mapping(address => euint32) public balances;

    function deposit(uint32 amount) external payable {
        euint32 encryptedAmount = FHE.asEuint32(amount);
        balances[msg.sender] = FHE.add(balances[msg.sender], encryptedAmount);

        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
    }

    function transfer(address to, uint32 amount) external {
        euint32 encryptedAmount = FHE.asEuint32(amount);

        // Subtract from sender
        balances[msg.sender] = FHE.sub(balances[msg.sender], encryptedAmount);

        // Add to recipient
        balances[to] = FHE.add(balances[to], encryptedAmount);

        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);
    }
}
```

### Frontend Implementation

```typescript
async function privateTransfer(recipient: string, amount: number) {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const paymentContract = fhevm.getContract(paymentAddress, paymentABI);

  // Encrypt amount
  const encrypted = await fhevm.encryptUint32(amount);

  // Transfer
  const tx = await paymentContract.transfer(
    recipient,
    encrypted.data,
    encrypted.proof
  );

  await tx.wait();
  console.log('Private transfer complete');
}

async function getBalance() {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const paymentContract = fhevm.getContract(paymentAddress, paymentABI);
  const signer = fhevm.getSigner();
  const address = await signer!.getAddress();

  // Get encrypted balance
  const encryptedBalance = await paymentContract.balances(address);

  // Decrypt (requires authorization)
  const balance = await fhevm.decryptUint32(encryptedBalance);
  console.log('Balance:', balance);

  return balance;
}
```

---

## Healthcare Data

Private medical records with selective disclosure.

### Smart Contract

```solidity
contract HealthRecords {
    struct Record {
        euint8 bloodPressure;
        euint8 heartRate;
        euint16 bloodSugar;
    }

    mapping(address => Record) public records;
    mapping(address => mapping(address => bool)) public authorizedDoctors;

    function storeRecord(
        uint8 bloodPressure,
        uint8 heartRate,
        uint16 bloodSugar
    ) external {
        records[msg.sender] = Record({
            bloodPressure: FHE.asEuint8(bloodPressure),
            heartRate: FHE.asEuint8(heartRate),
            bloodSugar: FHE.asEuint16(bloodSugar)
        });

        FHE.allowThis(records[msg.sender].bloodPressure);
        FHE.allow(records[msg.sender].bloodPressure, msg.sender);
    }

    function authorizeDoctor(address doctor) external {
        authorizedDoctors[msg.sender][doctor] = true;
    }
}
```

### Frontend Implementation

```typescript
async function storeHealthData(data: {
  bloodPressure: number;
  heartRate: number;
  bloodSugar: number;
}) {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const healthContract = fhevm.getContract(healthAddress, healthABI);

  // Encrypt all values
  const encBP = await fhevm.encryptUint8(data.bloodPressure);
  const encHR = await fhevm.encryptUint8(data.heartRate);
  const encBS = await fhevm.encryptUint16(data.bloodSugar);

  // Store on-chain
  const tx = await healthContract.storeRecord(
    encBP.data,
    encBP.proof,
    encHR.data,
    encHR.proof,
    encBS.data,
    encBS.proof
  );

  await tx.wait();
  console.log('Health data stored privately');
}

async function authorizeDoctorAccess(doctorAddress: string) {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' });
  const healthContract = fhevm.getContract(healthAddress, healthABI);

  const tx = await healthContract.authorizeDoctor(doctorAddress);
  await tx.wait();

  console.log('Doctor authorized');
}
```

---

## Next.js Full Example

Complete Next.js application with authentication and voting.

```typescript
// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFhevm, useEncrypt, useContract } from '@fhevm/sdk';
import { InitState } from '@fhevm/sdk';

export default function VotingApp() {
  const { fhevm, initState } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();
  const contract = useContract(contractAddress, contractABI);

  const [projects, setProjects] = useState([]);
  const [selectedScore, setSelectedScore] = useState(5);

  useEffect(() => {
    if (initState === InitState.INITIALIZED) {
      loadProjects();
    }
  }, [initState]);

  const loadProjects = async () => {
    const projectIds = await contract.getCurrentRoundProjectIds();
    const projectData = await Promise.all(
      projectIds.map(id => contract.getProjectInfo(id))
    );
    setProjects(projectData);
  };

  const handleVote = async (projectId: number) => {
    try {
      const encrypted = await encrypt.uint8(selectedScore);
      const tx = await contract.submitVote(
        projectId,
        encrypted.data,
        encrypted.proof
      );
      await tx.wait();
      alert('Vote submitted!');
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Failed to vote');
    }
  };

  if (initState !== InitState.INITIALIZED) {
    return <div>Loading SDK...</div>;
  }

  return (
    <div className="container">
      <h1>Cultural Project Voting</h1>

      <div className="score-selector">
        <label>Select Score (1-10):</label>
        <input
          type="range"
          min="1"
          max="10"
          value={selectedScore}
          onChange={(e) => setSelectedScore(Number(e.target.value))}
        />
        <span>{selectedScore}/10</span>
      </div>

      <div className="projects">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p>Category: {project.category}</p>
            <button
              onClick={() => handleVote(index + 1)}
              disabled={isEncrypting}
            >
              {isEncrypting ? 'Voting...' : 'Vote'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

For more examples, check the `/examples` directory in the repository.
