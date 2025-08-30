"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Dashboard from './dashboard';
import { joinTeam } from '../../actions/team';

const JoinTeam = () => {
  const [teamCode, setTeamCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamCode(e.target.value);
  };

  const handleProceed = async () => {
    if (!teamCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await joinTeam(teamCode.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <Dashboard />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      {/* Logo top left */}
      <div className="absolute top-6 left-18">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>
      
      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-full">
        <h1 
          className="text-white mb-8 text-center"
          style={{
            fontSize: '48px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '700'
          }}
        >
          Enter Team Code
        </h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div className="mb-6">
          <input
            type="text"
            value={teamCode}
            onChange={handleCodeChange}
            placeholder="Enter the x-digit code"
            className="px-6 py-4 rounded-full bg-gray-600/80 border-none text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[#5EBF94] w-80"
            style={{
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: '400'
            }}
          />
        </div>
        
        <p 
          className="text-gray-400 text-center mb-8"
          style={{
            fontSize: '14px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '400'
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        
        <button 
          className={`px-8 py-3 rounded-lg text-white transition-all duration-200 active:scale-95 ${
            teamCode.trim() 
              ? 'cursor-pointer hover:bg-[#4da577]' 
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{ 
            backgroundColor: '#5EBF94',
            fontSize: '18px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '400'
          }}
          onClick={handleProceed}
          disabled={!teamCode.trim() || loading}
        >
          {loading ? 'Joining…' : 'Proceed'}
        </button>
      </div>
    </div>
  );
};

export default JoinTeam;
