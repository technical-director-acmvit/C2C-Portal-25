"use client";

import React from 'react';
import DotGrid from './dot-grid';
import GradientBG from './gradient-bg';
import Topper from './topper';

const SponsorCard: React.FC<{ title?: string; role?: string; description?: string; className?: string }> = ({ title = 'Sponsor Name', role = 'Title Sponsor', description, className = '' }) => {
  return (
    <div className={`w-full max-w-[560px] ${className}`}>
      <div className="relative rounded-[22px] border border-white/20 bg-white/5 backdrop-blur-[6px] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 rounded-[22px]" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }} />
        <div className="pointer-events-none absolute -bottom-3 left-0 right-0 h-6 rounded-b-[26px]" style={{ filter: 'blur(6px)', background: 'radial-gradient(60% 80% at 50% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.0) 70%)' }} />

        <div className="relative">
          <div className="h-20 sm:h-24 rounded-2xl bg-[#48BA86]/35 mb-6 mx-6 sm:mx-8" />

          <h3 className="text-white mb-1 text-[22px] sm:text-[26px] leading-tight tracking-wide" style={{ fontFamily: 'Pilat Extended, Arial, sans-serif', fontWeight: 700 }}>
            {title}
          </h3>
          <p className="text-gray-300/90 text-sm sm:text-base mb-3" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>{role}</p>
          <p className="text-gray-300/85 text-[13px] sm:text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
            {description ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'}
          </p>
        </div>
      </div>
    </div>
  );
};

const Sponsors = () => (
  <GradientBG>
    <div id="sponsors" className="w-full min-h-screen relative overflow-hidden">
      <Topper text="sponsor" />
      <div className="absolute inset-0 z-0">
        <DotGrid dotSize={3} gap={25} baseColor="#a3a3a3" />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-4 md:px-6 pointer-events-auto -translate-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 place-items-center">
            <SponsorCard />
            <SponsorCard />
          </div>
        </div>
      </div>
    </div>
  </GradientBG>
);

export default Sponsors;
