"use client";

const GradientBG = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-full relative">
    {/* Gradient background that blends with the page background */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-[700px] h-[700px] bg-[conic-gradient(from_153deg_at_50%_50%,_#5EBF94_96deg,_#6DB1E2_263deg,_#29A37A_360deg)] rounded-full blur-[350px]" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export default GradientBG;
