'use client';

import { useState } from 'react';

interface ParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  isLoading: boolean;
}

export function ParticipationModal({ isOpen, onClose, onSubmit, isLoading }: ParticipationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(name, description);
    setName('');
    setDescription('');
  };

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
        <h2 className="text-3xl font-bold text-slate-100 mb-6 text-center">Devenir un participant</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="participantName" className="block text-slate-300 text-sm font-medium mb-2">Nom du participant / Projet</label>
            <input 
              id="participantName"
              type="text" 
              placeholder="Ex: Mon Super Projet" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-200"
            />
          </div>
          <div>
            <label htmlFor="participantDescription" className="block text-slate-300 text-sm font-medium mb-2">Description (150 caractères max)</label>
            <textarea
              id="participantDescription"
              placeholder="Décrivez votre projet ou vous-même en quelques mots..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={150}
              rows={3}
              required
              className="w-full bg-slate-700 p-3 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-200 resize-none"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire à ce vote"}
          </button>
        </form>
      </div>
    </div>
  );
}