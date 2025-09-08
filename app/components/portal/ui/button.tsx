"use client";
import React from "react";

type PortalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const PortalButton = ({ children, className = "", ...rest }: PortalButtonProps) => {
  return (
    <button
      {...rest}
      className={
        `inline-flex items-center justify-center w-full sm:w-auto 
         px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 
         rounded-full text-white font-medium tracking-[0.6px] leading-[100%]
         bg-gradient-to-br from-[#48BA86] to-[#21543D]
         transition-colors hover:opacity-90 focus:outline-none 
         focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
         disabled:opacity-50 disabled:cursor-not-allowed ${className}`
      }
      style={{
        fontFamily: "'Pilat Regular', 'Trap', 'DM Sans', Arial, sans-serif",
        fontSize: "clamp(14px, 3.2vw, 18px)",
      }}
    >
      {children}
    </button>
  );
};

export default PortalButton;
