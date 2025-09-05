"use client";
import React from "react";

type PortalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const PortalButton = ({ children, className = "", ...rest }: PortalButtonProps) => {
  return (
    <button
      {...rest}
      className={`px-12 py-3 rounded-full text-white text-[24px] font-normal hover:opacity-90 transition-opacity bg-gradient-to-br from-[#48BA86] to-[#21543D] border-0 tracking-[0.6px] leading-[100%] ${className}`}
      style={{ fontFamily: "'Pilat Regular', 'Trap', 'DM Sans', Arial, sans-serif" }}
    >
      {children}
    </button>
  );
};

export default PortalButton;
