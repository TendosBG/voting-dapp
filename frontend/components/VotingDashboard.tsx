'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { fetchVotings } from '../lib/votingService';
import { VoteList } from './VoteList';
import { CreateVoteModal } from './CreateVoteModal';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ethers } from 'ethers';
import { factoryAddress, factoryABI } from '../contract-config';
import type { DeployedVotingInfo } from '../lib/votingService';

export function VotingDashboard() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  
  const [deployedVotings, setDeployedVotings] = useState<DeployedVotingInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingVote, setIsCreatingVote] = useState(false);
  const initialLoadGuard = useRef(false);

  const loadVotings = useCallback(async (currentPage: number, isInitialLoad = false) => {
    if (isInitialLoad && currentPage === 1) {
      toast.loading('Chargement des votes...', { id: 'loading-votes' });
    }
    if (currentPage > 1) setIsLoadingMore(true); else setIsLoading(true);

    try {
      const { votes: newVotes, totalVotes } = await fetchVotings({ page: currentPage });
      
      setDeployedVotings(prevVotes => currentPage === 1 ? newVotes : [...prevVotes, ...newVotes]);
      setHasMore( (currentPage === 1 ? newVotes.length : deployedVotings.length + newVotes.length) < totalVotes);
      
      if (isInitialLoad) toast.success('Votes chargés !', { id: 'loading-votes' });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      if (isInitialLoad) toast.error(message, { id: 'loading-votes' }); else toast.error(message);
    } finally {
      if (currentPage > 1) setIsLoadingMore(false); else setIsLoading(false);
    }
  }, [deployedVotings.length]);

  useEffect(() => {
    if (initialLoadGuard.current === false) {
      initialLoadGuard.current = true;
      loadVotings(1, true);
    }
  }, [loadVotings]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVotings(nextPage);
  };

  const handleCreateVote = async (name: string, description: string, durationInSeconds: number) => {
    if (!isConnected || !walletProvider) {
      toast.error("Veuillez connecter votre portefeuille.");
      return;
    }
    setIsCreatingVote(true);
    const loadingToastId = toast.loading("Création de la transaction...");
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(factoryAddress, factoryABI, signer);
      
      const tx = await contract.createVoting(durationInSeconds, name, description);
      
      toast.loading("Transaction en cours...", { id: loadingToastId });
      await tx.wait();
      
      toast.success("Vote créé avec succès !", { id: loadingToastId });
      setIsModalOpen(false);
      loadVotings(1, true);
    } catch (error) {
      console.error(error);
      toast.error("Échec de la création du vote.", { id: loadingToastId });
    } finally {
      setIsCreatingVote(false);
    }
  };

  return (
    <div className="w-full py-16">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-2xl font-bold text-slate-300">
          Votes Disponibles
        </h2>
        {isConnected && (
           <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold border border-sky-500/50 text-sky-400 rounded-full px-4 py-1.5 hover:bg-sky-500 hover:text-slate-900 transition-colors"
            >
              Créer un vote
            </button>
        )}
      </div>
      
      <VoteList 
        votes={deployedVotings} 
        isLoading={isLoading}
        isConnected={isConnected}
        onAddVoteClick={() => setIsModalOpen(true)}
      />

      {!isLoading && hasMore && (
        <div className="mt-12 text-center">
          <button 
            onClick={handleLoadMore} 
            disabled={isLoadingMore}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}
      
      <CreateVoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateVote}
        isLoading={isCreatingVote}
      />
    </div>
  );
}