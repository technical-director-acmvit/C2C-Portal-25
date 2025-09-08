"use client"

import type React from "react"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PortalLoader from "@/app/components/portal/portal-loader";
import { getUserData } from "@/app/actions/user";
import type { GetUserResponse } from "@/types/user";
import { getDevRouteOverride } from "@/app/components/portal/dev-view-switcher";
import { PROMOTIONS_LIVE } from "@/lib/env";
import { fetchDashboard, type DashboardResponse } from "@/app/actions/dashboard";

interface SlotRouterProps {
  portal: React.ReactNode
  dash: React.ReactNode
  reject: React.ReactNode
}

export default function SlotRouter({ portal, dash, reject }: SlotRouterProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<GetUserResponse | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [forcePortal, setForcePortal] = useState(false);
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
        } else if (dashboardResponse.error) {
          setError(dashboardResponse.error);
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "User not found") {
            // Treat "User not found" as portal (no team/rounds)
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

  // Determine rounds count: if team or rounds are missing, treat as 0 rounds.
  const rounds = userData?.user?.team?.rounds ?? []
  const roundsCount = Array.isArray(rounds) ? rounds.length : 0

  // Check if current team round and active round are the same (promotion eligibility)
  const currentTeamRound = dashboardData?.current_team_round;
  const activeRound = dashboardData?.active_round;
  const isPromoted = currentTeamRound?.id === activeRound?.id;

  const dontShowPromotions = !PROMOTIONS_LIVE;
  const shouldForcePortal = forcePortal || dontShowPromotions;

  const devOverride = process.env.NODE_ENV === "development" ? getDevRouteOverride() : "auto";
  
  let finalView: "portal" | "dash" | "reject" = "portal";
  
  if (!shouldForcePortal && roundsCount > 1) {
    if (PROMOTIONS_LIVE) {
      finalView = isPromoted ? "dash" : "reject";
    } else {
      finalView = "portal";
    }
  }

  // Apply dev override if in development
  if (devOverride !== "auto") {
    finalView = devOverride === "dash" ? "dash" : "portal";
  }
  
  // Return the appropriate view
  if (finalView === "reject") {
    return <>{reject}</>;
  }
    
  return <>{finalView === "dash" ? dash : portal}</>;
}

