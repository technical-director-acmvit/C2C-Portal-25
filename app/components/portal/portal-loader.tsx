"use client";

import Lottie from "lottie-react";
import animationData from "@/public/portal/loader1.json" assert { type: "json" };
import Image from "next/image";

export default function PortalLoader({ size = 240 }: { size?: number }) {
  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      {/* Centered loader */}
      <div className="absolute inset-0 grid place-items-center">
        <div style={{ width: size, height: size }}>
          <Lottie animationData={animationData as object} loop autoplay />
        </div>
      </div>
    </div>
  );
}
