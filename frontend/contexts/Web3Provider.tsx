// contexts/Web3Provider.tsx
'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ReactNode } from 'react';

//https://cloud.walletconnect.com
const projectId = '5b6e98c607cc38bebe53639dfe320724';

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://rpc.sepolia.org'
};


const metadata = {
  name: 'Voting dApp',
  description: 'Une application de vote décentralisée',
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [sepolia],
  projectId,
  enableAnalytics: true 
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}