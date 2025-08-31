"use client";

import Image from 'next/image';
import React from 'react';
import DotGrid from './dot-grid';

const SponsorCard: React.FC<{ title?: string; role?: string; description?: string }> = ({ title = 'Sponsor Name', role = 'Title Sponsor', description }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card with subtle backdrop blur that doesn't hide dots completely */}
      <div className="bg-black/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8" style={{ backdropFilter: 'blur(4px)' }}>
        {/* Green placeholder rectangle */}
        <div className="h-24 rounded-lg bg-[#4ade80] mb-6" />
        
        {/* Content */} 
        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Pilat Extended, Arial, sans-serif' }}>{title}</h3>
        <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>{role}</p>
        
        <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
          {description ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'}
        </p>
      </div>
    </div>
  );
};

const Sponsors = () => (
	<div className="w-full h-screen relative overflow-hidden">
		{/* DotGrid positioned behind the cards */}
		<div className="absolute inset-0 z-0">
			<DotGrid dotSize={3} gap={25} baseColor="#a3a3a3" />
		</div>
		{/* Content positioned above the dots */}
		<div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
			{/* move content a bit up: adjust -translate-y value as needed */}
			<div className="w-full max-w-7xl px-6 pointer-events-auto transform -translate-y-14"> 				
                <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
                    <SponsorCard title="Sponsor Name" />
                    <SponsorCard title="Sponsor Name" />
                </div>
            </div>
        </div>
    </div>
);

export default Sponsors;
