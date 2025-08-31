"use client";
import Image from "next/image";

const GradientBG = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-full relative">
    <Image
      src="/landing/gradient.svg"
      alt="Gradient Background"
      fill
      priority
      style={{
        objectFit: "cover",
        zIndex: -1, //peeche rahiyo tu
        pointerEvents: "none",
        userSelect: "none"
      }}
    />
    {children}
  </div>
);

export default GradientBG;
