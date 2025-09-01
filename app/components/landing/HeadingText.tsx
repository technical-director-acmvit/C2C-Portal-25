"use client"

import React from 'react'

const HeadingText = ({ text }: { text: string }) => {
  return (
    <h1
      className="
        text-center
        break-words
        hyphens-auto
        text-hollow
        pt-20    
        sm:pt-28 
        md:pt-36 
        pb-8     
        px-4
      "
      style={{
        WebkitTextStroke: "2px #ffffff",
        fontFamily: "Trap-Bold, Arial, sans-serif",
        fontSize: "clamp(2rem, 8vw, 6rem)", // 32px → 96px
        fontWeight: 700,
        lineHeight: "clamp(110%, 6vw, 130%)",
        color: "transparent",
      }}
    >
      {text}
    </h1>
  )
}


export default HeadingText