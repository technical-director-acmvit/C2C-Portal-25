"use client";

import Image from 'next/image';
import React from 'react';

const SponsorCard: React.FC<{ title?: string; role?: string; description?: string }> = ({ title = 'Sponsor Name', role = 'Title Sponsor', description }) => {
  return (
    <div className="w-full md:w-1/2 p-6">
      {/* outer outline/glow */}
      <div className="rounded-2xl p-1" style={{ boxShadow: '0 6px 30px rgba(0,0,0,0.6), 0 0 0 6px rgba(59,130,246,0.06)' }}>
        <div className="bg-black/80 rounded-2xl p-8 min-h-[340px] h-full border border-white/8 backdrop-blur-md">
          {/* green hero rectangle */}
          <div className="h-28 rounded-xl bg-[#3cc08e] mb-6 mx-2" />

          <h3 className="text-4xl md:text-5xl font-bold text-white mb-1" style={{ fontFamily: 'Pilat Extended, Trap, Arial, sans-serif' }}>{title}</h3>
          <p className="text-lg text-white/70 mb-6">{role}</p>

          <p className="text-sm text-white/70">{description ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}</p>
        </div>
      </div>
    </div>
  );
};

const Sponsors = () => {
  return (
    <section className="w-full min-h-screen flex items-start justify-center py-20 px-6 relative" style={{ backgroundImage: "url('/Landing/gradient.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-white" style={{ fontFamily: 'Pilat Extended, Trap, Arial, sans-serif' }}>Our Sponsors</h2>
        </div>

        <div className="flex flex-col md:flex-row md:-mx-6">
          <SponsorCard title="Sponsor Name" />
          <SponsorCard title="Sponsor Name" />
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
