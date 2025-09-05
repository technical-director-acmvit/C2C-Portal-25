"use client";

import React, { useEffect, useState } from "react";
import InstallCard from "@/app/@onboarding/components/portal/github/install-card";
import RepoList from "@/app/@onboarding/components/portal/github/repo-list";
import RepoPreview from "@/app/@onboarding/components/portal/github/repo-preview";
import {
  getInstallUrlAction,
  listInstallationReposAction,
  saveInstallationAction,
} from "@/app/actions/github";
import BackChevron from "@/app/@onboarding/components/portal/ui/back-chevron";
import PortalLoader from "@/app/@onboarding/components/portal/portal-loader";
import { usePortalStore } from "@/app/stores/portal";
import Image from "next/image";

export default function GithubView() {
  const setView = usePortalStore((s) => s.setView);
  const dashboard = usePortalStore((s) => s.dashboard);
  const hasTeam = Boolean(dashboard?.team);

  const [installationId, setInstallationId] = useState<string | null>(null);
  type Repo = {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    private: boolean;
    html_url: string;
  };
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string>("");
  const [justLinked, setJustLinked] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);
  const [, setHash] = useState<string>(typeof window !== "undefined" ? window.location.hash : "");

  useEffect(() => {
    if (!hasTeam) {
      setView("dashboard");
      return;
    }
  }, [hasTeam, setView]);

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        try {
          setLink(await getInstallUrlAction(window.location.origin));
        } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const iid = url.searchParams.get("installation_id");
    const state = url.searchParams.get("state");
    const setupAction = url.searchParams.get("setup_action");
    if (iid) setInstallationId(iid);
    if (state === "c2c-gh-install") setJustLinked(true);
    // Clean the URL of sensitive params after reading
    if (iid || state || setupAction) {
      url.searchParams.delete("installation_id");
      url.searchParams.delete("state");
      url.searchParams.delete("setup_action");
      window.history.replaceState({}, "", url.toString());
    }
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // On initial link, persist installation to backend for the team profile
  useEffect(() => {
    if (!installationId || !justLinked) return;
    let active = true;
    (async () => {
      try {
        await saveInstallationAction({ installation_id: installationId });
      } catch {
        // non-fatal; still allow UI usage
      } finally {
        if (active) setJustLinked(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [installationId, justLinked]);

  // After linking, try a delayed refresh once to work around GitHub propagation latency
  useEffect(() => {
    if (!installationId) return;
    const t = setTimeout(() => setRetryKey((k) => k + 1), 3500);
    return () => clearTimeout(t);
  }, [installationId]);

  useEffect(() => {
    if (!installationId) return;
    let active = true;
    const loadRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        let tid: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
          tid = setTimeout(() => reject(new Error("Timed out loading repositories")), 12000);
        });
        const result = (await Promise.race([
          listInstallationReposAction(installationId),
          timeoutPromise,
        ])) as Repo[];
        if (tid) clearTimeout(tid);
        if (active) setRepos(result || []);
        try {
          await saveInstallationAction({ installation_id: installationId });
        } catch {}
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to fetch repos");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadRepos();
    return () => {
      active = false;
    };
  }, [installationId, retryKey]);

  if (!process.env.NEXT_PUBLIC_GH_APP_SLUG) {
    return (
      <div className="fixed inset-0 w-screen h-screen relative">
        <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="text-red-300 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center max-w-md">
            Missing NEXT_PUBLIC_GH_APP_SLUG env var
          </div>
        </div>
      </div>
    );
  }

  if (!hasTeam) return <PortalLoader />;

  return (
    <div className="fixed inset-0 w-screen h-screen relative text-white">
      {/* Background image via next/image */}
      <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      <BackChevron className="absolute top-4 left-4 z-10" onClick={() => setView("dashboard")} />
      <div className="absolute inset-0 overflow-auto p-6">
        <div className="max-w-5xl mx-auto bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-6">
          <h1
            className="text-3xl mb-4"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
          >
            GitHub Integration
          </h1>
          {!installationId && <InstallCard installUrl={link} />}

          {installationId && (
            <div className="space-y-6">
              {justLinked && (
                <div className="rounded-xl border border-white/10 bg-green-500/10 text-green-300 px-4 py-3">
                  GitHub app linked successfully.
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-gray-300">Installation:</span>
                <code className="px-2 py-1 bg-black/40 border border-white/10 rounded">
                  {installationId}
                </code>
              </div>
              {loading && <PortalLoader />}
              {error && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-red-500/10 text-red-300 px-4 py-3">
                  <span className="truncate">{error}</span>
                  <button
                    type="button"
                    onClick={() => setRetryKey((k) => k + 1)}
                    className="text-xs underline hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loading && !error && <RepoList repos={repos} />}

              {typeof window !== "undefined" && window.location.hash === "#view" && (
                <RepoPreview installationId={installationId} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
