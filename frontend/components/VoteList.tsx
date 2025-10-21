'use client';

import { VoteCard } from './VoteCard';
import { AddVoteCard } from './AddVoteCard';
import type { DeployedVotingInfo } from '../lib/votingService';
import { ethers } from 'ethers';

interface VoteListProps {
  votes: DeployedVotingInfo[];
  isLoading: boolean;
  isConnected: boolean;
  onAddVoteClick: () => void;
}

export function VoteList({ votes, isLoading, isConnected, onAddVoteClick }: VoteListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-48 rounded-lg bg-slate-800/50 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isConnected && <AddVoteCard onClick={onAddVoteClick} />}
      
      {votes
        .filter(vote => vote && vote.address && vote.address !== ethers.ZeroAddress)
        .map((vote) => (
          <VoteCard key={vote.address} vote={vote} />
      ))}
    </div>
  );
}