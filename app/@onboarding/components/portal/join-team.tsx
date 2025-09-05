"use client";

import React, { useState } from "react";
import PortalButton from "./ui/button";
import { joinTeam } from "../../../actions/team";
import BackChevron from "./ui/back-chevron";
import Image from "next/image";
import { usePortalStore } from "@/app/stores/portal";

interface Props {
  onBack?: () => void;
}
const JoinTeam = ({ onBack }: Props) => {
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshDashboard = usePortalStore((s) => s.refreshDashboard);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamCode(e.target.value.toUpperCase());
  };

  const handleProceed = async () => {
    if (!teamCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await joinTeam(teamCode.trim());
      // Refresh store state and let the page switch to dashboard
      await refreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />

      {/* Centered card content */}
      <div className="flex items-center justify-center h-full px-4 relative z-10">
        <div
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            backdropFilter: "blur(10px) saturate(120%)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BackChevron onClick={onBack} />
            <h1
              className="text-white text-2xl sm:text-3xl"
              style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontWeight: 700 }}
            >
              Enter Team Code
            </h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={teamCode}
              onChange={handleCodeChange}
              placeholder="Enter the code"
              className="w-full px-5 py-3 rounded-full bg-[#111213]/60 border border-white/10 text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
              style={{
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
              }}
            />
          </div>

          <p
            className="text-gray-400 text-center mb-6"
            style={{
              fontSize: "14px",
              fontFamily: "'Pilat Regular', Arial, sans-serif",
              fontWeight: 400,
            }}
          >
            Enter team code to join your team
          </p>

          <div className="flex justify-center">
            <PortalButton
              onClick={handleProceed}
              disabled={!teamCode.trim() || loading}
              className={`${teamCode.trim() ? "" : "opacity-50 cursor-not-allowed"} px-6 py-2 text-[18px]`}
            >
              {loading ? "Joining…" : "Proceed"}
            </PortalButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;
