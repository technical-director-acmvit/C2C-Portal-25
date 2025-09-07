"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface HKBoxProps {
    onBack?: () => void;
}

const HKBox = ({ onBack }: HKBoxProps) => {

        return (
            <div
                className="relative m-4 sm:m-10 p-6 sm:p-20 w-full max-w-md sm:w-150 h-auto flex flex-col items-center justify-center text-center"
                style={{ border: '2px solid #48BA86', borderRadius: '8px' }}
            >
                <h2
                    style={{
                        color: '#FFF',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 700,
                        lineHeight: 'normal',
                        fontStyle: 'normal',
                        textAlign: 'center',
                    }}
                    className="mb-4 text-xl sm:text-2xl"
                >
                    Hackathon Kit
                </h2>
                <div
                    className="pt-6 pb-6 m-4 sm:pt-10 sm:pb-10 sm:m-10 w-full max-w-xs flex items-center justify-center text-center"
                    style={{
                        borderRadius: '17.121px',
                        border: '1.191px solid #48BA86',
                        background: 'linear-gradient(124deg, #1C7D8C 5.56%, #16B788 42.44%, #9BE8DC 86.89%)',
                    }}
                >
                    <h4 className="w-full text-center text-base sm:text-lg">Request Access</h4>
                </div>
                {/* Art SVG overflowing bottom right corner, responsive */}
                <img
                    src="/portal/art.svg"
                    alt="art"
                    className="absolute -bottom-9 -right-9 w-20 h-20 sm:-bottom-15 sm:-right-15 sm:w-32 sm:h-32 pointer-events-none select-none"
                />
            </div>
        );
  };
  
  export default HKBox;