import { Toaster } from 'react-hot-toast';
import { CustomConnectButton } from '../components/CustomConnectButton';
import { VotingDashboard } from '../components/VotingDashboard';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-slate-950">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
          },
        }}
      />
      
      <header className="relative z-10 mx-auto max-w-screen-2xl px-8">
        <div className="flex items-center justify-between py-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-400">
            Bureau des Votes
          </h1>
          <CustomConnectButton />
        </div>
      </header>
      
      <main className="relative z-10 mx-auto max-w-7xl px-8">
        <VotingDashboard />
      </main>
    </div>
  );
}