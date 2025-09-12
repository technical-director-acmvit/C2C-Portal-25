"use client"

import type React from "react"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import PortalLoader from "@/app/components/portal/portal-loader";
import { getUserData } from "@/app/actions/user";
import type { GetUserResponse } from "@/types/user";
import { getDevRouteOverride } from "@/app/components/portal/dev-view-switcher";
import { fetchDashboard, type DashboardResponse } from "@/app/actions/dashboard";

interface SlotRouterProps {
  portal: React.ReactNode
  dash: React.ReactNode
  reject: React.ReactNode
  no_active_round: React.ReactNode
}

export default function SlotRouter({ portal, dash, reject, no_active_round }: SlotRouterProps) {
  const pathname = usePathname();
  // Do not render SlotRouter on integration pages to avoid background overlays (e.g., reject) beneath integration UIs
  if (typeof window !== "undefined" && pathname?.startsWith("/portal/integrations")) {
    return null;
  }
  const { data: session } = useSession();
  const [userData, setUserData] = useState<GetUserResponse | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [forcePortal, setForcePortal] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    
    const interval = setInterval(() => {
      forceUpdate({});
    }, 100); // Check for dev override changes
    
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    async function loadData() {
      try {
        // Fetch user data
        const userResponse = await getUserData();
        setUserData(userResponse as GetUserResponse);
        
        // Fetch dashboard data
        const dashboardResponse = await fetchDashboard();
        if (dashboardResponse.ok && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        } else if (dashboardResponse.status === 404) {
          // Treat missing user as portal flow
          setUserNotFound(true);
          setForcePortal(true);
        } else if (dashboardResponse.error) {
          setError(dashboardResponse.error);
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "User not found") {
            // Treat "User not found" as portal (no team/rounds)
            setUserNotFound(true);
            setForcePortal(true);
          } else {
            setError(err.message);
          }
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return <PortalLoader />
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading user data: {error}</div>
  }

  // Extract rounds from dashboard data
  const currentTeamRound = dashboardData?.current_team_round;
  const activeRound = dashboardData?.active_round;

  // If there is NO active round configured on the server right now
  // - If the user doesn't exist -> show portal
  // - Otherwise show the dedicated no_active_round slot
  if (!activeRound) {
    if (userNotFound) return <>{portal}</>;
    return <>{no_active_round}</>;
  }

  // If active round exists but the user/team has not participated in any round yet,
  // treat them as non-participants and keep them in the portal flow (not rejected).
  if (!currentTeamRound) {
    return <>{portal}</>;
  }

  // Core promotion logic:
  // - Before final round (4): never show reject/accept — keep users in dash if they have a team round
  // - In final round (4): rounds must match to show dash; otherwise show reject
  const roundsMatch = Boolean(currentTeamRound?.id && activeRound?.id && currentTeamRound.id === activeRound.id);
  const isFinalRound = (activeRound?.round_number === 4) || (activeRound?.name === "4");
  let finalView: "portal" | "dash" | "reject" = "dash";
  if (isFinalRound) {
    finalView = roundsMatch ? "dash" : "reject";
  } else {
    // Not final round: always show dash for participants, never reject
    finalView = "dash";
  }

  // Apply dev override if in development (keeps existing behavior)
  const devOverride = process.env.NODE_ENV === "development" ? getDevRouteOverride() : "auto";
  if (devOverride !== "auto") {
    finalView = devOverride === "dash" ? "dash" : "portal";
  }

  // Return the appropriate view
  if (finalView === "reject") return <>{reject}</>;
  if (finalView === "dash") return <>{dash}</>;
  return <>{portal}</>;
}
