"use client";

import React from "react";
import Image from 'next/image';
const Landing = () => {
  return (
    <div 
      className="h-screen w-full relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #4A9B7A 0%, #2A5A45 100%)'
      }}
    >
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* soft color blobs (reduced opacity, mix-blend multiply for richer/darker tones) */}
        <div className="w-[1405.33px] h-[1405.33px] absolute -bottom-96 -left-96 rounded-full blur-[426.58px] mix-blend-multiply" style={{ background: 'conic-gradient(from 153deg at 50% 50%, #5EBF94 96deg, #6DB1E2 263deg, #29A37A 360deg)', opacity: 0.22 }} />
        <div className="w-[1405.33px] h-[1405.33px] absolute -bottom-80 -left-40 rounded-full blur-[426.58px] mix-blend-multiply" style={{ background: 'conic-gradient(from 137deg at 50% 50%, #FFCA3C 96deg, #C36BF8 252deg, #FD7E41 360deg)', opacity: 0.18 }} />

        {/* optional extra blobs (fine tune or remove) */}
        <div className="w-[900px] h-[900px] absolute -top-72 -right-40 rounded-full blur-[300px] mix-blend-soft-light" style={{ background: 'conic-gradient(from 200deg at 50% 50%, #86E3C3, #6DB1E2, #8A7AF8)', opacity: 0.14 }} />

        {/* dark overlay to deepen colors (adjust alpha) */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.28)' }} />
      </div>

      {/* Main Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center z-10">
        
        {/* Main Heading with stroke - positioned above logo */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
          <h1 
            className="text-center whitespace-nowrap"
            style={{
              WebkitTextStroke: '2.41px #EFEFEF',
              fontFamily: 'Trap, Arial, sans-serif',
              fontSize: 'clamp(40px, 6vw, 77px)',
              fontWeight: '700',
              lineHeight: '130%',
              color: 'transparent',
              textAlign: 'center'
            }}
          >
            We are the hackathon
          </h1>
          <h1 
            className="text-center whitespace-nowrap"
            style={{
              WebkitTextStroke: '2.41px #EFEFEF',
              fontFamily: 'Trap, Arial, sans-serif',
              fontSize: 'clamp(40px, 6vw, 77px)',
              fontWeight: '700',
              lineHeight: '130%',
              color: 'transparent',
              textAlign: 'center'
            }}
          >
            Everyone dreams of
          </h1>
        </div>

        {/* Main logo positioned like rising sun from mountains - behind mountains */}
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/4" style={{ zIndex: 1 }}>
          <Image 
            src="/Landing/C2C Logo.svg" 
            alt="Code2Create Main Logo" 
            width={180} 
            height={180}
            className="opacity-200"
          />
        </div>

        {/* Mountains background - moved up; darken with filter so colors read darker */}
        <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 5 }}>
          <Image 
            src="/Landing/footer-hills 1.png" 
            alt="Mountain Background" 
            width={1920} 
            height={100}
            className="w-full h-auto object-cover"
            style={{ maxHeight: '70vh', filter: 'brightness(0.72) contrast(0.95)' }}
          />
        </div>

        {/* Main tagline */}
        <div className="absolute bottom-1/5 left-1/2 transform -translate-x-1/2 translate-y-full" style={{ zIndex: 10 }}>
          <p 
            className="text-center whitespace-nowrap"
            style={{
              color: '#BEBEBE',
              fontFamily: 'Trap, Arial, sans-serif',
              fontSize: 'clamp(20px, 4vw, 42px)',
              fontWeight: '700',
              lineHeight: '130%',
              textAlign: 'center'
            }}
          >
            Don&apos;t just code for the vibes, Code2Create.
          </p>
        </div>

        {/* Background/faded tagline (reflection) */}
        <div
          className="absolute bottom-1/6 left-1/2 transform -translate-x-1/2"
          style={{
            bottom: '8%', // adjust to align reflection on the water line
            zIndex: 6,     // above mountains (zIndex 5) but below main tagline (10)
            pointerEvents: 'none',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <p
            style={{
              color: '#BEBEBE',
              fontFamily: 'Trap, Arial, sans-serif',
              fontSize: 'clamp(20px, 4vw, 42px)',
              fontWeight: '700',
              lineHeight: '130%',
              opacity: 0.4,
              textAlign: 'center',
              transform: 'translateY(6%) scaleY(-1)', // flip & nudge down
              filter: 'blur(0.6px)',                   // subtle blur for realism
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))'
            }}
          >
            Don&apos;t just code for the vibes, Code2Create.
          </p>
        </div>

        {/* Footer text - left */}
        <div className="absolute bottom-6 left-6" style={{ zIndex: 20 }}>
          <p style={{ fontFamily: 'Trap, Arial, sans-serif', fontSize: '12px', fontWeight: 700, margin: 0, color: '#FFF' }}>
            We are not just another <span style={{ color: 'var(--C2C-Green, #48BA86)', fontWeight: 700 }}>hackathon</span>
          </p>
          <p style={{ fontFamily: 'Trap, Arial, sans-serif', fontSize: '12px', fontWeight: 400, margin: 0, color: '#FFF' }}>
            We are the conspiracy that actually works
          </p>
        </div>

        {/* Footer text - right */}
        <div className="absolute bottom-6 right-6 text-right" style={{ zIndex: 20 }}>
          <p style={{ fontFamily: 'Trap, Arial, sans-serif', fontSize: '12px', fontWeight: 700, margin: 0, color: '#FFF' }}>
            Established in 2016
          </p>
          <p style={{ fontFamily: 'Trap, Arial, sans-serif', fontSize: '12px', fontWeight: 700, margin: 0, color: 'var(--C2C-Green, #48BA86)' }}>
            Code2Create 6.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
