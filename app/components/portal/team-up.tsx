"use client";

import React, { useState } from "react";
import JoinTeam from './join-team';
import CreateTeam from './create-team';
import PortalButton from './ui/button';

const TeamUp = () => {
  const [selectedOption, setSelectedOption] = useState<'join' | 'create' | null>(null);

  const handleJoinTeam = () => {
    setSelectedOption('join');
  };

  const handleCreateTeam = () => {
    setSelectedOption('create');
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      <div className={`absolute inset-0 transition-transform duration-300 ease-out ${selectedOption ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="flex flex-col items-center justify-center h-full px-4 text-center">
          <div className="flex items-center mb-6">
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

      <div className={`absolute inset-0 transition-opacity duration-200 ease-out z-10 ${selectedOption ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {selectedOption === 'join' && <JoinTeam onBack={() => setSelectedOption(null)} />}
        {selectedOption === 'create' && <CreateTeam onBack={() => setSelectedOption(null)} />}
      </div>
    </div>
  );
};

export default TeamUp;
