"use client";

import { create } from "zustand";

type DashView = "home" | "profile";

type DashState = {
  view: DashView;
  setView: (v: DashView) => void;
  reset: () => void;
};

export const useDashStore = create<DashState>((set) => ({
  view: "home",
  setView: (v) => set({ view: v }),
  reset: () => set({ view: "home" }),
}));

