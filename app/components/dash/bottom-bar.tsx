"use client";
import React from "react";
import Image from "next/image";

export default function Bottombar() {
  return (
    <footer className="relative w-full bg-black py-3">
      <div className="relative flex items-center justify-between w-full px-1 sm:px-4">
        
        
        <div className="flex-shrink-0">
          <Image
            src="/dash/VIT LOGO.svg"
            alt="VIT Logo"
            width={150}
            height={70}
            className="w-[70px] sm:w-[90px] md:w-[120px] lg:w-[140px] h-auto"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Image
            src="/dash/powered.svg"
            alt="Powered by Runpod and ElevenLabs"
            width={300}
            height={200}
            className="w-[280px] sm:w-[450px] md:w-[400px] lg:w-[500px] h-auto"
          />
        </div>

        <div className="flex-shrink-0">
          <Image
            src="/dash/gravitas.svg"
            alt="Gravitas Logo"
            width={150}
            height={70}
            className="w-[70px] sm:w-[90px] md:w-[120px] lg:w-[140px] h-auto"
          />
        </div>
      </div>
    </footer>
  );
}
