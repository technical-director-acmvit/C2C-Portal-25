"use client";
import React from "react";
import Image from "next/image";

export default function Bottombar() {
  return (
    <footer className="relative w-full bg-black py-2">
      <div className="relative flex items-center justify-between w-full px-1 sm:px-4">
        
        
        <div className="flex-shrink-0">
          <Image
            src="/dash/VIT LOGO.svg"
            alt="VIT Logo"
            width={150}
            height={70}
            className="w-[60px] sm:w-[90px] md:w-[120px] lg:w-[140px] h-auto"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Image
            src="/dash/powered.svg"
            alt="Powered by Runpod and ElevenLabs"
            width={260}
            height={100}
            className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[350px] h-auto"
          />
        </div>
        
        <div className="flex-shrink-0">
          <Image
            src="/dash/gravitas.svg"
            alt="Gravitas Logo"
            width={150}
            height={70}
            className="w-[60px] sm:w-[90px] md:w-[120px] lg:w-[140px] h-auto"
          />
        </div>
      </div>
    </footer>
  );
}
