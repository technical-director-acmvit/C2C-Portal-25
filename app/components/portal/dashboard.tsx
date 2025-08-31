"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import { Copy } from 'lucide-react';
import Form from './form';
import LeaveTeamModal from './leave-team-modal';
import { fetchDashboard, type DashboardResponse, type UserSummary } from '../../actions/dashboard';
import { leaveTeam } from "@/app/actions/team";

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchDashboard();
      if (!res.ok) {
        setError(res.error || "Failed to load dashboard");
      } else {
        setData(res.data ?? null);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchDashboard();
        if (!mounted) return;
        if (!res.ok) {
          setError(res.error || "Failed to load dashboard");
        } else {
          setData(res.data ?? null);
        }
      } catch (err) {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard"
          );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const team = data?.team ?? null;
  const track = data?.track ?? null;
  const currentUser = data?.user ?? null;
  const teammatesRef = data?.teammates; // keep raw reference; no default []

  const members = useMemo<UserSummary[]>(() => {
    const arr: UserSummary[] = currentUser ? [currentUser] : [];
    return teammatesRef ? arr.concat(teammatesRef) : arr;
  }, [currentUser, teammatesRef]);

  const needsSubmission = useMemo(() => {
    if (!team) return false;
    return !(team.github_url && team.figma_url && team.other && team.track_id);
  }, [team]);

  const handleLeaveTeam = async () => {
    if (!team) return;
    setLeaveProcessing(true);
    setError(null);
    try {
      const res = await leaveTeam();

      // If leaveTeam returns an object with .ok, respect it
      if (res && typeof res === "object" && "ok" in res && !res.ok) {
        throw new Error((res as any).error || "Failed to leave team");
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
      <div className="min-h-screen grid place-items-center text-white">
        Loading…
      </div>
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
      {/* Logo top left */}
      <div className="absolute top-6 left-18">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* Team Name Section */}
        <h1
          className="text-white mb-8"
          style={{
            fontSize: "48px",
            fontFamily: "'Pilat Extended', Arial, sans-serif",
            fontWeight: "700",
            letterSpacing: "2px",
          }}
        >
          {team?.name || "Your Team"}
        </h1>

        {/* Team Code Section */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className="border-2 border-white px-6 py-3 flex items-center gap-4"
            style={{ backgroundColor: "transparent" }}
          >
            <span
              className="text-white"
              style={{
                fontSize: "20px",
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: "400",
              }}
            >
              {team?.code || "— — — —"}
            </span>
          </div>
          <button
            className="border-2 border-white p-3 bg-transparent hover:bg-white/10 transition-colors"
            onClick={() => team?.code && navigator.clipboard?.writeText(team.code)}
          >
            <Copy className="w-5 h-5 text-white" />
          </button>
        </div>

        {members.length > 1 ? (
          <div className="flex gap-12 mb-8">
            {members.map((m: UserSummary, idx: number) => (
              <div
                key={`${m.id || "member"}-${idx}`}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border-2 border-white bg-transparent mb-2 flex items-center justify-center">
                  <Image
                    src="/portal/user.svg"
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="opacity-80"
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
                  {m.name || m.email}
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
                <span className="text-white font-semibold">{team.code}</span> to
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
          {!needsSubmission ? (
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
          )}
        </div>

        {/* Go to Form Button */}
        {needsSubmission && (
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
          <button
            className="px-8 py-4 rounded-lg text-white cursor-pointer"
            style={{
              backgroundColor: "#5EBF94",
              fontSize: "20px",
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: "400",
            }}
            onClick={() => setShowLeaveModal(true)}
            disabled={leaveProcessing}
          >
            Leave team
          </button>
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
