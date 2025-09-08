"use client";

import { create } from "zustand";
import { fetchDashboard, type DashboardResponse } from "@/app/actions/dashboard";
import { checkWhitelist } from "@/app/actions/whitelist";
import { leaveTeam as apiLeaveTeam } from "@/app/actions/team";

type View = "loading" | "signup" | "team" | "dashboard" | "github" | "error";

type PortalState = {
  view: View;
  loading: boolean;
  error: string | null;
  dashboard: DashboardResponse | null;
  isLeaving: boolean;
  whitelistChecked: boolean;
  isWhitelisted: boolean;

  initialize: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  leaveTeamFlow: () => Promise<void>;
  setView: (v: View) => void;
  setError: (e: string | null) => void;
  verifyWhitelist: () => Promise<void>;
};

function decideViewFromDashboard(d: DashboardResponse | null): View {
  if (!d) return "loading";
  const u = d.user;
  if (!u) return "signup";
  const isInternal = typeof u.internal === "boolean" ? u.internal : undefined;
  const hasCore = Boolean(u.contact_number) && Boolean(u.gender);
  const hasInternal = Boolean(u.reg_no);
  const hasExternal = Boolean(u.college_name);
  const profileComplete =
    hasCore && (isInternal === true ? hasInternal : isInternal === false ? hasExternal : false);
  if (!profileComplete) return "signup";
  const hasTeam = Boolean(d.team);
  return hasTeam ? "dashboard" : "team";
}

export const usePortalStore = create<PortalState>((set, get) => ({
  view: "loading",
  loading: true,
  error: null,
  dashboard: null,
  isLeaving: false,
  whitelistChecked: false,
  isWhitelisted: true,

  setView: (v) => set({ view: v }),
  setError: (e) => set({ error: e }),

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      // Kick off whitelist check immediately when portal mounts
      void get().verifyWhitelist();

      const res = await fetchDashboard();
      if (!res.ok) {
        const v: View = res.status === 404 || res.status === 401 ? "signup" : "error";
        set({ view: v, loading: false, error: res.error ?? null, dashboard: null });
        return;
      }
      const dashboard = res.data ?? null;
      const view = decideViewFromDashboard(dashboard);
      set({ dashboard, view, loading: false, error: null });
    } catch (err) {
      set({
        view: "error",
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load",
      });
    }
  },

  refreshDashboard: async () => {
    try {
      const res = await fetchDashboard();
      if (!res.ok) {
        set({ error: res.error ?? "Failed to refresh" });
        return;
      }
      const dashboard = res.data ?? null;
      const view = decideViewFromDashboard(dashboard);
      set({ dashboard, view, error: null });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to refresh" });
    }
  },

  leaveTeamFlow: async () => {
    if (get().isLeaving) return;
    set({ isLeaving: true, error: null });
    try {
      const res = await apiLeaveTeam();
      if (res && typeof res === "object" && "ok" in res && !(res as { ok: unknown }).ok) {
        const msg =
          "error" in (res as Record<string, unknown>) &&
          typeof (res as Record<string, unknown>).error === "string"
            ? ((res as Record<string, unknown>).error as string)
            : "Failed to leave team";
        throw new Error(msg);
      }

      const prev = get().dashboard;
      set({ dashboard: prev ? { ...prev, team: null, teammates: [] } : prev, view: "team" });

      await get().refreshDashboard();
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to leave team" });
      await get().refreshDashboard();
    } finally {
      set({ isLeaving: false });
    }
  },

  verifyWhitelist: async () => {
    try {
      set({ whitelistChecked: false });
      const res = await checkWhitelist();
      set({ whitelistChecked: true, isWhitelisted: !!res.ok });
      if (!res.ok && res.error) {
        set({ error: res.error });
      }
    } catch (err) {
      set({ whitelistChecked: true, isWhitelisted: false });
    }
  },
}));
