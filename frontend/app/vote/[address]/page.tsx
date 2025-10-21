'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { votingABI } from '../../../contract-config';
import { CustomConnectButton } from '../../../components/CustomConnectButton';
import { fetchVoteDetails, fetchUserStatus } from '../../../lib/votingService';
import { ParticipationModal } from '../../../components/ParticipationModal';
import Blockies from 'react-blockies';

interface Participant {
  participantAddress: string;
  name: string;
  description: string;
  votes: number;
  ensName: string | null;
}

interface ContractInfo {
  name: string;
  description: string;
  endDate: Date;
  isFinished: boolean;
  totalVotes: number;
}

export default function VoteDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: contractAddress } = use(params);
  const { address: userAddress, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<{ address: string; votes: number; ensName: string | null } | null>(null);

  const [isOwner, setIsOwner] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnteringCompetition, setIsEnteringCompetition] = useState(false);

  const loadVoteData = useCallback(async () => {
    if (!isConnected || !walletProvider || !userAddress || !contractAddress) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      
      const details = await fetchVoteDetails(contractAddress, provider);
      setContractInfo({
        name: details.name,
        description: details.description,
        endDate: details.endDate,
        isFinished: details.isFinished,
        totalVotes: details.totalVotes,
      });
      setParticipants(details.participants);
      setWinner(details.winner);
      
      if (details.owner?.address && userAddress) {
        setIsOwner(details.owner.address.toLowerCase() === userAddress.toLowerCase());
      }

      const userStatus = await fetchUserStatus(contractAddress, userAddress, provider);
      setHasVoted(userStatus.hasVoted);
      setIsParticipant(userStatus.isParticipating);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletProvider, userAddress, contractAddress]);

  useEffect(() => {
    loadVoteData();
  }, [loadVoteData]);

  const handleVote = async (participantAddress: string) => {
    if (!walletProvider) return toast.error("Portefeuille non connecté");
    const loadingToastId = toast.loading("Envoi de votre vote...");
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, votingABI, signer);
      const tx = await contract.vote(participantAddress);
      await tx.wait();
      toast.success("Vote enregistré !", { id: loadingToastId });
      loadVoteData();
    } catch (error) {
      console.error(error);
      toast.error("Échec du vote.", { id: loadingToastId });
    }
  };

  const handleEnterCompetition = async (name: string, description: string) => {
    if (!walletProvider) return toast.error("Portefeuille non connecté");
    setIsEnteringCompetition(true);
    const loadingToastId = toast.loading("Inscription en cours...");
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, votingABI, signer);
      const tx = await contract.enterCompetition(name, description);
      await tx.wait();
      toast.success("Inscription réussie !", { id: loadingToastId });
      setIsModalOpen(false);
      loadVoteData();
    } catch (error) {
      console.error(error);
      toast.error("Échec de l'inscription.", { id: loadingToastId });
    } finally {
      setIsEnteringCompetition(false);
    }
  };

  const handleStopVoting = async () => {
    if (!walletProvider) return toast.error("Portefeuille non connecté");
    const loadingToastId = toast.loading("Arrêt du vote...");
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, votingABI, signer);
      const tx = await contract.stopVoting();
      await tx.wait();
      toast.success("Le vote a été arrêté.", { id: loadingToastId });
      loadVoteData();
    } catch (error) {
      console.error(error);
      toast.error("Échec de l'opération.", { id: loadingToastId });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center text-slate-400 py-20">Chargement des données du vote...</div>;
    }

    if (!isConnected) {
      return (
        <div className="text-center py-20 bg-slate-800/50 rounded-lg">
          <h3 className="text-xl font-bold text-slate-100">Action requise</h3>
          <p className="text-slate-400 mt-2">Veuillez connecter votre portefeuille pour voir les détails et interagir avec ce vote.</p>
        </div>
      );
    }
    
    if (!contractInfo) {
      return <div className="text-center text-red-400 py-20">Impossible de charger les informations de ce vote.</div>;
    }

    const canVote = !contractInfo.isFinished && !hasVoted;

    return (
      <>
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-100">{contractInfo.name}</h1>
          <p className="text-slate-400 mt-2 max-w-2xl mx-auto">{contractInfo.description}</p>
          <div className="mt-6 flex justify-center items-center gap-6">
            <p className="text-sm text-sky-400">Total de {contractInfo.totalVotes} votes enregistrés</p>
            {isOwner && !contractInfo.isFinished && (
              <button onClick={handleStopVoting} className="text-sm border border-red-500/50 text-red-400 rounded-full px-4 py-1 hover:bg-red-500 hover:text-white transition-colors">
                Arrêter le vote
              </button>
            )}
          </div>
        </section>
        
        {winner && (
          <section className="my-10 p-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-center shadow-2xl">
            <h2 className="text-4xl font-bold mb-2">🏆 Le Gagnant Est 🏆</h2>
            <div className="flex justify-center items-center gap-4 mt-4">
              <Blockies seed={winner.address.toLowerCase()} size={10} scale={5} className="rounded-full" />
              <p className="text-xl font-mono break-all">{winner.ensName || winner.address}</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{winner.votes} votes</p>
          </section>
        )}

        {!contractInfo.isFinished && !isParticipant && (
          <section className="my-10 p-6 text-center bg-slate-800/50 rounded-lg border border-sky-500/20 shadow-lg shadow-sky-500/5">
            <h3 className="text-xl font-bold text-slate-100">Prêt à participer ?</h3>
            <p className="text-slate-400 mt-2 max-w-md mx-auto">Rejoignez ce vote pour soumettre votre candidature et permettre aux autres de voter pour vous.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Je Participe !
            </button>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-300 mb-6">Participants</h2>
          
          {participants.length > 0 ? (
            <div className="space-y-6">
              {participants.filter(p => p && p.participantAddress).map((p) => (
                <div key={p.participantAddress} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-1 flex items-center gap-4">
                      <Blockies seed={p.participantAddress.toLowerCase()} size={8} scale={5} className="rounded-md" />
                      <div>
                        <h3 className="font-bold text-sky-400">{p.name}</h3>
                        <p className="text-xs font-mono text-slate-500 break-all">{p.ensName || p.participantAddress}</p>
                        <p className="text-sm text-slate-300 mt-2">{p.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:w-48 justify-end">
                      <span className="font-bold text-xl text-slate-100">{p.votes}</span>
                      {canVote && userAddress && p.participantAddress.toLowerCase() !== userAddress.toLowerCase() && (
                        <button onClick={() => handleVote(p.participantAddress)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">
                          Voter
                        </button>
                      )}
                    </div>
                  </div>
                  {contractInfo.totalVotes > 0 && (
                    <div className="mt-3 bg-slate-700 rounded-full h-2 w-full">
                      <div 
                        className="bg-sky-500 h-2 rounded-full" 
                        style={{ width: `${(p.votes / contractInfo.totalVotes) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400">Aucun participant pour le moment.</p>
              {!contractInfo.isFinished && !isParticipant && (
                 <p className="text-slate-500 text-sm mt-1">Soyez le premier à participer en cliquant sur le bouton ci-dessus !</p>
              )}
            </div>
          )}
        </section>
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-slate-950">
      <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
          },
        }} />

      <header className="relative z-10 mx-auto max-w-screen-2xl px-8">
        <div className="flex items-center justify-between py-12">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/70 rounded-full px-4 py-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Retour</span>
          </Link>
          <CustomConnectButton />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-8 pb-20">
        {renderContent()}
      </main>

      <ParticipationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEnterCompetition}
        isLoading={isEnteringCompetition}
      />
    </div>
  );
}