import { Contract, BrowserProvider } from 'ethers';

/**
 * Contract interaction utilities for PrivateMusicRoyalty
 *
 * This module provides:
 * - Contract ABI definition
 * - Helper functions to get contract instances
 * - Type definitions for contract data
 */

// PrivateMusicRoyalty contract ABI
// Generated from the Solidity contract
export const PRIVATE_MUSIC_ROYALTY_ABI = [
  "function owner() view returns (address)",
  "function totalTracks() view returns (uint256)",
  "function totalRoyaltyPools() view returns (uint256)",
  "function registerRightsHolder() external",
  "function verifyRightsHolder(address holder) external",
  "function registerTrack(string metadataURI, address[] holders, uint32[] shares) external",
  "function createRoyaltyPool(uint256 trackId) external payable",
  "function distributeRoyalties(uint256 poolId) external",
  "function claimRoyalty(uint256 poolId) external",
  "function getTrackInfo(uint256 trackId) view returns (bool active, string metadataURI, uint256 createdAt, address[] holders, uint256 rightsHoldersCount)",
  "function getPoolInfo(uint256 poolId) view returns (uint256 trackId, bool distributed, uint256 createdAt, address[] payees)",
  "function isRightsHolder(uint256 trackId, address holder) view returns (bool)",
  "function getRightsHolderInfo(address holder) view returns (bool verified, uint256 registeredAt, uint256[] trackIds)",
  "function getClaimStatus(uint256 poolId, address holder) view returns (bool claimed)",
  "function getEncryptedShare(uint256 trackId, address holder) view returns (uint256)",
  "function getEncryptedPayment(uint256 poolId, address holder) view returns (uint256)",
  "function deactivateTrack(uint256 trackId) external",
  "function updateTrackMetadata(uint256 trackId, string newMetadataURI) external",
  "function getContractInfo() view returns (uint256 totalTracksCount, uint256 totalRoyaltyPoolsCount, address contractOwner)",
  "event TrackRegistered(uint256 indexed trackId, address indexed creator, string metadataURI)",
  "event RightsHolderAdded(uint256 indexed trackId, address indexed holder)",
  "event RoyaltyPoolCreated(uint256 indexed poolId, uint256 indexed trackId)",
  "event RoyaltyDistributed(uint256 indexed poolId, address indexed recipient)",
  "event RoyaltyClaimed(uint256 indexed poolId, address indexed claimant)",
  "event RightsHolderVerified(address indexed holder)",
] as const;

/**
 * Get contract address from environment
 */
export function getContractAddress(): string {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS not set in environment');
  }
  return address;
}

/**
 * Create a contract instance with signer
 *
 * @param provider - Ethereum provider (from wallet)
 * @returns Contract instance ready for write operations
 */
export async function getContractWithSigner(provider: BrowserProvider) {
  const signer = await provider.getSigner();
  const contractAddress = getContractAddress();
  return new Contract(contractAddress, PRIVATE_MUSIC_ROYALTY_ABI, signer);
}

/**
 * Create a read-only contract instance
 *
 * @param provider - Ethereum provider
 * @returns Contract instance for read operations
 */
export function getContractReadOnly(provider: BrowserProvider) {
  const contractAddress = getContractAddress();
  return new Contract(contractAddress, PRIVATE_MUSIC_ROYALTY_ABI, provider);
}

/**
 * Type definitions for contract data structures
 */

export interface TrackInfo {
  active: boolean;
  metadataURI: string;
  createdAt: bigint;
  holders: string[];
  rightsHoldersCount: bigint;
}

export interface PoolInfo {
  trackId: bigint;
  distributed: boolean;
  createdAt: bigint;
  payees: string[];
}

export interface RightsHolderInfo {
  verified: boolean;
  registeredAt: bigint;
  trackIds: bigint[];
}

export interface ContractInfo {
  totalTracksCount: bigint;
  totalRoyaltyPoolsCount: bigint;
  contractOwner: string;
}

/**
 * Helper function to format timestamp to readable date
 */
export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

/**
 * Helper function to format share percentage
 * Shares are stored as 0-10000 representing 0.00%-100.00%
 */
export function formatSharePercentage(share: number): string {
  return (share / 100).toFixed(2) + '%';
}

/**
 * Helper function to validate share splits
 * Total must equal 10000 (100%)
 */
export function validateShares(shares: number[]): boolean {
  const total = shares.reduce((sum, share) => sum + share, 0);
  return total === 10000;
}

/**
 * Helper function to convert percentage to share value
 * Example: 25.5% -> 2550
 */
export function percentageToShare(percentage: number): number {
  return Math.round(percentage * 100);
}
