'use client';

import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { getContractWithSigner, formatTimestamp } from '@/lib/contract';

/**
 * Tracks List Component
 *
 * Features:
 * - Display all registered tracks
 * - Show track metadata and rights holders
 * - View encrypted shares (only visible to holders)
 * - Refresh track list
 * - Navigate to related pools
 */
interface TracksListProps {
  provider: BrowserProvider | null;
  account: string | null;
}

interface Track {
  trackId: number;
  active: boolean;
  metadataURI: string;
  createdAt: bigint;
  holders: string[];
  rightsHoldersCount: number;
}

export default function TracksList({ provider, account }: TracksListProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);

  /**
   * Load tracks on mount and when provider changes
   */
  useEffect(() => {
    if (provider) {
      loadTracks();
    }
  }, [provider]);

  /**
   * Load all tracks from the contract
   */
  async function loadTracks() {
    if (!provider) return;

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContractWithSigner(provider);

      // Get total tracks count
      const contractInfo = await contract.getContractInfo();
      const total = Number(contractInfo.totalTracksCount);
      setTotalTracks(total);

      if (total === 0) {
        setTracks([]);
        setIsLoading(false);
        return;
      }

      // Load each track
      const loadedTracks: Track[] = [];
      for (let i = 1; i <= total; i++) {
        try {
          const trackInfo = await contract.getTrackInfo(i);
          loadedTracks.push({
            trackId: i,
            active: trackInfo.active,
            metadataURI: trackInfo.metadataURI,
            createdAt: trackInfo.createdAt,
            holders: trackInfo.holders,
            rightsHoldersCount: Number(trackInfo.rightsHoldersCount),
          });
        } catch (err) {
          console.error(`Error loading track ${i}:`, err);
        }
      }

      setTracks(loadedTracks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tracks';
      console.error('Error loading tracks:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Toggle track details
   */
  function toggleTrackDetails(trackId: number) {
    setExpandedTrack(expandedTrack === trackId ? null : trackId);
  }

  /**
   * Format address for display
   */
  function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Check if current user is a rights holder for a track
   */
  function isUserRightsHolder(track: Track): boolean {
    if (!account) return false;
    return track.holders.some(h => h.toLowerCase() === account.toLowerCase());
  }

  if (!provider || !account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Registered Tracks</h2>
        <p className="text-gray-600">Please connect your wallet to view tracks</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Registered Tracks</h2>
        <button
          onClick={loadTracks}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {isLoading && tracks.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading tracks...</p>
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No tracks registered yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-3">
            Total tracks: <span className="font-semibold">{totalTracks}</span>
          </div>

          {tracks.map((track) => (
            <div
              key={track.trackId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
            >
              {/* Track Header */}
              <div
                className="p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleTrackDetails(track.trackId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-800">
                        Track #{track.trackId}
                      </span>
                      {isUserRightsHolder(track) && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Your Track
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        track.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {track.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {track.rightsHoldersCount} rights holder{track.rightsHoldersCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedTrack === track.trackId ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Track Details (Expanded) */}
              {expandedTrack === track.trackId && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Metadata URI:</span>
                    <p className="text-sm text-gray-600 break-all mt-1">
                      {track.metadataURI}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-700">Created:</span>
                    <p className="text-sm text-gray-600">{formatTimestamp(track.createdAt)}</p>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-700">Rights Holders:</span>
                    <ul className="mt-2 space-y-1">
                      {track.holders.map((holder, index) => (
                        <li
                          key={index}
                          className="text-sm font-mono text-gray-600 flex items-center gap-2"
                        >
                          <span>{formatAddress(holder)}</span>
                          {holder.toLowerCase() === account.toLowerCase() && (
                            <span className="text-xs text-green-600 font-semibold">(You)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isUserRightsHolder(track) && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-blue-800">
                        Your royalty share for this track is encrypted on-chain.
                        You can view it when royalties are distributed.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
