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
  no_active_round: React.ReactNode
}

export default function SlotRouter({ portal, dash, reject, no_active_round }: SlotRouterProps) {
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

  // Check if current team round and active round are the same (promotion eligibility)
  const currentTeamRound = dashboardData?.current_team_round;
  const activeRound = dashboardData?.active_round;
  
  // Determine rounds count: use current team round number + 1 to get total rounds participated
  // If team has a current_team_round, they've at least participated in that many rounds
  const roundsCount = currentTeamRound?.round_number !== undefined ? currentTeamRound.round_number + 1 : 0;
  if (!activeRound) {
    // If user is not found, show portal instead of "coming soon"
    if (userNotFound) {
      return <>{portal}</>;
    }
    
    if (PROMOTIONS_LIVE && currentTeamRound?.end_time) {
      const currentTime = new Date();
      const roundEndTime = new Date(currentTeamRound.end_time);
      
      if (currentTime > roundEndTime) {
        // return <>{reject}</>;
      } else {
        return <>{dash}</>;
      }
    }
    
    // return <>{no_active_round}</>;
  }
  const isPromoted = currentTeamRound?.id === activeRound?.id;


  const dontShowPromotions = !PROMOTIONS_LIVE;
  const shouldForcePortal = forcePortal || dontShowPromotions;

  const devOverride = process.env.NODE_ENV === "development" ? getDevRouteOverride() : "auto";
  
  let finalView: "portal" | "dash" | "reject" = "portal";

  // console.log("SlotRouter Debug:", { 
  //   roundsCount, 
  //   isPromoted, 
  //   PROMOTIONS_LIVE, 
  //   shouldForcePortal, 
  //   devOverride,
  //   currentTeamRoundId: currentTeamRound?.id,
  //   activeRoundId: activeRound?.id,
  //   currentTeamRoundNumber: currentTeamRound?.round_number,
  //   activeRoundNumber: activeRound?.round_number,
  //   userNotFound,
  //   forcePortal,
  //   dontShowPromotions
  // });
  
  if (!shouldForcePortal && roundsCount >= 1) {
    if (PROMOTIONS_LIVE) {
      finalView = isPromoted ? "dash" : "reject";
      // console.log("Promotion logic applied - finalView:", finalView);
    } else {
      finalView = "portal";
      // console.log("Promotions not live - showing portal");
    }
  } else {
    // console.log("Forcing portal due to shouldForcePortal or roundsCount < 1");
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