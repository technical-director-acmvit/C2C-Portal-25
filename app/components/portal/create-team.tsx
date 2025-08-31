"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Dashboard from './dashboard';
import { createTeam } from '../../actions/team';
import BackChevron from './ui/back-chevron';
import PortalButton from './ui/button';

interface Props { onBack?: () => void }
const CreateTeam = ({ onBack }: Props) => {
  const [teamName, setTeamName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };


  const handleProceed = async () => {
    if (!teamName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createTeam(teamName);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <Dashboard />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-lg px-4 sm:px-0 mb-4">
          <div className="flex items-center gap-3">
            <BackChevron onClick={onBack} />
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: '700' }}>Enter Team Name</h1>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div className="mb-4 w-full max-w-lg">
          <input
            type="text"
            value={teamName}
            onChange={handleNameChange}
            placeholder="Team name"
            className="px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-gray-600/80 border-none text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[#5EBF94] w-full"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: '400'
            }}
          />
        </div>

        
        <p 
          className="text-gray-400 text-center mb-6 sm:mb-8 max-w-lg"
          style={{
            fontSize: '14px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '400'
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        <div className="w-full max-w-lg px-4 sm:px-0 flex justify-center">
          <PortalButton 
            onClick={handleProceed}
            disabled={!teamName.trim() || loading}
            className={`w-full text-lg sm:w-auto sm:px-12 ${teamName.trim() ? '' : 'opacity-50 pointer-events-none'}`}
          >
            {loading ? 'Creating…' : 'Proceed'}
          </PortalButton>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
