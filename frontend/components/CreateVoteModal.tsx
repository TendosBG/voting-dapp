'use client';

import { useState } from 'react';

interface CreateVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, durationInSeconds: number) => Promise<void>;
  isLoading: boolean;
}

export function CreateVoteModal({ isOpen, onClose, onCreate, isLoading }: CreateVoteModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeValue, setTimeValue] = useState<number>(10);
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours' | 'days'>('minutes');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let durationInSeconds = 0;
    switch (timeUnit) {
      case 'seconds':
        durationInSeconds = timeValue;
        break;
      case 'minutes':
        durationInSeconds = timeValue * 60;
        break;
      case 'hours':
        durationInSeconds = timeValue * 3600;
        break;
      case 'days':
        durationInSeconds = timeValue * 86400;
        break;
    }

    await onCreate(name, description, durationInSeconds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-100 mb-6 text-center">Créer un nouveau vote</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder="Nom du vote" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-700 p-3 rounded-md text-slate-200"
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-slate-700 p-3 rounded-md text-slate-200"
          />
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-2">
              Durée du vote
            </label>
            <div className="flex gap-2">
              <input 
                id="duration"
                type="number" 
                value={timeValue}
                onChange={(e) => setTimeValue(Number(e.target.value))}
                required 
                min="1"
                className="w-2/3 bg-slate-700 p-3 rounded-md text-slate-200"
              />
              <select 
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as 'seconds' | 'minutes' | 'hours' | 'days')}
                className="w-1/3 bg-slate-700 p-3 rounded-md text-slate-200 border-none"
              >
                <option value="seconds">Secondes</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Heures</option>
                <option value="days">Jours</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Annuler</button>
            <button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Création...' : 'Lancer le vote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}