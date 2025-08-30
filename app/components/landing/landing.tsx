"use client";

import React from "react";
import Image from 'next/image';
const Landing = () => {
  const handleApplyClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = "/portal";
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-transparent">
      {/* Gradient Background */}
      <Image
        src="/Landing/gradient.svg"
        alt="Gradient Background"
        fill
        priority
        style={{
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none"
        }}
      />
      {/* Gradient Background */}
      <Image
        src="/Landing/gradient.svg"
        alt="Gradient Background"
        fill
        priority
        style={{
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none"
        }}
      />
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
