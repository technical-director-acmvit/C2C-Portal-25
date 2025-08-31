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
      
      {/* Centered card content (match JoinTeam) */}
      <div className="flex items-center justify-center h-full px-4">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(10px) saturate(120%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset',
          border: '1px solid rgba(255,255,255,0.10)'
        }}>
          <div className="flex items-center gap-3 mb-6">
            <BackChevron onClick={onBack} />
            <h1 className="text-white text-2xl sm:text-3xl" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: 700 }}>Enter Team Name</h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={teamName}
              onChange={handleNameChange}
              placeholder="Team name"
              className="w-full px-5 py-3 rounded-full bg-[#111213]/60 border border-white/10 text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: '16px', fontWeight: 400 }}
            />
          </div>

          <p className="text-gray-400 text-center mb-6" style={{ fontSize: '14px', fontFamily: "'Pilat Regular', Arial, sans-serif", fontWeight: 400 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>

          <div className="flex justify-center">
            <PortalButton onClick={handleProceed} disabled={!teamName.trim() || loading} className={`${teamName.trim() ? '' : 'opacity-50 cursor-not-allowed'} px-6 py-2 text-[18px]`}>
              {loading ? 'Creating…' : 'Proceed'}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
