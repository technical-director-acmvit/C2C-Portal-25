"use client";

import React from "react";

const Landing = () => {
  const handleApplyClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = "#apply";
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url(/Landing/bg.svg)" }}
    >
      <div className="flex flex-col items-center justify-center text-center z-10">
        <h1 className="mb-6 leading-none" style={{
          fontSize: '59.90px',
          fontFamily: "'Pilat Extended', Arial, sans-serif",
          fontWeight: '700',
          lineHeight: '80.86px',
          letterSpacing: '0.60px'
        }}>
          <span style={{ color: '#48BA86' }}>We are</span>
          <span style={{ color: 'white' }}> the Hackathon</span><br />
          <span style={{ color: 'white' }}>everyone </span>
          <span style={{ color: '#48BA86' }}>dreams</span>
          <span style={{ color: 'white' }}> of</span>
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl px-4">
          Experience the sixth edition of Code2Create now, right from the comfort of your home
        </p>
        
        <button 
          className="px-10 py-4 text-lg rounded-xl border-2 border-[#4FE3C1] bg-black/70 text-[#4FE3C1] font-semibold cursor-pointer mb-8 transition-all duration-200 hover:bg-[#4FE3C1]/20 hover:shadow-[0_0_20px_#4FE3C1] active:scale-95"
          onClick={handleApplyClick}
        >
          apply now
        </button>
        
        <p className="text-base text-gray-400">
          disclaimer: apply with your Gravitas registered email id
        </p>
      </div>
    </div>
  );
};export default Landing;
