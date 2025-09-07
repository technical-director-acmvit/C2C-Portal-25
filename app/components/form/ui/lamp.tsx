"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function Lamp({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full min-h-screen bg-slate-950", className)}>
      {/* Lamp visuals - Absolute positioned at top */}
      <div className="absolute top-0 left-0 w-full h-[400px] z-10 pointer-events-none overflow-hidden">
        <div className="relative w-full scale-250 flex items-center justify-center">
          <div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-emerald-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] h-full left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-40 left-0 bg-slate-950 h-full bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </div>

          <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
          <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-emerald-500 opacity-50 blur-3xl"></div>
          <div className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-emerald-400 blur-2xl"></div>
          <div className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-emerald-400 "></div>
          <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
        </div>
      </div>

      {/* Background extension to ensure full coverage */}
      <div className="absolute inset-0 w-full h-full bg-slate-950 -z-10"></div>

      {/* Children content - Full width without restrictions */}
      <div className="relative z-20 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default function LampDemo({ children }: { children?: React.ReactNode }) {
  return (
    <Lamp>
      {children}
    </Lamp>
  );
}