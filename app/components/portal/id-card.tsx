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
   <div className="relative flex justify-center items-center">
      <div className="relative inline-block ml-4">
        <div className="flex flex-col justify-center items-center py-10 px-6 rounded-xl shadow-lg" style={{ background: "#1C1C1C", zIndex: 10 }}>
          <img src="/portal/c2clogo.svg" alt="logo" className="mb-4 w-16 h-16" />
          <h2 className="mb-4" style={{ color: '#48BA86', fontFamily: 'DM Sans', fontSize: '30px', fontWeight: 700 }}>{name}</h2>
          <p className="mb-1" style={{ color: '#ADDBC8', fontFamily: 'DM Sans', fontSize: '25px', fontWeight: 400, lineHeight: '63.161px' }}>{mailId}</p>
          <p style={{ color: '#ADDBC8', fontFamily: 'DM Sans', fontSize: '32px', fontWeight: 400, lineHeight: '63.161px' }}>{phone}</p>
        </div>
      </div>
   </div>
  );
};

export default IDCard;
