"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface HKBoxProps {
    onBack?: () => void;
}

const HKBox = ({ onBack }: HKBoxProps) => {


        return (
            <div
                className="m-10 p-20 w-150 h-90 flex flex-col items-center justify-center text-center"
                style={{ border: '2px solid #48BA86', borderRadius: '8px' }}
            >
                <h2
                    style={{
                        color: '#FFF',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '26px',
                        fontWeight: 700,
                        lineHeight: 'normal',
                        fontStyle: 'normal',
                        textAlign: 'center',
                    }}
                    className="mb-6"
                >
                    Hackathon Kit
                </h2>
                <div
                    className="pt-10 pb-10 m-10 w-60 flex items-center justify-center text-center"
                    style={{
                        borderRadius: '17.121px',
                        border: '1.191px solid #48BA86',
                        background: 'linear-gradient(124deg, #1C7D8C 5.56%, #16B788 42.44%, #9BE8DC 86.89%)',
                    }}
                >
                    <h4 className="w-full text-center">Request Access</h4>
                </div>
            </div>
        );
  };
  
  export default HKBox;