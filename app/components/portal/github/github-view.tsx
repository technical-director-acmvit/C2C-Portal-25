"use client";

import React, { useEffect, useState } from "react";
import InstallCard from "@/app/components/portal/github/install-card";
import RepoList from "@/app/components/portal/github/repo-list";
import RepoPreview from "@/app/components/portal/github/repo-preview";
import { getInstallUrlAction, listInstallationReposAction, tagRepoAction } from "@/app/actions/github";
import { saveInstallationClient } from "@/app/actions/github/client";
import { getRepoInstallationIdAction } from "@/app/actions/github";
import BackChevron from "@/app/components/portal/ui/back-chevron";
import InlineLoader from "@/app/components/portal/inline-loader";
import PortalButton from "@/app/components/portal/ui/button";
import { usePortalStore } from "@/app/stores/portal";
import { useDashStore } from "@/app/stores/dash";
import Image from "next/image";

export default function GithubView({ onBack, hasTeam: hasTeamProp, noBackground = false, embedded = false }: { onBack?: () => void; hasTeam?: boolean; noBackground?: boolean; embedded?: boolean }) {
  const setPortalView = usePortalStore((s) => s.setView);
  const portalDashboard = usePortalStore((s) => s.dashboard);
  const dashDashboard = useDashStore.getState().dashboard;
  const team = portalDashboard?.team || dashDashboard?.team || null;
  const hasTeam = hasTeamProp ?? Boolean(team);

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
  const connectedUrl = (team && (team as any).github_url && String((team as any).github_url).trim()) || null;
  const connected = Boolean(connectedUrl);
  function parseOwnerRepo(urlStr: string | null): { owner: string | null; repo: string | null } {
    if (!urlStr) return { owner: null, repo: null };
    try {
      const u = new URL(urlStr);
      if (!/(^|\.)github\.com$/i.test(u.hostname)) return { owner: null, repo: null };
      const parts = u.pathname.replace(/^\//, '').split('/');
      if (parts.length < 2) return { owner: null, repo: null };
      const owner = parts[0];
      let repo = parts[1];
      repo = repo.replace(/\.git$/i, '');
      return { owner, repo };
    } catch {
      const m = urlStr.match(/github\.com\/(.+?)\/(.+?)(?:$|\?|#|\/)/i);
      if (m) {
        return { owner: m[1], repo: m[2].replace(/\.git$/i, '') };
      }
      return { owner: null, repo: null };
    }
  }
  const { owner: connectedOwner, repo: connectedRepo } = parseOwnerRepo(connectedUrl);

  useEffect(() => {
    let done = false;
    if (!installationId || !connectedOwner || !connectedRepo) return;
    (async () => {
      if (done) return;
      try {
        console.log("[C2C] Tagging repo via Manage view", {
          installationId,
          owner: connectedOwner,
          repo: connectedRepo,
        });
        const res = await tagRepoAction(installationId, connectedOwner, connectedRepo).catch(() => ({ ok: false } as const));
        console.log("[C2C] Tagging attempt (Manage view) result:", res);
      } catch {}
      done = true;
    })();
    return () => { done = true; };
  }, [installationId, connectedOwner, connectedRepo]);

  useEffect(() => {
    // Only auto-redirect when running within the portal (no explicit hasTeamProp supplied)
    if (hasTeamProp === undefined && !hasTeam) {
      setPortalView("dashboard");
      return;
    }
  }, [hasTeamProp, hasTeam, setPortalView]);

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
    if (!installationId) return;
    if (!connectedOwner || !connectedRepo) return;
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const already = url.searchParams.get("owner") === connectedOwner && url.searchParams.get("repo") === connectedRepo && window.location.hash === "#view";
    if (already) return;
    url.searchParams.set("owner", connectedOwner);
    url.searchParams.set("repo", connectedRepo);
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}#view`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [installationId, connectedOwner, connectedRepo]);

  useEffect(() => {
    if (installationId) return;
    if (!connectedOwner || !connectedRepo) return;
    let active = true;
    (async () => {
      try {
        const id = await getRepoInstallationIdAction(connectedOwner, connectedRepo);
        if (!active || !id) return;
        setInstallationId(id);
        try {
          await saveInstallationClient({ installation_id: id });
        } catch {}
      } catch {}
    })();
    return () => { active = false; };
  }, [installationId, connectedOwner, connectedRepo]);

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
        await saveInstallationClient({ installation_id: installationId });
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
          await saveInstallationClient({ installation_id: installationId });
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

  if (!hasTeam) return <InlineLoader size={160} />;

  if (embedded) {
    return (
      <div className="w-full text-white">
        <div className="max-w-5xl mx-auto bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-6 animate-fade-in-up">
          <h1
            className="mb-4"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: "clamp(20px,5.5vw,30px)" }}
          >
            GitHub Integration
          </h1>
          {connected && connectedOwner && connectedRepo && (
            <div className="w-full max-w-3xl mx-auto bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8 animate-pop-in mb-6">
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
              >
                Connected repository
              </h2>
              <p className="text-gray-300 mt-3">
                {connectedOwner}/{connectedRepo}
              </p>
              <div className="mt-6 flex gap-3">
                <a href={connectedUrl as string} target="_blank" rel="noreferrer">
                  <PortalButton>Open on GitHub</PortalButton>
                </a>
                {!installationId && link && (
                  <a href={link}>
                    <PortalButton>Connect GitHub App</PortalButton>
                  </a>
                )}
              </div>
            </div>
          )}

          {!installationId && !connected && <InstallCard installUrl={link} />}

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
              {loading && (
                <div className="flex items-center justify-center py-8"><InlineLoader size={120} /></div>
              )}
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
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen relative text-white z-[100]">
      {/* Background: optionally suppressed to inherit @dash gradient */}
      {!noBackground && (
        <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
      )}
      <BackChevron className="absolute top-4 left-4 z-10" onClick={() => (onBack ? onBack() : setPortalView("dashboard"))} />
      <div className="absolute inset-0 overflow-auto p-6">
        <div className="max-w-5xl mx-auto border-white/10 rounded-2xl p-4 sm:p-6 animate-fade-in-up">
          <h1
            className="mb-4"
            style={{ fontFamily: "'Pilat Extended', Arial, sans-serif", fontSize: "clamp(20px,5.5vw,30px)" }}
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
              {loading && (
                <div className="flex items-center justify-center py-8"><InlineLoader size={120} /></div>
              )}
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
