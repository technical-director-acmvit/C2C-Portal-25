"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";


interface IDCardProps {
  onBack?: () => void;
  name?: string;
  members?: [string, string, string, string]

}

const IDCardBack = ({ onBack, name = "TeamName", members = ["member1", "member2", "member3", "member4"] }: IDCardProps) => {


  return (
    <div className="relative flex justify-center items-center w-full max-w-[min(420px,90vw)]">
      <div className="relative inline-block ml-2 mr-2 w-full">
        <div className="flex flex-col justify-center items-center py-8 px-5 rounded-2xl shadow-lg w-full" style={{ background: "#1C1C1C", zIndex: 10 }}>
          <h2 className="mb-2 text-center" style={{ color: '#48BA86', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 'clamp(18px,4.8vw,24px)' }}>{name}</h2>
          <div className="w-full flex flex-col items-center">
            {members.map((member, idx) => (
              <p key={idx} className="mb-1 text-center" style={{ color: '#ADDBC8', fontFamily: 'DM Sans', fontWeight: 400, lineHeight: '1.5', fontSize: 'clamp(14px,4vw,18px)' }}>{member}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
