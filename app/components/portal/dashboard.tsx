"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import { Copy } from 'lucide-react';
import Form from './form';
import PortalButton from './ui/button';
import LeaveTeamModal from './leave-team-modal';
import { fetchDashboard, type DashboardResponse, type UserSummary } from '../../actions/dashboard';
import { leaveTeam } from "@/app/actions/team";
import PortalLoader from "./portal-loader";
import BackChevron from './ui/back-chevron';
import { cleanName } from './nameUtils';

interface DashboardProps {
  onTeamLeft?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTeamLeft }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
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
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard"
          );
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
      typeof team.github_url === "string"
        ? team.github_url.trim().length > 0
        : Boolean(team.github_url);
    const hasFigma =
      typeof team.figma_url === "string"
        ? team.figma_url.trim().length > 0
        : Boolean(team.figma_url);
    const hasOther =
      typeof team.other === "string"
        ? team.other.trim().length > 0
        : Boolean(team.other);
    const hasTrack = Boolean(team.track_id);
    return !(hasGithub && hasFigma && hasOther && hasTrack);
  }, [team]);

    console.log( minTeamMembers, submissionOpen, members.length );


  const handleLeaveTeam = async () => {
    if (!team) return;
    setLeaveProcessing(true);
    setError(null);
    try {
      const res = await leaveTeam();

      // If leaveTeam returns an object with .ok, respect it
      if (res && typeof res === "object" && "ok" in res && !(res as { ok: unknown }).ok) {
        const msg = ("error" in (res as Record<string, unknown>) && typeof (res as Record<string, unknown>).error === 'string')
          ? (res as Record<string, unknown>).error as string
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

  if (showForm)
    return (
      <div
        className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/portal/bg1.svg)" }}
      >
        <div className="flex items-center justify-center h-full">
          <Form onBack={() => setShowForm(false)} />
        </div>
      </div>
    );
  if (loading)
    return (
      <PortalLoader />
    );
  if (error)
    return (
      <div className="min-h-screen grid place-items-center text-red-400">
        {error}
      </div>
    );

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/portal/bg1.svg)" }}
    >
      <BackChevron className="absolute top-6 left-6" />

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* Team Name Section */}
        <h1
          className="text-white mb-4"
          style={{
            fontSize: "48px",
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: "700",
            letterSpacing: "2px",
          }}
        >
          {team?.name || "Your Team"}
        </h1>

        <div className="w-full flex justify-center mb-4">
          <Image src="/portal/bar.svg" alt="separator" width={600} height={80} className="w-auto max-w-[280px] sm:max-w-[440px] md:max-w-[600px] h-6 sm:h-8 md:h-10" />
        </div>

        {/* Team Code Section */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className="border-2 border-white px-4 sm:px-6 h-12 sm:h-14 flex items-center gap-4 rounded-md"
            style={{ backgroundColor: "transparent" }}
          >
            <span
              className="text-lg sm:text-xl"
              style={{
                color: '#48BA86',
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: "400",
              }}
            >
              {team?.code || "— — — —"}
            </span>
          </div>

          <div className="relative">
            <button
              className="border-2 border-white px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors rounded-md"
              onClick={async () => {
                if (!team?.code) return;
                try {
                  await navigator.clipboard.writeText(team.code);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 500);
                } catch (err) {
                }
              }}
              aria-label="Copy team code"
            >
              <Copy className={`w-5 h-5 ${copied ? 'text-[#48BA86]' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {members.length > 1 ? (
          <div className="flex gap-12 mb-8">
            {members.map((m: UserSummary, idx: number) => (
              <div
                key={`${m.id || "member"}-${idx}`}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-transparent mb-2 flex items-center justify-center">
                  <Image
                    src="/portal/user.svg"
                    alt="User Profile"
                    width={48}
                    height={48}
                  />
                </div>
                <span
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontFamily: "'Pilat Extended', Arial, sans-serif",
                    fontWeight: "400",
                  }}
                >
                  {cleanName(m.name || m.email)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mb-8 text-center text-gray-300"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
          >
            <p>No teammates yet — it’s just you for now.</p>
            {team?.code && (
              <p className="mt-2">
                Share your team code{" "}
                <span className="font-semibold" style={{ color: '#48BA86' }}>{team.code}</span> to
                invite others.
              </p>
            )}
          </div>
        )}

        {/* Track & status */}
        <div className="text-gray-300 text-center mb-6">
          {track?.title ? (
            <p style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
              Track: <span className="text-white">{track.title}</span>
            </p>
          ) : (
            <p
              style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
              className="text-yellow-300"
            >
              No track selected yet
            </p>
          )}

          {/* Only show submission status when submissions are open */}
          {submissionOpen ? (
            (members.length >= minTeamMembers && !needsSubmission) ? (
              <p
                className="text-green-300"
                style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
              >
                Submission completed
              </p>
            ) : (
              <p
                className="text-red-300"
                style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
              >
                Submission pending
              </p>
            )
          ) : null}
        </div>

        {/* Go to Form Button */}
        {(members.length >= minTeamMembers && submissionOpen && needsSubmission) && (
          <button
            className="px-8 py-4 rounded-lg text-white cursor-pointer mb-4"
            style={{
              backgroundColor: "#5EBF94",
              fontSize: "20px",
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: "400",
            }}
            onClick={() => setShowForm(true)}
          >
            Go to form
          </button>
        )}

        {/* Leave Team Button */}
        {team && (
          <div>
            <PortalButton
              onClick={() => setShowLeaveModal(true)}
              disabled={leaveProcessing}
              className={`px-6 py-2 text-[20px] ${leaveProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Leave team
            </PortalButton>
          </div>
        )}

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
