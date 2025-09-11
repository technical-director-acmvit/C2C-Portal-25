"use client";

import Lottie from "lottie-react";
import animationData from "@/public/portal/loader1.json" assert { type: "json" };

export default function InlineLoader({ size = 120 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Lottie animationData={animationData as object} loop autoplay />
    </div>
  );
}

