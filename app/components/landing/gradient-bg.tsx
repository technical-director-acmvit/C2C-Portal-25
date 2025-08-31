"use client";

interface GradientBGProps {
  children?: React.ReactNode;
  darken?: boolean;
}

const GradientBG = ({ children, darken = false }: GradientBGProps) => (
  <div className="w-full relative">
    {/* Section overlay only; page-wide gradient lives in app/page.tsx */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-[700px] h-[700px] bg-[conic-gradient(from_153deg_at_50%_50%,_#5EBF94_96deg,_#6DB1E2_263deg,_#29A37A_360deg)] rounded-full blur-[350px]" />
    {darken && (
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/20 via-black/55 to-black/20" />
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

export default GradientBG;
