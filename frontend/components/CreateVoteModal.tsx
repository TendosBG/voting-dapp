'use client';

import { useState } from 'react';

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

interface CreateVoteModalProps {
  isOpen: boolean;
  onClose: () => void;

  onCreate: (name: string, description: string, durationInSeconds: number) => Promise<void>;
}

export function CreateVoteModal({ isOpen, onClose, onCreate }: CreateVoteModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeValue, setTimeValue] = useState<number>(10);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    await onCreate(name, description, durationInSeconds);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Créer un nouveau vote</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nom du vote
            </label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="w-full bg-slate-700 p-3 rounded-md text-slate-200"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description du vote
            </label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
              className="w-full bg-slate-700 p-3 rounded-md text-slate-200"
              rows={4}
            />
          </div>
          
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
                onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
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
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-300">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="bg-sky-600 text-slate-100 font-bold py-2 px-5 rounded-full hover:bg-sky-700 disabled:bg-sky-800">
              {isSubmitting ? 'Création...' : 'Lancer le vote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}