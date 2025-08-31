"use client";

import Lottie from "lottie-react";
import animationData from "@/public/portal/loader1.json" assert { type: "json" };

export default function PortalLoader({ size = 240 }: { size?: number }) {
  return (
    <div className="min-h-screen grid place-items-center">
      <div style={{ width: size, height: size }}>
        <Lottie animationData={animationData as any} loop autoplay />
      </div>
    </div>
  );
}
