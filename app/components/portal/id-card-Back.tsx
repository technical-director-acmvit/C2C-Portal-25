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
    <div className="relative flex justify-center items-center">
      <div className="relative inline-block ml-4">
        <div className="flex flex-col justify-center items-center py-14 px-13 rounded-xl shadow-lg w-full max-w-xs" style={{ background: "#1C1C1C", zIndex: 10 }}>
          <h2 className="mb-4" style={{ color: '#48BA86', fontFamily: 'DM Sans', fontSize: '30px', fontWeight: 700 }}>{name}</h2>
          <div className="w-full flex flex-col items-center">
            {members.map((member, idx) => (
              <p key={idx} className="mb-1" style={{ color: '#ADDBC8', fontFamily: 'DM Sans', fontSize: '25px', fontWeight: 400, lineHeight: '40px' }}>{member}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardBack;
