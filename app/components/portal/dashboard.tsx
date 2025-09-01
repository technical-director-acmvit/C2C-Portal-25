"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Copy } from "lucide-react";
import Form from "./form";
import PortalButton from "./ui/button";
import LeaveTeamModal from "./leave-team-modal";
import { type UserSummary } from "../../actions/dashboard";
import PortalLoader from "./portal-loader";
import BackChevron from "./ui/back-chevron";
import { cleanName } from "./nameUtils";
import { usePortalStore } from "@/app/stores/portal";
// import Profile from "./profile";

const Dashboard: React.FC = () => {
  const view = usePortalStore((s) => s.view);
  const data = usePortalStore((s) => s.dashboard);
  const error = usePortalStore((s) => s.error);
  const isLeaving = usePortalStore((s) => s.isLeaving);
  const leaveTeamFlow = usePortalStore((s) => s.leaveTeamFlow);
  const [showForm, setShowForm] = useState(false);
  // const [showProfile, setShowProfile] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const team = data?.team ?? null;
  const track = data?.track ?? null;
  const currentUser = data?.user ?? null;
  const teammatesRef = data?.teammates;
  const minTeamMembers = Number(data?.minmembercount ?? 2);
  const submissionOpen = Boolean(data?.submissionOpen);

  const members = useMemo<UserSummary[]>(() => {
    const arr: UserSummary[] = currentUser ? [currentUser] : [];
    return teammatesRef ? arr.concat(teammatesRef) : arr;
  }, [currentUser, teammatesRef]);

  const needsSubmission = useMemo(() => {
    if (!team) return false;
    const hasGithub =
      typeof team.github_url === "string" ? team.github_url.trim().length > 0 : Boolean(team.github_url);
    const hasFigma =
      typeof team.figma_url === "string" ? team.figma_url.trim().length > 0 : Boolean(team.figma_url);
    const hasOther =
      typeof team.other === "string" ? team.other.trim().length > 0 : Boolean(team.other);
    const hasTrack = Boolean(team.track_id);
    return !(hasGithub && hasFigma && hasOther && hasTrack);
  }, [team]);

  // All routing is managed by the portal store (view state).

  const handleLeaveTeam = async () => {
    if (!team) return;
    setShowLeaveModal(false);
    await leaveTeamFlow();
  };

  // Full-screen Form view
  if (showForm) {
    return (
      <div className="fixed inset-0 w-screen h-screen relative">
        {/* Background image via next/image */}
        <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
        <BackChevron className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10" />
        <div className="absolute top-6 right-6 sm:right-8 z-10">
          <button
            onClick={() => setShowForm(false)}
            className="px-3 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm sm:text-base"
            aria-label="Close form"
          >
            Close
          </button>
        </div>

        <div className="h-full w-full overflow-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Form />
          </div>
        </div>
      </div>
    );
  }

  // Profile view
  // if (showProfile) {
  //   return <Profile onBack={() => setShowProfile(false)} />;
  // }

  // If store hasn't loaded or view not ready, show a loader
  if (view === "loading" || !data) return <PortalLoader />;

  if (error)
    return (
      <div className="min-h-screen grid place-items-center text-red-400 p-4">
        <div className="text-center">{error}</div>
      </div>
    );

  // Continue rendering; parent will switch view when needed

  return (
    <div className="fixed inset-0 w-screen h-screen relative">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      {/* Navigation buttons */}
      <BackChevron className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10" />

      {/* Profile button */}
      {/* <div className="absolute top-6 right-6 sm:right-8">
        <button
          type="button"
          onClick={() => setShowProfile(true)}
          aria-label="Open profile"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Image src="/portal/user.svg" alt="User" width={28} height={28} />
        </button>
      </div> */}

      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-3 sm:px-6 lg:px-8 py-10 sm:py-20 overflow-auto relative z-10">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          <div className="w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-0 sm:bg-transparent sm:border-0 sm:backdrop-blur-0">
          {/* Team Name */}
          {team && (
            <h1
              className="text-white mb-4 sm:mb-6 text-center leading-tight max-w-[92vw] sm:max-w-3xl px-2 break-words"
              style={{
                fontSize: "clamp(22px, 7vw, 44px)",
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
              title={team.name}
            >
              {team.name}
            </h1>
          )}

          {/* Team Code (centered directly under team name) */}
          {team && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-1 mb-6 sm:mb-8 w-full max-w-md">
              <div className="text-white/80 text-xs uppercase tracking-wide text-center sm:text-left">Team Code</div>
              <div
                className="border-2 border-white px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-center rounded-md flex-1 sm:flex-none min-w-0"
                style={{ backgroundColor: "transparent" }}
              >
                <span
                  className="text-base sm:text-lg lg:text-xl text-center truncate"
                  style={{
                    color: "#48BA86",
                    fontFamily: "'Pilat Extended', Arial, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {team.code}
                </span>
              </div>

              <div className="relative">
                <button
                  className="border-2 border-white px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors rounded-md min-w-[48px] sm:min-w-[56px]"
                  onClick={async () => {
                    if (!team?.code) return;
                    try {
                      await navigator.clipboard.writeText(team.code);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 900);
                    } catch {
                      // noop
                    }
                  }}
                  aria-label="Copy team code"
                >
                  <Copy className={`w-4 h-4 sm:w-5 sm:h-5 ${copied ? "text-[#48BA86]" : "text-white"}`} />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 text-[11px] text-gray-300" aria-live="polite">
                  {copied ? "Copied" : ""}
                </div>
              </div>
            </div>
          )}

          {/* Separator */}
          <div className="w-full flex justify-center mb-4 sm:mb-8">
            <Image
              src="/portal/bar.svg"
              alt="separator"
              width={600}
              height={80}
              className="w-full max-w-[240px] sm:max-w-[360px] md:max-w-[480px] lg:max-w-[600px] h-4 sm:h-6 md:h-8 lg:h-10"
            />
          </div>

          {/* Members */}
          {team && members.length > 1 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-7 lg:gap-8 mb-8 sm:mb-12 w-full px-1 sm:px-2">
              {members.map((m: UserSummary, idx: number) => (
                <div key={`${m.id || "member"}-${idx}`} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-transparent mb-2 sm:mb-3 flex items-center justify-center shrink-0">
                    <Image src="/portal/user.svg" alt="User Profile" width={32} height={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  </div>
                  <span
                    className="text-white text-center leading-tight text-xs sm:text-sm md:text-base max-w-[36vw] sm:max-w-[180px] break-words"
                    style={{
                      fontFamily: "'Pilat Extended', Arial, sans-serif",
                      fontWeight: 400,
                    }}
                    title={cleanName(m.name || m.email)}
                  >
                    {cleanName(m.name || m.email)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            team && (
              <div className="mb-8 sm:mb-12 text-center text-gray-300 px-4 max-w-md" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                <p className="text-sm sm:text-base">No teammates yet — it&apos;s just you for now.</p>
                {team?.code && (
                  <p className="mt-2 text-sm sm:text-base">
                    Share your team code{" "}
                    <span className="font-semibold break-all" style={{ color: "#48BA86" }}>
                      {team.code}
                    </span>{" "}
                    to invite others.
                  </p>
                )}
              </div>
            )
          )}

          {/* Track & Submission Status */}
          <div className="text-gray-300 text-center mb-6 sm:mb-10 px-4 max-w-xl">
            {submissionOpen && (
              track?.title ? (
                <p className="text-sm sm:text-base mb-2" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                  <span className="text-white/80 mr-1">Track:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white break-words max-w-full">
                    {track.title}
                  </span>
                </p>
              ) : (
                <p style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }} className="text-yellow-300 text-sm sm:text-base mb-2">
                  No track selected yet
                </p>
              )
            )}

            {submissionOpen ? (
              members.length >= minTeamMembers && !needsSubmission ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs sm:text-sm" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                  Submission completed
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs sm:text-sm" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                  Submission pending
                </span>
              )
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3 sm:gap-6 w-full max-w-sm sm:static sticky bottom-4">
            {(members.length >= minTeamMembers && submissionOpen && needsSubmission) && (
              <button
                className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  backgroundColor: "#5EBF94",
                  fontSize: "clamp(16px, 4vw, 20px)",
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontWeight: 400,
                }}
                onClick={() => setShowForm(true)}
              >
                Go to form
              </button>
            )}

            {team && (
              <PortalButton
                onClick={() => setShowLeaveModal(true)}
                disabled={isLeaving}
                className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg lg:text-[20px] transition-all ${
                  isLeaving ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
                }`}
              >
                Leave team
              </PortalButton>
            )}
          </div>
          </div>
        </div>
      
        {/* Leave Team Modal */}
        <LeaveTeamModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={handleLeaveTeam}
          teamName={team?.name}
          isProcessing={isLeaving}
        />
      </div>
    </div>
  );
};

export default Dashboard;
