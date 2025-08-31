"use client";

import React from "react";
import Image from 'next/image';
import TopBar from './top-bar';

const Landing = () => {

  return (
    <div className="h-screen w-full relative overflow-hidden bg-transparent">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-30">
        <TopBar />
      </div>

      {/* Gradient Background */}
      <Image
        src="/landing/gradient.svg"
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
      {/* Gradient Background
      <Image
        src="/landing/gradient.svg"
        alt="Gradient Background"
        fill
        priority
        style={{
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none"
        }}
      /> */}
      {/* Main Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center z-10">
        
        {/* Main Heading with stroke - positioned above logo */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-screen-xl" style={{ zIndex: 10 }}>
          <h1 
            className="text-center break-words hyphens-auto mb-2 sm:mb-4"
            style={{
              WebkitTextStroke: '2.41px #EFEFEF',
              fontFamily: 'Trap-Bold, Arial, sans-serif',
              fontSize: 'clamp(24px, 5.2vw, 77px)',
              fontWeight: '700',
              lineHeight: 'clamp(110%, 6vw, 130%)',
              color: 'transparent',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            We are the hackathon
          </h1>
          <h1 
            className="text-center break-words hyphens-auto"
            style={{
              WebkitTextStroke: '2.41px #EFEFEF',
              fontFamily: 'Trap-Bold, Arial, sans-serif',
              fontSize: 'clamp(24px, 5.2vw, 77px)',
              fontWeight: '700',
              lineHeight: 'clamp(110%, 6vw, 130%)',
              color: 'transparent',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            Everyone dreams of
          </h1>
        </div>

        {/* Main logo positioned like rising sun from mountains - behind mountains */}
        <div
          className="absolute top-[52%] left-4/7 transform -translate-x-1/2 -translate-y-1/2 animate-floating"
          style={{ zIndex: 1 }}
        >
          <Image 
            src="/landing/C2C Logo.svg" 
            alt="Code2Create Main Logo" 
            width={180} 
            height={180}
            className="opacity-200 w-auto h-auto max-w-[150px] max-h-[150px] sm:max-w-[140px] sm:max-h-[140px] md:max-w-[180px] md:max-h-[180px]"
            style={{
              width: 'clamp(120px, 18vw, 180px)',
              height: 'clamp(120px, 18vw, 180px)'
            }}
          />
        </div>
        <style jsx global>{`
          @keyframes floating {
            0% { transform: translate(-50%, 25%) translateY(0); }
            50% { transform: translate(-50%, 25%) translateY(-18px); }
            100% { transform: translate(-50%, 25%) translateY(0); }
          }
          .animate-floating {
            animation: floating 3s ease-in-out infinite;
          }
        `}</style>

        {/* Mountains background - moved up; darken with filter so colors read darker */}
        <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 5 }}>
          <Image 
            src="/landing/footer-hills 1.png" 
            alt="Mountain Background" 
            width={1920} 
            height={100}
            className="w-full h-auto object-cover"
            style={{ maxHeight: '70vh', filter: 'brightness(0.72) contrast(0.95)', minHeight: '180px'}}
          />
        </div>

        {/* Main tagline */}
        <div className="absolute bottom-1/5 left-1/2 transform -translate-x-1/2 translate-y-full px-4 w-full max-w-screen-xl" style={{ zIndex: 10 }}>
          <p 
            className="text-center break-words hyphens-auto"
            style={{
              color: '#BEBEBE',
              fontFamily: 'Trap-Bold, Arial, sans-serif',
              fontSize: 'clamp(14px, 3.2vw, 42px)',
              fontWeight: '700',
              lineHeight: 'clamp(120%, 4vw, 130%)',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            Don&apos;t just code for the vibes, Code2Create.
          </p>
        </div>

        {/* Background/faded tagline (reflection) */}
        <div
          className="absolute bottom-1/6 left-1/2 transform -translate-x-1/2 px-4 w-full max-w-screen-xl"
          style={{
            bottom: '8%',
            zIndex: 6,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <p
            className="break-words hyphens-auto"
            style={{
              color: '#BEBEBE',
              fontFamily: 'Trap, Arial, sans-serif',
              fontSize: 'clamp(14px, 3.2vw, 42px)',
              fontWeight: '700',
              lineHeight: 'clamp(120%, 4vw, 130%)',
              opacity: 0.4,
              textAlign: 'center',
              transform: 'translateY(6%) scaleY(-1)',
              filter: 'blur(0.6px)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            Don&apos;t just code for the vibes, Code2Create.
          </p>
        </div>

        {/* Footer text - left */}
        <div className="absolute bottom-4 left-3 sm:bottom-6 sm:left-6" style={{ zIndex: 20 }}>
          <p style={{ 
            fontFamily: 'Trap-Bold, Arial, sans-serif', 
            fontSize: 'clamp(9px, 1.8vw, 12px)', 
            fontWeight: 700, 
            margin: 0, 
            color: '#FFF',
            lineHeight: '1.3'
          }}>
            We are not just another <span style={{ color: 'var(--C2C-Green, #48BA86)', fontWeight: 700 }}>hackathon</span>
          </p>
          <p style={{ 
            fontFamily: 'Trap-Bold, Arial, sans-serif', 
            fontSize: 'clamp(9px, 1.8vw, 12px)', 
            fontWeight: 400, 
            margin: 0, 
            color: '#FFF',
            lineHeight: '1.3'
          }}>
            We are the conspiracy that actually works
          </p>
        </div>

        {/* Footer text - right */}
        <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 text-right" style={{ zIndex: 20 }}>
          <p style={{ 
            fontFamily: 'Trap-Bold, Arial, sans-serif', 
            fontSize: 'clamp(9px, 1.8vw, 12px)', 
            fontWeight: 700, 
            margin: 0, 
            color: '#FFF',
            lineHeight: '1.3'
          }}>
            Established in 2016
          </p>
          <p style={{ 
            fontFamily: 'Trap-Bold, Arial, sans-serif', 
            fontSize: 'clamp(9px, 1.8vw, 12px)', 
            fontWeight: 700, 
            margin: 0, 
            color: 'var(--C2C-Green, #48BA86)',
            lineHeight: '1.3'
          }}>
            Code2Create 6.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
