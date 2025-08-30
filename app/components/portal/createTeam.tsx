"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Dashboard from './dashboard';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleProceed = () => {
    if (teamName.trim()) {
      setSubmitted(true);
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
          Enter Team Name
        </h1>
        
        <div className="mb-6">
          <input
            type="text"
            value={teamName}
            onChange={handleNameChange}
            placeholder="Team name"
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
            teamName.trim() 
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
          disabled={!teamName.trim()}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateTeam;
