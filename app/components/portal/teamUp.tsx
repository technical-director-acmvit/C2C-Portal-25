"use client";

import React, { useState } from "react";
import Image from 'next/image';
import JoinTeam from './joinTeam';
import CreateTeam from './createTeam';

const TeamUp = () => {
  const [selectedOption, setSelectedOption] = useState<'join' | 'create' | null>(null);

  const handleJoinTeam = () => {
    setSelectedOption('join');
  };

  const handleCreateTeam = () => {
    setSelectedOption('create');
  };

  if (selectedOption === 'join') {
    return <JoinTeam />;
  }

  if (selectedOption === 'create') {
    return <CreateTeam />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      {/* Logo top left */}
      <div className="absolute top-6 left-18">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>
      {/* Centered text and buttons */}
      <div className="flex flex-col items-center justify-center h-full">
        <h1 
          className="text-white mb-8"
          style={{
            fontSize: '48px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '700'
          }}
        >
          Team Up!
        </h1>
        <div className="flex gap-8">
          <button 
            className="px-8 py-4 rounded-lg text-white cursor-pointer" 
            style={{ 
              backgroundColor: '#5EBF94',
              fontSize: '26px',
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: '400'
            }}
            onClick={handleJoinTeam}
          >
            Join Team
          </button>
          <button 
            className="px-8 py-4 rounded-lg text-white cursor-pointer" 
            style={{ 
              backgroundColor: '#5EBF94',
              fontSize: '26px',
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: '400'
            }}
            onClick={handleCreateTeam}
          >
            Create Team
          </button>
        </div>
        <p className="text-gray-400 text-center mt-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </div>
    </div>
  );
};

export default TeamUp;
