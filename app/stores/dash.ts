"use client";

import { create } from "zustand";
import { fetchDashboard, type DashboardResponse } from "@/app/actions/dashboard";

type DashView = "home" | "profile" | "form";

type DashState = {
  view: DashView;
  loading: boolean;
  error: string | null;
  dashboard: DashboardResponse | null;

  setView: (v: DashView) => void;
  reset: () => void;
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useDashStore = create<DashState>((set) => ({
  view: "home",
  loading: true,
  error: null,
  dashboard: null,

  setView: (v) => set({ view: v }),
  reset: () => set({ view: "home" }),

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchDashboard();
      if (!res.ok) {
        set({ error: res.error ?? "Failed to load dashboard", loading: false });
        return;
      }
      set({ dashboard: res.data ?? null, loading: false, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to load dashboard", loading: false });
    }
  },

  refresh: async () => {
    try {
      const res = await fetchDashboard();
      if (!res.ok) {
        set({ error: res.error ?? "Failed to refresh dashboard" });
        return;
      }
      set({ dashboard: res.data ?? null, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to refresh dashboard" });
    }
  },
}));
