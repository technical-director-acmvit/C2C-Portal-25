"use client";

import React, { useState } from "react";
import Image from 'next/image';
import JoinTeam from './join-team';
import CreateTeam from './create-team';
import PortalButton from './ui/button';
import BackChevron from './ui/back-chevron';

const TeamUp = () => {
  const [selectedOption, setSelectedOption] = useState<'join' | 'create' | null>(null);

  const handleJoinTeam = () => {
    setSelectedOption('join');
  };

  const handleCreateTeam = () => {
    setSelectedOption('create');
  };

  if (selectedOption === 'join') {
    return <JoinTeam onBack={() => setSelectedOption(null)} />;
  }

  if (selectedOption === 'create') {
    return <CreateTeam onBack={() => setSelectedOption(null)} />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="flex items-center mb-6">
          <BackChevron />
          <h1 
            className="flex-1 text-center text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: '700' }}
          >
            Team Up!
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center">
          <PortalButton onClick={handleJoinTeam}>Join Team</PortalButton>
          <PortalButton onClick={handleCreateTeam}>Create Team</PortalButton>
        </div>
        <p className="text-gray-400 text-center mt-6 sm:mt-8">
          Your dream team starts here. Make it count!
        </p>
      </div>
    </div>
  );
};

export default TeamUp;
