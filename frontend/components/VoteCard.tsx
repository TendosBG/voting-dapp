'use client';

import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { MouseEvent, useState, useEffect } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

interface Vote {
  name: string;
  address: string;
  description: string;
  participantCount: number;
  endDate: Date;
}

interface VoteCardProps {
  vote: Vote;
}

export function VoteCard({ vote }: VoteCardProps) {
  const { isConnected } = useWeb3ModalAccount();
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('bg-gray-500');

  useEffect(() => {
    const timeFormat = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    });

    const dateFormat = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Europe/Paris',
    });

    const calculateStatus = () => {
      const now = new Date();
      const end = vote.endDate;
      const diffMs = end.getTime() - now.getTime();

      if (diffMs <= 0) {
        setStatusText("Terminé");
        setStatusColor('bg-red-500');
        return;
      }

      setStatusColor('bg-green-500');

      const isToday = now.getFullYear() === end.getFullYear() &&
                      now.getMonth() === end.getMonth() &&
                      now.getDate() === end.getDate();

      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const isTomorrow = tomorrow.getFullYear() === end.getFullYear() &&
                         tomorrow.getMonth() === end.getMonth() &&
                         tomorrow.getDate() === end.getDate();

      if (isToday) {
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);

        if (diffSec < 60) {
          setStatusText(`Finit dans ${diffSec} sec`);
          return;
        }
        if (diffMin < 60) {
          setStatusText(`Finit dans ${diffMin} min`);
          return;
        }
        setStatusText(`Finit à ${timeFormat.format(end)}`);
      } else if (isTomorrow) {
        setStatusText(`Finit demain à ${timeFormat.format(end)}`);
      } else {
        setStatusText(`Finit le ${dateFormat.format(end)}`);
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 1000);

    return () => clearInterval(interval);
  }, [vote.endDate]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isConnected) {
      event.preventDefault(); 
      toast.error("Veuillez connecter votre portefeuille pour continuer.", { id: 'connect-wallet-toast' });
    }
  };

  return (
    <Link 
      href={`/vote/${vote.address}`}
      onClick={handleClick}
      className="group flex flex-col justify-between p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 hover:border-sky-500 transition-all duration-200"
    >
      <div>
        <h3 className="text-lg font-bold text-sky-400">{vote.name}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
          <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
          <span>{statusText}</span>
        </div>
        <p className="text-slate-300 mt-4 text-sm">
          {vote.description}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
        <div className="text-sm text-slate-400">
          <span className="font-bold text-slate-200">{vote.participantCount}</span> 
          {vote.participantCount > 1 ? ' Participants' : ' Participant'}
        </div>
        <span className="text-sky-400 text-sm group-hover:translate-x-1 transition-transform">
          Voir &rarr;
        </span>
      </div>
    </Link>
  );
} 