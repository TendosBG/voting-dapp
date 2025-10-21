'use client';

import { useWeb3Modal } from '@web3modal/ethers/react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

export function CustomConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  const truncatedAddress = (isConnected && address) 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` 
    : '';

  const baseClasses = "w-48 h-10 flex items-center justify-center rounded-full font-bold transition-colors duration-200 ease-in-out";
  
  const buttonClasses = isConnected
    ? `${baseClasses} bg-slate-800 text-slate-300 hover:bg-slate-700`
    : `${baseClasses} bg-sky-600 text-white shadow-lg hover:bg-sky-700`;

  return (
    <button
      onClick={() => open()}
      className={buttonClasses}
    >
      {isConnected ? truncatedAddress : 'Connecter Wallet'}
    </button>
  );
}