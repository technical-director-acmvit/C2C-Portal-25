"use client";

export default function DashGradientBG() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {/* Base dark backdrop matching mock */}
      <div className="absolute inset-0 bg-[#0b0d0d]" />

      {/* Central emerald glow (top-center) */}
      <div
        className="absolute left-1/2 top-[24%] -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full opacity-70 blur-[160px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(52, 211, 153, 0.55) 0%, rgba(52, 211, 153, 0.30) 35%, rgba(52, 211, 153, 0.08) 60%, rgba(0,0,0,0) 75%)",
        }}
      />

      {/* Subtle cyan halo around the center for the teal feel */}
      <div
        className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[1300px] rounded-full opacity-35 blur-[180px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34, 211, 238, 0.45) 0%, rgba(34, 211, 238, 0.15) 45%, rgba(0,0,0,0) 72%)",
        }}
      />

      {/* Corner radial accents similar to mock decorations */}
      <div className="absolute -left-24 top-[28%] w-[520px] h-[520px] rounded-full blur-[150px] opacity-50"
        style={{ background: "radial-gradient(closest-side, rgba(34,211,238,0.55), rgba(34,211,238,0.05) 70%, transparent)" }} />

      <div className="absolute -right-24 bottom-[12%] w-[560px] h-[560px] rounded-full blur-[170px] opacity-45"
        style={{ background: "radial-gradient(closest-side, rgba(52,211,153,0.55), rgba(52,211,153,0.05) 70%, transparent)" }} />

      {/* Soft vignette to enhance contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 1200px at 50% 25%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </div>
  );
}
