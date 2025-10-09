import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

/**
 * Deployment script for PrivateMusicRoyalty contract
 *
 * This script:
 * 1. Deploys the PrivateMusicRoyalty contract
 * 2. Saves deployment information to a JSON file
 * 3. Outputs contract address and deployment details
 */
async function main() {
  console.log("Starting PrivateMusicRoyalty contract deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("Deploying PrivateMusicRoyalty contract...");
  const PrivateMusicRoyalty = await ethers.getContractFactory("PrivateMusicRoyalty");
  const contract = await PrivateMusicRoyalty.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✓ PrivateMusicRoyalty deployed to:", contractAddress);

  // Get deployment transaction details
  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    console.log("  Transaction hash:", deploymentTx.hash);
    console.log("  Block number:", deploymentTx.blockNumber);
  }

  // Verify contract is working by calling a view function
  console.log("\nVerifying contract deployment...");
  const contractInfo = await contract.getContractInfo();
  console.log("  Total tracks:", contractInfo.totalTracksCount.toString());
  console.log("  Total pools:", contractInfo.totalRoyaltyPoolsCount.toString());
  console.log("  Contract owner:", contractInfo.contractOwner);

  // Save deployment information
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    contractAddress: contractAddress,
    deployer: deployer.address,
    blockNumber: deploymentTx?.blockNumber || 0,
    transactionHash: deploymentTx?.hash || "",
    timestamp: new Date().toISOString(),
    contractName: "PrivateMusicRoyalty",
  };

  // Save to file
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentDir,
    `PrivateMusicRoyalty-${deploymentInfo.chainId}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✓ Deployment information saved to:", deploymentFile);
  console.log("\nDeployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  console.log("2. Run the Next.js application: npm run dev");
  console.log("3. Connect your wallet and start using the application\n");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
