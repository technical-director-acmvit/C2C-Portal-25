"use client";
import Image from "next/image";

const GradientBG = () => (
  <Image
    src="/Landing/gradient.svg"
    alt="Gradient Background"
    fill
    priority
    style={{
      objectFit: "cover",
      zIndex: 0,
      pointerEvents: "none",
      userSelect: "none"
    }}
  />
);

export default GradientBG;