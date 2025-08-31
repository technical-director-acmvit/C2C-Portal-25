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
      {/* Logo top left */}
      <div className="absolute top-6 left-6 sm:left-8">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>
      <BackChevron className="absolute top-6 left-6" />
      {/* Centered text and buttons */}
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <div className="flex items-center gap-3 mb-6">
          <BackChevron />
          <h1 
            className="text-white text-2xl sm:text-3xl"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: '700' }}
          >
            Team Up!
          </h1>
        </div>
        <div className="flex gap-8">
          <PortalButton onClick={handleJoinTeam}>Join Team</PortalButton>
          <PortalButton onClick={handleCreateTeam}>Create Team</PortalButton>
        </div>
        <p className="text-gray-400 text-center mt-8">
          Your dream team starts here. Make it count!
        </p>
      </div>
    </div>
  );
};

export default TeamUp;
