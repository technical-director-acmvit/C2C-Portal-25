"use client";

import { useEffect, useLayoutEffect } from "react";
import TopBar from "@/app/components/dash/top-bar";
import Image from "next/image";
import BentoGrid from "@/app/components/dash/bento-grid";
import ProfileView from "@/app/components/dash/profile";
import GithubView from "@/app/components/portal/github/github-view";
import { useDashStore } from "@/app/stores/dash";
import DashGradientBG from "@/app/components/dash/gradient-bg";
import PortalLoader from "@/app/components/portal/portal-loader";
import { FormContent } from "@/app/changingtoarandompath/form/page";
import { LampOverlay } from "@/app/components/form/ui/lamp";
import BottomBar from "@/app/components/dash/bottom-bar";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import BackChevron from "@/app/components/portal/ui/back-chevron";
import BlockRoomModal from "@/app/components/portal/block_room";
import FinalPitchModal from "@/app/components/dash/final-pitch-modal";
import React from "react";

export default function DashPage() {
  useLayoutEffect(() => {
    // Your layout effects here
  }, []);
  const view = useDashStore((s) => s.view);
  const initialize = useDashStore((s) => s.initialize);
  const loading = useDashStore((s) => s.loading);
  const setView = useDashStore((s) => s.setView);
  const dashboard = useDashStore((s) => s.dashboard);
  const [showFinalModal, setShowFinalModal] = React.useState(false);

  // Show final pitch notice ONLY when user's current round matches active round AND it's the final round (4)
  const currentRound = dashboard?.current_team_round;
  const activeRound = dashboard?.active_round;
  const roundsMatch = Boolean(
    currentRound?.id && activeRound?.id && currentRound.id === activeRound.id
  );
  const showFinalPitchNotice =
    roundsMatch && (activeRound?.round_number === 4 || activeRound?.name === "4");

  React.useEffect(() => {
    if (showFinalPitchNotice) setShowFinalModal(true);
  }, [showFinalPitchNotice]);

  // Check if user needs to provide room details
  const user = dashboard?.user;
  const needsRoomDetails = Boolean(
    user?.internal === true &&
    user.hosteller !== false &&
    (!user.room_number || !user.block)
  );

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <div className="relative w-full min-h-screen">
      <DashGradientBG />

      {/* Full-screen loader overlay */}
      {loading && <PortalLoader />}

      <TopBar />

      <main
        className={
          view === "profile"
            ? "relative z-10 w-full px-0 md:px-4 py-4 md:py-6 max-w-none"
            : "relative z-10 container mx-auto px-4 py-6 max-w-7xl"
        }
      >
            {(view === "form" || view === "profile") && <LampOverlay />}
            {/* Header Section - only on home view */}
            {view === "home" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    aria-label="Log out"
                    title="Log out"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="group inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <LogOut className="h-5 w-5 sm:h-6 sm:w-6 opacity-90 group-hover:opacity-100" />
                  </button>
                </div>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 relative flex-shrink-0 pt-2">
                      <Image
                        src="/landing/C2C Logo.svg"
                        alt="Code2Create Main Logo"
                        width={400}
                        height={400}
                        className=""
                        priority
                      />
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl text-white">Code2Create</h1>
                  </div>
                </div>
              </>
            )}
            {view === "home" && <BentoGrid />}
            {view === "github" && (
              <div className="relative z-20">
                {/* Back controls matching Profile/Form styling */}
                <div className="w-full flex items-center justify-start px-3 sm:px-4 pt-4">
                  <div className="md:hidden">
                    <BackChevron onClick={() => setView("home")} />
                  </div>
                  <button
                    onClick={() => setView("home")}
                    className="hidden md:inline-flex px-4 py-2 rounded-full border border-emerald-500 text-white hover:bg-emerald-600/20"
                  >
                    Back
                  </button>
                </div>
                {/* Reuse the GitHub view component within dash */}
                <GithubView onBack={() => setView("home")} hasTeam={Boolean(dashboard?.team)} noBackground />
              </div>
            )}
            {view === "profile" && <ProfileView />}
            {view === "form" && (
              <div className="relative z-20">
                {/* Back controls matching Profile view styling */}
                <div className="w-full flex items-center justify-start px-3 sm:px-4 pt-4">
                  <div className="md:hidden">
                    <BackChevron onClick={() => setView("home")} />
                  </div>
                  <button
                    onClick={() => setView("home")}
                    className="hidden md:inline-flex px-4 py-2 rounded-full border border-emerald-500 text-white hover:bg-emerald-600/20"
                  >
                    Back
                  </button>
                </div>
                <FormContent />
              </div>
            )}

      </main>

      <div className="relative z-10 mt-12">
        <BottomBar />
      </div>

      {/* DevViewSwitcher now rendered globally via portal layout */}
      
      {/* Room Details Modal - appears on top of everything */}
      <BlockRoomModal 
        isOpen={needsRoomDetails} 
        onSuccess={initialize}
      />

      {/* Final pitch announcement modal */}
      <FinalPitchModal isOpen={showFinalModal} onClose={() => setShowFinalModal(false)} />
    </div>
  );
}
