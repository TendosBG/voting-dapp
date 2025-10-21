import { ethers } from 'ethers';
import { factoryAddress, factoryABI, votingABI } from '../contract-config';

export interface DeployedVotingInfo {
  address: string;
  name: string;
  description: string;
  participantCount: number;
  endDate: Date;
}

const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
if (!rpcUrl) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_RPC_URL n'est pas défini dans .env.local");
}
const publicProvider = new ethers.JsonRpcProvider(rpcUrl);

const PAGE_SIZE = 9;

export const fetchVotings = async ({ page = 1 }: { page?: number }): Promise<{ votes: DeployedVotingInfo[], totalVotes: number }> => {
  try {
    const contract = new ethers.Contract(factoryAddress, factoryABI, publicProvider);
    const allVotingAddresses: string[] = await contract.getDeployedVotings();
    
    const reversedAddresses = [...allVotingAddresses].reverse();

    const totalVotes = reversedAddresses.length;
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedAddresses = reversedAddresses.slice(startIndex, endIndex);

    const votingsInfo = await Promise.all(
      paginatedAddresses.map(async (addr) => {
        const votingContract = new ethers.Contract(addr, votingABI, publicProvider);
        const [name, description, participants, endDate] = await Promise.all([
          votingContract.name(),
          votingContract.description(),
          votingContract.getParticipants(),
          votingContract.endDate()
        ]);
        return { 
          address: addr, 
          name: name,
          description: description,
          participantCount: participants.length,
          endDate: new Date(Number(endDate) * 1000) 
        };
      })
    );

    votingsInfo.sort((a, b) => b.participantCount - a.participantCount);
    votingsInfo.sort((a, b) => {
      const now = new Date();
      const aFinished = a.endDate < now ? 1 : 0;
      const bFinished = b.endDate < now ? 1 : 0;
      return aFinished - bFinished;
    });

    return { votes: votingsInfo, totalVotes };
    
  } catch (error) {
    console.error("Erreur en récupérant la liste des votes:", error);
    throw new Error("Impossible de charger la liste des votes.");
  }
};

export const fetchVoteDetails = async (address: string, provider: ethers.Provider) => {
  try {
    const votingContract = new ethers.Contract(address, votingABI, provider);
    
    const name = await votingContract.name();
    const description = await votingContract.description();
    const rawParticipants = await votingContract.getParticipants();
    const endDate = await votingContract.endDate();
    const votingEnded = await votingContract.votingEnded();
    const totalVotes = await votingContract.voteCount();

    let owner = null;
    let ownerEnsName = null;
    try {
      owner = await votingContract.owner();
      ownerEnsName = await provider.lookupAddress(owner);
    } catch (error) {
      console.warn("Impossible de récupérer le propriétaire (owner).", error);
    }

    let winnerResult = null;
    try {
      const [winnerAddress, winnerVotes] = await votingContract.getWinner();
      if (winnerAddress !== ethers.ZeroAddress) {
        const winnerEnsName = await provider.lookupAddress(winnerAddress);
        winnerResult = { 
          address: winnerAddress, 
          votes: Number(winnerVotes),
          ensName: winnerEnsName 
        };
      }
    } catch (error) {
       console.warn("Impossible de récupérer le gagnant.", error);
    }

    const participantsWithVotes = await Promise.all(
      rawParticipants.map(async (p: [string, string, string]) => {
        const votes = await votingContract.getVotes(p[0]);
        const ensName = await provider.lookupAddress(p[0]);
        return { 
          participantAddress: p[0],
          name: p[1],
          description: p[2],
          votes: Number(votes),
          ensName: ensName
        };
      })
    );
    
    return {
      name,
      description,
      participants: participantsWithVotes.sort((a, b) => b.votes - a.votes),
      endDate: new Date(Number(endDate) * 1000),
      isFinished: votingEnded || new Date() > new Date(Number(endDate) * 1000),
      totalVotes: Number(totalVotes),
      owner: { address: owner, ensName: ownerEnsName },
      winner: winnerResult,
    };
  } catch (error) {
    console.error("Erreur majeure lors de la récupération des détails du vote:", error);
    throw new Error("Impossible de charger les détails de ce vote.");
  }
};

export const fetchUserStatus = async (contractAddress: string, userAddress: string, provider: ethers.Provider) => {
  try {
    const votingContract = new ethers.Contract(contractAddress, votingABI, provider);
    let hasVoted = false;
    try {
      hasVoted = await votingContract.hasVoted(userAddress);
    } catch(error) {
      console.warn("Impossible de vérifier hasVoted.", error);
    }
    const isParticipating = await votingContract.isParticipating(userAddress);
    
    return { hasVoted, isParticipating };
  } catch (error) {
    console.error("Erreur lors de la récupération du statut de l'utilisateur:", error);
    throw new Error("Impossible de charger le statut de l'utilisateur.");
  }
};