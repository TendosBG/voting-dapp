'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ReactNode } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable");
}

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || 'https://rpc.sepolia.org'
};

const metadata = {
  name: 'Voting dApp',
  description: 'Une application de vote décentralisée',
  url: 'https://VOTRE_URL_VERCEL.app',
  icons: ['https://VOTRE_URL/logo.png']
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