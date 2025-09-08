"use client";

import React from "react";
import Image from "next/image";

const HKBox = () => {
  return (
    <div
      className="relative m-4 sm:m-8 p-6 md:p-10 lg:p-12 w-full max-w-3xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl h-auto flex flex-col items-center justify-center text-center border-2 border-emerald-500 rounded-3xl sm:rounded-[32px] bg-black/20 backdrop-blur-sm"
    >
      <h2
        className="mb-4 text-white"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 700,
          lineHeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'center',
          fontSize: 'clamp(18px, 4.5vw, 28px)'
        }}
      >
        Hackathon Kit
      </h2>
      <div
        className="mt-2 mb-4 w-full max-w-md sm:max-w-lg md:max-w-2xl flex items-center justify-center text-center px-6 py-6 md:py-8 lg:py-10 rounded-[24px] border"
        style={{
          borderColor: '#48BA86',
          background: 'linear-gradient(124deg, #1C7D8C 5.56%, #16B788 42.44%, #9BE8DC 86.89%)',
        }}
      >
        <h4 className="w-full text-center text-black" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>Request Access</h4>
      </div>
      {/* Decorative art */}
      <div className="absolute -bottom-9 -right-9 sm:-bottom-12 sm:-right-12 pointer-events-none select-none">
        <Image
          src="/portal/art.svg"
          alt="art"
          width={112}
          height={112}
          className="w-20 h-20 sm:w-28 sm:h-28"
          priority={false}
        />
      </div>
    </div>
  );
};
  
  export default HKBox;
