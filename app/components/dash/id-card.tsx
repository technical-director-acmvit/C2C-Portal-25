"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";


interface IDCardProps {
  onBack?: () => void;
  name?: string;
  mailId?: string;
  phone?: string;

}

const IDCard = ({ onBack, name = "JohnDoe", mailId="acmvit@gmailcom", phone="9999999999" }: IDCardProps) => {


  return (
   <div className="relative flex justify-center items-center w-full max-w-[min(420px,90vw)]">
      <div className="relative inline-block ml-2 mr-2 w-full">
        <div className="flex flex-col justify-center items-center py-8 px-5 rounded-2xl shadow-lg w-full" style={{ background: "#1C1C1C", zIndex: 10 }}>
          <img src="/portal/c2clogo.svg" alt="logo" className="mb-3 w-14 h-14" />
          <h2 className="mb-2 text-center" style={{ color: '#48BA86', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 'clamp(18px,4.8vw,24px)' }}>{name}</h2>
          <p className="mb-1 text-center" style={{ color: '#ADDBC8', fontFamily: 'DM Sans', fontWeight: 400, lineHeight: '1.5', fontSize: 'clamp(14px,4vw,18px)' }}>{mailId}</p>
          <p className="text-center" style={{ color: '#ADDBC8', fontFamily: 'DM Sans', fontWeight: 500, lineHeight: '1.5', fontSize: 'clamp(16px,4.4vw,20px)' }}>{phone}</p>
        </div>
      </div>
   </div>
  );
};

export default IDCard;
