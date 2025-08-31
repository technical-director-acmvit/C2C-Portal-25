"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Copy } from "lucide-react";
import Form from "./form";
import PortalButton from "./ui/button";
import LeaveTeamModal from "./leave-team-modal";
import { fetchDashboard, type DashboardResponse, type UserSummary } from "../../actions/dashboard";
import { leaveTeam } from "@/app/actions/team";
import PortalLoader from "./portal-loader";
import BackChevron from "./ui/back-chevron";
import { cleanName } from "./nameUtils";
// import Profile from "./profile";

interface DashboardProps {
  onTeamLeft?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTeamLeft }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  // const [showProfile, setShowProfile] = useState(false);
  const [leaveProcessing, setLeaveProcessing] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const failover = setTimeout(() => {
      if (mounted) {
        setLoading(false);
        setError((prev) => prev ?? "Taking longer than expected. Please retry.");
      }
    }, 10000);

    (async () => {
      setLoading(true);
      try {
        const res = await fetchDashboard();
        if (!mounted) return;
        if (!res.ok) {
          setError(res.error || "Failed to load dashboard");
        } else {
          setError(null);
          setData(res.data ?? null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (mounted) setLoading(false);
        clearTimeout(failover);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(failover);
    };
  }, []);

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

  const handleLeaveTeam = async () => {
    if (!team) return;
    setLeaveProcessing(true);
    setError(null);
    try {
      const res = await leaveTeam();

      // If leaveTeam returns an object with .ok, respect it
      if (res && typeof res === "object" && "ok" in res && !(res as { ok: unknown }).ok) {
        const msg =
          "error" in (res as Record<string, unknown>) && typeof (res as Record<string, unknown>).error === "string"
            ? ((res as Record<string, unknown>).error as string)
            : "Failed to leave team";
        throw new Error(msg);
      }

      setShowLeaveModal(false);

      setData((prev) => (prev ? { ...prev, team: null } : null));

      const refreshed = await fetchDashboard();
      if (refreshed.ok) {
        if (!refreshed.data?.team) {
          onTeamLeft?.();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("team-left"));
          }
        } else {
          setData(refreshed.data);
          setError("We couldn't remove you from the team yet. Please try again.");
        }
      } else {
        onTeamLeft?.();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("team-left"));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave team");
    } finally {
      setLeaveProcessing(false);
    }
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

  if (loading) return <PortalLoader />;

  if (error)
    return (
      <div className="min-h-screen grid place-items-center text-red-400 p-4">
        <div className="text-center">{error}</div>
      </div>
    );

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
      <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 overflow-auto relative z-10">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Team Name */}
          <h1
            className="text-white mb-6 sm:mb-8 text-center leading-tight"
            style={{
              fontSize: "clamp(28px, 8vw, 48px)",
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {team?.name || "Your Team"}
          </h1>

          {/* Separator */}
          <div className="w-full flex justify-center mb-6 sm:mb-8">
            <Image
              src="/portal/bar.svg"
              alt="separator"
              width={600}
              height={80}
              className="w-full max-w-[240px] sm:max-w-[360px] md:max-w-[480px] lg:max-w-[600px] h-4 sm:h-6 md:h-8 lg:h-10"
            />
          </div>

          {/* Team Code */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full max-w-md">
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
                {team?.code || "— — — —"}
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
                    window.setTimeout(() => setCopied(false), 500);
                  } catch {
                    // noop
                  }
                }}
                aria-label="Copy team code"
              >
                <Copy className={`w-4 h-4 sm:w-5 sm:h-5 ${copied ? "text-[#48BA86]" : "text-white"}`} />
              </button>
            </div>
          </div>

          {/* Members */}
          {members.length > 1 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:justify-center gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 w-full">
              {members.map((m: UserSummary, idx: number) => (
                <div key={`${m.id || "member"}-${idx}`} className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-transparent mb-2 sm:mb-3 flex items-center justify-center">
                    <Image src="/portal/user.svg" alt="User Profile" width={32} height={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  </div>
                  <span
                    className="text-white text-center leading-tight text-sm sm:text-base"
                    style={{
                      fontFamily: "'Pilat Extended', Arial, sans-serif",
                      fontWeight: 400,
                      wordBreak: "break-word",
                    }}
                  >
                    {cleanName(m.name || m.email)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
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
          )}

          {/* Track & Submission Status */}
          <div className="text-gray-300 text-center mb-6 sm:mb-8 px-4 max-w-lg">
            {track?.title ? (
              <p className="text-sm sm:text-base mb-2" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                Track: <span className="text-white break-words">{track.title}</span>
              </p>
            ) : (
              <p style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }} className="text-yellow-300 text-sm sm:text-base mb-2">
                No track selected yet
              </p>
            )}

            {submissionOpen ? (
              members.length >= minTeamMembers && !needsSubmission ? (
                <p className="text-green-300 text-sm sm:text-base" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                  Submission completed
                </p>
              ) : (
                <p className="text-red-300 text-sm sm:text-base" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
                  Submission pending
                </p>
              )
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-sm">
            {(members.length >= minTeamMembers && submissionOpen && needsSubmission) && (
              <button
                className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
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
                disabled={leaveProcessing}
                className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg lg:text-[20px] transition-all ${
                  leaveProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                }`}
              >
                Leave team
              </PortalButton>
            )}
          </div>
        </div>

        {/* Leave Team Modal */}
        <LeaveTeamModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={handleLeaveTeam}
          teamName={team?.name}
          isProcessing={leaveProcessing}
        />
      </div>
    </div>
  );
};

export default Dashboard;
