"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalStore } from "@/app/stores/portal";
import { useDashStore } from "@/app/stores/dash";
import GithubView from "@/app/components/portal/github/github-view";
import TopBar from "@/app/components/dash/top-bar";
import BottomBar from "@/app/components/dash/bottom-bar";
import BackChevron from "@/app/components/portal/ui/back-chevron";
import { fetchDashboard } from "@/app/actions/dashboard";
import InlineLoader from "@/app/components/portal/inline-loader";
import { saveInstallationClient } from "@/app/actions/github/client";

export default function GithubIntegrationPage() {
  const router = useRouter();
  const portalSetView = usePortalStore((s) => s.setView);
  const dashSetView = useDashStore((s) => s.setView);

  const [hasTeamLocal, setHasTeamLocal] = useState<boolean | null>(null);

  // Ensure both stores are set to show GitHub when opened directly
  useEffect(() => {
    portalSetView("github");
    dashSetView("github");
  }, [portalSetView, dashSetView]);

  // On GitHub callback, persist installation id eagerly (best-effort)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const iid = url.searchParams.get("installation_id");
    const state = url.searchParams.get("state");
    if (!iid) return;
    // Persist and refresh both dashboards; also stash for later if unauthenticated
    (async () => {
      try {
        await saveInstallationClient({ installation_id: iid });
        try { await useDashStore.getState().refresh(); } catch {}
        try { await usePortalStore.getState().refreshDashboard(); } catch {}
      } catch {
        try { localStorage.setItem("c2c_pending_installation_id", iid); } catch {}
      }
      // Clean the URL to remove sensitive params
      url.searchParams.delete("installation_id");
      if (state) url.searchParams.delete("state");
      window.history.replaceState({}, "", url.toString());
    })();
  }, []);

  // Determine team presence independently of portal/dash stores
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetchDashboard();
        if (!active) return;
        setHasTeamLocal(Boolean(res.ok && res.data?.team));
      } catch {
        if (!active) return;
        setHasTeamLocal(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const hasTeam = useMemo(() => hasTeamLocal === true, [hasTeamLocal]);

  // If we previously stored a pending installation id (unauthenticated redirect), try to save once team is available
  useEffect(() => {
    if (!hasTeam) return;
    if (typeof window === "undefined") return;
    const pending = localStorage.getItem("c2c_pending_installation_id");
    if (!pending) return;
    (async () => {
      try {
        await saveInstallationClient({ installation_id: pending });
        localStorage.removeItem("c2c_pending_installation_id");
        try { await useDashStore.getState().refresh(); } catch {}
        try { await usePortalStore.getState().refreshDashboard(); } catch {}
      } catch {
        // ignore; user may still not be authenticated
      }
    })();
  }, [hasTeam]);

  if (hasTeamLocal === null) {
    return (
      <div className="relative w-full min-h-screen">
        <TopBar />
        <main className="relative z-10 container mx-auto px-4 py-12 max-w-7xl grid place-items-center">
          <InlineLoader size={180} />
        </main>
        <div className="relative z-10 mt-12">
          <BottomBar />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      <TopBar />
      <main className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <div className="w-full flex items-center justify-start px-3 sm:px-4 pt-2 pb-4">
          <div className="md:hidden">
            <BackChevron onClick={() => router.push("/portal")} />
          </div>
          <button
            onClick={() => router.push("/portal")}
            className="hidden md:inline-flex px-4 py-2 rounded-full border border-emerald-500 text-white hover:bg-emerald-600/20"
          >
            Back
          </button>
        </div>
        <GithubView hasTeam={hasTeam} noBackground embedded onBack={() => router.push("/portal")} />
      </main>
      <div className="relative z-10 mt-12">
        <BottomBar />
      </div>
    </div>
  );
}
