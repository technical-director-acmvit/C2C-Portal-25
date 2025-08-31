"use client";

import React from "react";
import Image from "next/image";
import TopBar from "./top-bar";

const Landing = () => {
  return (
    <div className="min-h-[640px] h-screen w-full relative overflow-hidden bg-transparent">
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
          userSelect: "none",
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
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-screen-xl"
          style={{ zIndex: 10 }}
        >
          <h1 className="text-center text-hollow text-4xl sm:text-6xl lg:text-7xl md:text-6xl break-words hyphens-auto mb-2 sm:mb-4">
            Turning what if
          </h1>
          <h1 className="text-center break-words hyphens-auto text-hollow text-4xl sm:text-5xl lg:text-7xl md:text-6xl">
            into what's next
          </h1>
        </div>

        {/* Main logo positioned like rising sun from mountains - behind mountains */}
        <div
          className="absolute top-[50%] left-1/2 -translate-x-1/500 -translate-y-1/3 animate-floating"
          style={{ zIndex: 1 }}
        >
          <Image
            src="/landing/C2C Logo.svg"
            alt="Code2Create Main Logo"
            width={180}
            height={180}
            className="opacity-200 w-[40vw] h-[40vw] lg:w-[10vw] lg:h-[10vw] md:w-[20vw] md:h-[20vw] sm:w-[28vw] sm:h-[28vw] xs:w-[20vw] xs:h-[20vw]"
          />
        </div>
        <style jsx global>{`
          @keyframes floating {
            0% {
              transform: translate(-50%, 25%) translateY(0);
            }
            50% {
              transform: translate(-50%, 25%) translateY(-18px);
            }
            100% {
              transform: translate(-50%, 25%) translateY(0);
            }
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
            style={{
              maxHeight: "70vh",
              filter: "brightness(0.72) contrast(0.95)",
              minHeight: "180px",
            }}
          />
        </div>

        {/* Main tagline */}
        <div
          className="absolute left-1/2 -translate-x-1/2 px-4 w-full max-w-screen-xl flex flex-col items-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
          style={{ zIndex: 10, bottom: "8%" }}
        >
          {/* Top line */}
          <p className="tagline">
            Don&apos;t just code for the vibes, Code2Create.
          </p>

          {/* Reflected line */}
          <p className="tagline reflected-text mt-2">
            Don&apos;t just code for the vibes, Code2Create.
          </p>
        </div>

        {/* Footer text - left */}
        <div className="absolute bottom-4 left-3 sm:bottom-6 sm:left-6 z-20">
          <p
            className="font-bold text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            We are not just another{" "}
            <span className="text-[#48BA86] font-bold">hackathon</span>
          </p>
          <p
            className="font-normal text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            We are the conspiracy that actually works
          </p>
        </div>

        {/* Footer text - right */}
        <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 text-right z-20">
          <p
            className="font-bold text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            Established in 2016
          </p>
          <p
            className="font-bold text-[11px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-[#48BA86] leading-tight m-0"
            style={{
              fontFamily: "Trap-Bold, Arial, sans-serif",
            }}
          >
            Code2Create 6.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
