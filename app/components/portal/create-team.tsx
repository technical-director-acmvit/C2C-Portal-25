"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { createTeam } from "../../actions/team";
import BackChevron from "./ui/back-chevron";
import PortalButton from "./ui/button";
import { usePortalStore } from "@/app/stores/portal";

interface Props {
  onBack?: () => void;
}
const CreateTeam = ({ onBack }: Props) => {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshDashboard = usePortalStore((s) => s.refreshDashboard);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleProceed = useCallback(async () => {
    if (!teamName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createTeam(teamName);
      // Refresh store state and let the page switch to dashboard
      await refreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setLoading(false);
    }
  }, [teamName, refreshDashboard]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && teamName.trim() && !loading) {
      e.preventDefault();
      void handleProceed();
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen relative overflow-hidden">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />

      {/* Centered card content (mobile-optimized, scrollable) */}
      <div className="flex items-center justify-center min-h-full px-4 py-6 sm:py-8 relative z-10 overflow-auto">
        <div
          className="w-full max-w-[22rem] sm:max-w-md md:max-w-lg lg:max-w-xl p-5 sm:p-6 md:p-8 rounded-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <BackChevron onClick={onBack} />
            <h1
              className="flex-1 min-w-0 text-white text-left whitespace-nowrap truncate"
              style={{
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(20px, 5.5vw, 28px)",
              }}
            >
              Enter Team Name
            </h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4 sm:mb-5">
            <input
              type="text"
              value={teamName}
              onChange={handleNameChange}
              onKeyDown={onKeyDown}
              placeholder="Team name"
              autoComplete="off"
              inputMode="text"
              className="w-full px-4 sm:px-5 py-3 rounded-full bg-[#111213]/60 border border-white/10 text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              style={{
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontSize: "clamp(14px, 4.2vw, 16px)",
                fontWeight: 400,
              }}
            />
          </div>

          <p
            className="text-gray-400 text-center mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(12px, 3.8vw, 14px)",
              fontFamily: "'Pilat Regular', Arial, sans-serif",
              fontWeight: 400,
            }}
          >
            The coolest team names get brownie points!
          </p>

          <div className="flex justify-center">
            <PortalButton
              onClick={handleProceed}
              disabled={!teamName.trim() || loading}
              className={`${teamName.trim() ? "" : "opacity-50 cursor-not-allowed"} w-full sm:w-auto px-5 sm:px-6 py-3 text-[clamp(15px,4.4vw,18px)]`}
            >
              {loading ? "Creating…" : "Proceed"}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
