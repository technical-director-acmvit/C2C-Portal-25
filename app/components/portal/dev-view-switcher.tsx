"use client";

import React, { useState } from "react";
import { usePortalStore } from "@/app/stores/portal";
import { useDashStore } from "@/app/stores/dash";
import type { DashboardResponse } from "@/app/actions/dashboard";

type View = "loading" | "signup" | "team" | "dashboard" | "github" | "error";
type DashView = "home" | "profile";
type RouteOverride = "auto" | "portal" | "dash";

const createDevStore = () => {
  let routeOverride: RouteOverride = "auto";
  let listeners: (() => void)[] = [];
  
  return {
    getRouteOverride: () => routeOverride,
    setRouteOverride: (override: RouteOverride) => {
      routeOverride = override;
      listeners.forEach(fn => fn());
    },
    subscribe: (fn: () => void) => {
      listeners.push(fn);
      return () => {
        listeners = listeners.filter(l => l !== fn);
      };
    }
  };
};

// Replace the IIFE with a typed, client-only init
type DevStore = {
  getRouteOverride: () => RouteOverride;
  setRouteOverride: (override: RouteOverride) => void;
  subscribe: (fn: () => void) => () => void;
};

let devStore: DevStore | null = null;

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const w = window as Window & { __devStore?: DevStore };
  if (!w.__devStore) {
    w.__devStore = createDevStore();
  }
  devStore = w.__devStore as DevStore;
}

const useDevStore = () => {
  const [, forceUpdate] = useState({});
  
  React.useEffect(() => {
    if (!devStore) return;
    
    const unsubscribe = devStore.subscribe(() => {
      forceUpdate({});
    });
    
    return unsubscribe;
  }, []);
  
  return devStore ? {
    routeOverride: devStore.getRouteOverride(),
    setRouteOverride: devStore.setRouteOverride
  } : {
    routeOverride: "auto" as RouteOverride,
    setRouteOverride: () => {}
  };
};

export const getDevRouteOverride = (): RouteOverride => {
  return devStore ? devStore.getRouteOverride() : "auto";
};

const mockDashboardStates = {
  teamWithSubmissionOpen: {
    user: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      contact_number: "1234567890",
      gender: "male",
      reg_no: "21BCE1234",
      internal: true,
    },
    team: {
      id: "team1",
      name: "Team Alpha",
      code: "ABC123",
      track_id: "track1",
    },
    teammates: [
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        contact_number: "0987654321",
        gender: "female",
        reg_no: "21BCE5678",
        internal: true,
      },
    ],
    track: {
      id: "track1",
      title: "Web Development",
      description: "Build amazing web applications",
    },
    minmembercount: 2,
    c2chappening: true,
    submitted: false,
  } as DashboardResponse,

  // Team that already submitted
  teamSubmitted: {
    user: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      contact_number: "1234567890",
      gender: "male",
      reg_no: "21BCE1234",
      internal: true,
    },
    team: {
      id: "team1",
      name: "Team Beta",
      code: "XYZ789",
      track_id: "track1",
    },
    teammates: [
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        contact_number: "0987654321",
        gender: "female",
        reg_no: "21BCE5678",
        internal: true,
      },
    ],
    track: {
      id: "track1",
      title: "AI/ML",
      description: "Artificial Intelligence and Machine Learning",
    },
    minmembercount: 2,
    c2chappening: true,
    submitted: true,
  } as DashboardResponse,

  // Solo team (less than min members)
  soloTeam: {
    user: {
      id: "1",
      name: "Solo Player",
      email: "solo@example.com",
      contact_number: "1234567890",
      gender: "male",
      reg_no: "21BCE9999",
      internal: true,
    },
    team: {
      id: "team2",
      name: "Solo Team",
      code: "SOLO01",
    },
    teammates: [],
    track: null,
    minmembercount: 2,
    c2chappening: true,
    submitted: false,
  } as DashboardResponse,

  // Submissions closed
  submissionsClosed: {
    user: {
      id: "1",
      name: "Early Bird",
      email: "early@example.com",
      contact_number: "1234567890",
      gender: "male",
      reg_no: "21BCE0001",
      internal: true,
    },
    team: {
      id: "team3",
      name: "Early Team",
      code: "EARLY1",
    },
    teammates: [
      {
        id: "2",
        name: "Partner",
        email: "partner@example.com",
        contact_number: "0987654321",
        gender: "female",
        reg_no: "21BCE0002",
        internal: true,
      },
    ],
    track: null,
    minmembercount: 2,
    c2chappening: false, // Submissions closed
    submitted: false,
  } as DashboardResponse,

  // External user
  externalUser: {
    user: {
      id: "1",
      name: "External User",
      email: "external@example.com",
      contact_number: "1234567890",
      gender: "female",
      internal: false,
      college_name: "MIT",
    },
    team: {
      id: "team4",
      name: "External Team",
      code: "EXT123",
    },
    teammates: [],
    track: null,
    minmembercount: 2,
    c2chappening: true,
    submitted: false,
  } as DashboardResponse,

  // Large team (many members)
  largeTeam: {
    user: {
      id: "1",
      name: "Team Leader",
      email: "leader@example.com",
      contact_number: "1234567890",
      gender: "male",
      reg_no: "21BCE1111",
      internal: true,
    },
    team: {
      id: "team5",
      name: "The Avengers",
      code: "AVENGRZ",
      track_id: "track2",
    },
    teammates: [
      { id: "2", name: "Iron Man", email: "tony@stark.com", contact_number: "111", gender: "male", reg_no: "21BCE0001", internal: true },
      { id: "3", name: "Captain America", email: "steve@rogers.com", contact_number: "222", gender: "male", reg_no: "21BCE0002", internal: true },
      { id: "4", name: "Black Widow", email: "natasha@romanoff.com", contact_number: "333", gender: "female", reg_no: "21BCE0003", internal: true },
      { id: "5", name: "Thor", email: "thor@asgard.com", contact_number: "444", gender: "male", reg_no: "21BCE0004", internal: true },
      { id: "6", name: "Hulk", email: "bruce@banner.com", contact_number: "555", gender: "male", reg_no: "21BCE0005", internal: true },
    ],
    track: {
      id: "track2",
      title: "Mobile Development",
      description: "Build amazing mobile applications",
    },
    minmembercount: 2,
    c2chappening: true,
    submitted: false,
  } as DashboardResponse,

  // Incomplete profile (missing contact/gender)
  incompleteProfile: {
    user: {
      id: "1",
      name: "Incomplete User",
      email: "incomplete@example.com",
      internal: true,
      reg_no: "21BCE1111",
      // Missing contact_number and gender
    },
    team: null,
    teammates: [],
    track: null,
    minmembercount: 2,
    c2chappening: true,
    submitted: false,
  } as DashboardResponse,

  // No team
  noTeam: {
    user: {
      id: "1",
      name: "Teamless User",
      email: "teamless@example.com",
      contact_number: "1234567890",
      gender: "male",
      reg_no: "21BCE2222",
      internal: true,
    },
    team: null,
    teammates: [],
    track: null,
    minmembercount: 2,
    c2chappening: true,
    submitted: false,
  } as DashboardResponse,
};

type MockState = keyof typeof mockDashboardStates;

const DevViewSwitcher: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const view = usePortalStore((state) => state.view);
  // const setView = usePortalStore((state) => state.setView);
  const dashboard = usePortalStore((state) => state.dashboard);
  
  // Dash store
  const dashView = useDashStore((state) => state.view);
  const setDashView = useDashStore((state) => state.setView);
  
  // Dev route override
  const { routeOverride, setRouteOverride } = useDevStore();

  const handleViewChange = (newView: View) => {
    if (newView === "loading") {
      usePortalStore.setState({ view: newView, loading: true });
    } else if (newView === "error") {
      usePortalStore.setState({ 
        view: newView, 
        error: "Development error state", 
        loading: false 
      });
    } else if (newView === "signup") {
      usePortalStore.setState({ 
        view: newView, 
        dashboard: null, 
        error: null, 
        loading: false 
      });
    } else if (newView === "team") {
      usePortalStore.setState({ 
        view: newView, 
        dashboard: mockDashboardStates.noTeam, 
        error: null, 
        loading: false 
      });
    } else {
      usePortalStore.setState({ 
        view: newView, 
        error: null, 
        loading: false 
      });
    }
  };

  const handleMockDataChange = (mockState: MockState) => {
    // Directly update the store with mock data
    const mockData = mockDashboardStates[mockState];
    usePortalStore.setState({ 
      dashboard: mockData,
      view: "dashboard",
      error: null,
      loading: false
    });
  };

  const resetToActual = async () => {
    // Reset and reinitialize with actual data
    const store = usePortalStore.getState();
    await store.initialize();
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white text-xs max-w-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left font-semibold mb-2 hover:text-emerald-300 transition-colors"
      >
        🛠️ Dev Controls {isExpanded ? "▼" : "▶"}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          {/* Current State */}
          <div className="text-emerald-300 font-medium">
            Route: {routeOverride} | Portal: {view} | Dash: {dashView}
          </div>
          
          {/* Route Override Controls */}
          <div>
            <div className="font-medium mb-1">Force Route:</div>
            <div className="grid grid-cols-3 gap-1">
              {(["auto", "portal", "dash"] as RouteOverride[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRouteOverride(r)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    routeOverride === r
                      ? "bg-yellow-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          {/* View Switcher */}
          <div>
            <div className="font-medium mb-1">Switch View:</div>
            <div className="grid grid-cols-2 gap-1">
              {(["loading", "signup", "team", "dashboard", "github", "error"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    view === v
                      ? "bg-emerald-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-gray-300"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Dash View Switcher */}
          <div>
            <div className="font-medium mb-1">Dash Views:</div>
            <div className="grid grid-cols-2 gap-1">
              {(["home", "profile"] as DashView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setDashView(v)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    dashView === v
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-gray-300"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Mock Dashboard States */}
          <div>
            <div className="font-medium mb-1">Dashboard States:</div>
            <div className="space-y-1">
              {Object.keys(mockDashboardStates).map((key) => (
                <button
                  key={key}
                  onClick={() => handleMockDataChange(key as MockState)}
                  className="block w-full text-left px-2 py-1 rounded text-xs bg-blue-600/20 hover:bg-blue-600/40 transition-colors"
                >
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={resetToActual}
            className="w-full px-2 py-1 rounded text-xs bg-orange-600/20 hover:bg-orange-600/40 transition-colors"
          >
            🔄 Reset to Actual Data
          </button>

          {/* Current Dashboard Info */}
          {dashboard && (
            <div className="text-xs text-gray-400 border-t border-white/10 pt-2">
              <div>User: {dashboard.user?.name || "None"}</div>
              <div>Team: {dashboard.team?.name || "None"}</div>
              <div>Submitted: {dashboard.submitted ? "Yes" : "No"}</div>
              <div>C2C Open: {dashboard.c2chappening ? "Yes" : "No"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevViewSwitcher;