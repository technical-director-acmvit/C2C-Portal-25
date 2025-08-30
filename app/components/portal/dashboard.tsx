"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Form from './form';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);

  const handleGoToForm = () => {
    setShowForm(true);
  };

  if (showForm) {
    return <Form />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      {/* Logo top left */}
      <div className="absolute top-6 left-18">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>
      
      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* Team Name Section */}
        <h1 
          className="text-white mb-8"
          style={{
            fontSize: '48px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '700',
            letterSpacing: '2px'
          }}
        >
          TEAM NAME
        </h1>
        
        {/* Team Code Section */}
        <div className="flex items-center gap-4 mb-12">
          <div 
            className="border-2 border-white px-6 py-3 flex items-center gap-4"
            style={{ backgroundColor: 'transparent' }}
          >
            <span 
              className="text-white"
              style={{
                fontSize: '20px',
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: '400'
              }}
            >
              <span style={{ color: '#5EBF94' }}>1</span>{' '}
              <span style={{ color: '#5EBF94' }}>2</span>{' '}
              <span style={{ color: '#5EBF94' }}>3</span>{' '}
              <span style={{ color: '#5EBF94' }}>4</span>
            </span>
          </div>
          <button 
            className="border-2 border-white p-3 bg-transparent hover:bg-white/10 transition-colors"
            onClick={() => navigator.clipboard?.writeText('1234')}
          >
            <div className="w-5 h-5 border border-white"></div>
          </button>
        </div>
        
        {/* Team Members Section */}
        <div className="flex gap-12 mb-8">
          {[1, 2, 3, 4].map((member) => (
            <div key={member} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-white bg-transparent mb-2 flex items-center justify-center">
                <Image 
                  src="/portal/user.svg" 
                  alt="User Profile" 
                  width={32} 
                  height={32}
                  className="opacity-80"
                />
              </div>
              <span 
                className="text-white"
                style={{
                  fontSize: '16px',
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontWeight: '400'
                }}
              >
                Name
              </span>
            </div>
          ))}
        </div>
        
        {/* Description */}
        <p 
          className="text-gray-400 text-center mb-8 max-w-md"
          style={{
            fontSize: '14px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '400'
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        
        {/* Go to Form Button */}
        <button 
          className="px-8 py-4 rounded-lg text-white cursor-pointer" 
          style={{ 
            backgroundColor: '#5EBF94',
            fontSize: '20px',
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: '400'
          }}
          onClick={handleGoToForm}
        >
          Go to form
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
