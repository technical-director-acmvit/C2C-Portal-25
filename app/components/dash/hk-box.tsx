"use client";

import React from "react";
import Image from "next/image";
import { getTeamSponsorCodes, requestSponsorCode, SponsorCode } from "@/app/actions/sponsor";

const HKBox = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState<string | null>(null);

  // Try to pre-load an existing code for the team
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const codes = await getTeamSponsorCodes();
        if (!mounted) return;
        if (Array.isArray(codes) && codes.length > 0) {
          // Prefer an approved code if present, else fall back to first
          const approved = codes.find(c => (c.status || "").toLowerCase() === "approved");
          setCode((approved ?? codes[0]).code);
        }
      } catch (e) {
        // Silent on init; users can still click to fetch
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = async () => {
    setError(null);
    // If we already have a code, just render it
    if (code) return;
    setLoading(true);
    try {
      // Try pulling existing first (race-safe if multiple clicks)
      const existing = await getTeamSponsorCodes();
      const picked: SponsorCode | undefined = Array.isArray(existing) && existing.length > 0
        ? (existing.find(c => (c.status || "").toLowerCase() === "approved") ?? existing[0])
        : undefined;
      if (picked) {
        setCode(picked.code);
        return;
      }
      // If none, request a new one for this team
      const created = await requestSponsorCode();
      setCode(created.code);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative m-4 sm:m-8 p-6 md:p-10 lg:p-12 w-full max-w-3xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl h-auto flex flex-col items-center justify-center text-center border-2 border-emerald-500 rounded-3xl sm:rounded-[32px] bg-black/20 backdrop-blur-sm"
    >
      <h2
        className="mb-4 text-white"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 700,
          lineHeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'center',
          fontSize: 'clamp(18px, 4.5vw, 28px)'
        }}
      >
        Hackathon Kit
      </h2>

      <button
        onClick={handleClick}
        disabled={loading}
        className="mt-2 mb-4 w-full max-w-md sm:max-w-lg md:max-w-2xl flex items-center justify-center text-center px-6 py-6 md:py-8 lg:py-10 rounded-[24px] border disabled:opacity-60"
        style={{
          borderColor: '#48BA86',
          background: 'linear-gradient(124deg, #1C7D8C 5.56%, #16B788 42.44%, #9BE8DC 86.89%)',
        }}
      >
        {!code ? (
          <h4 className="w-full text-center text-black" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
            {loading ? 'Fetching…' : 'Request Access'}
          </h4>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="text-black" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>Your Sponsor Code</div>
            <div
              className="px-4 py-2 rounded-xl border border-black/20 bg-white/70 text-black font-semibold tracking-widest"
              style={{ fontSize: 'clamp(16px, 4vw, 24px)' }}
              onClick={(e) => { e.preventDefault(); navigator.clipboard?.writeText(code).catch(() => {}); }}
              title="Click to copy"
            >
              {code}
            </div>
            <div className="text-black/70" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)' }}>Tap code to copy</div>
          </div>
        )}
      </button>

      {error && (
        <div className="mt-2 text-red-300 text-sm">{error}</div>
      )}

      {/* Decorative art */}
      <div className="absolute -bottom-9 -right-9 sm:-bottom-12 sm:-right-12 pointer-events-none select-none">
        <Image
          src="/portal/art.svg"
          alt="art"
          width={112}
          height={112}
          className="w-20 h-20 sm:w-28 sm:h-28"
          priority={false}
        />
      </div>
    </div>
  );
};

export default HKBox;
