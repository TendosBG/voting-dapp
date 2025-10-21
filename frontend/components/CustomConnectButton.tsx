// components/CustomConnectButton.tsx
'use client';

import { useWeb3Modal } from '@web3modal/ethers/react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

export function CustomConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  const truncatedAddress = isConnected 
    ? `${address.substring(0, 8)}...${address.substring(address.length - 4)}` 
    : '';

  const buttonClasses = isConnected
    ? "bg-slate-800 text-slate-300 font-medium py-2 px-4 rounded-full transition-colors duration-200 ease-in-out hover:bg-slate-700 cursor-pointer"
    : "bg-sky-600 text-white font-bold py-2 px-5 rounded-full transition-colors duration-200 ease-in-out shadow-lg hover:bg-sky-700 cursor-pointer";

  return (
    <button
      onClick={() => open()}
      className={buttonClasses}
    >
      {isConnected ? truncatedAddress : 'Connecter votre Wallet'}
    </button>
  );
}