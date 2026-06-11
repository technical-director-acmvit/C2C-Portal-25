"use client";

import React, { useEffect, useState } from "react";
import InlineLoader from "../inline-loader";
import LanguageBar from "./language-bar";
import PortalButton from "../ui/button";
import { updateTeam } from "@/app/actions/update_team";
import {
  listCommitsAction,
  getContentsAction,
  tagRepoAction,
  getRepoAction,
  listBranchesAction,
  listPullsAction,
  listIssuesAction,
  listReleasesAction,
  listLanguagesAction,
} from "@/app/actions/github";
import { saveInstallationClient } from "@/app/actions/github/client";
import { useDashStore } from "@/app/stores/dash";
import { usePortalStore } from "@/app/stores/portal";

export default function RepoPreview({ installationId }: { installationId: string }) {
  const url = new URL(typeof window !== "undefined" ? window.location.href : "http://localhost");
  const owner = url.searchParams.get("owner") || "";
  const repo = url.searchParams.get("repo") || "";
  const portalDashboard = usePortalStore((s) => s.dashboard);
  const dashDashboard = useDashStore.getState().dashboard;
  const team = portalDashboard?.team || dashDashboard?.team || null;
  const connectedUrl = (team?.github_url && String(team.github_url).trim()) || null;
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
      if (m) return { owner: m[1], repo: m[2].replace(/\.git$/i, '') };
      return { owner: null, repo: null };
    }
  }
  const { owner: connectedOwner, repo: connectedRepo } = parseOwnerRepo(connectedUrl);
  const isSelectedConnectedRepo = Boolean(connectedOwner && connectedRepo && owner === connectedOwner && repo === connectedRepo);

  type RepoMeta = {
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    private?: boolean;
    license?: { spdx_id?: string | null } | null;
    html_url?: string;
  } | null;
  const [repoInfo, setRepoInfo] = useState<RepoMeta>(null);
  const [languages, setLanguages] = useState<Record<string, number> | null>(null);
  const [branches, setBranches] = useState<Array<{ name: string; protected?: boolean }>>([]);
  type Commit = {
    sha: string;
    html_url?: string;
    commit: { message: string; author?: { name?: string; date?: string } };
    author?: { login?: string; avatar_url?: string };
  };
  type Pull = {
    id: number;
    number: number;
    title: string;
    html_url: string;
    user?: { login?: string };
    created_at?: string;
  };
  type Issue = {
    id: number;
    number: number;
    title: string;
    html_url: string;
    user?: { login?: string };
    created_at?: string;
  };
  type Release = {
    id: number;
    tag_name: string;
    name?: string;
    draft?: boolean;
    prerelease?: boolean;
    html_url: string;
    published_at?: string;
  };
  type ContentItem = {
    name: string;
    sha: string;
    type: "file" | "dir" | "symlink" | "submodule";
    html_url?: string;
  };
  const [pulls, setPulls] = useState<Pull[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [currentPath] = useState<string>("");
  const [tagNotice, setTagNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || !repo) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [meta, langs, brs, prs, iss, rels, cms, root] = await Promise.all([
          getRepoAction(installationId, owner, repo),
          listLanguagesAction(installationId, owner, repo).catch(() => ({})),
          listBranchesAction(installationId, owner, repo).catch(() => []),
          listPullsAction(installationId, owner, repo).catch(() => []),
          listIssuesAction(installationId, owner, repo).catch(() => []),
          listReleasesAction(installationId, owner, repo).catch(() => []),
          listCommitsAction(installationId, owner, repo).catch(() => []),
          getContentsAction(installationId, owner, repo, "").catch(() => []),
        ]);
        if (!active) return;
        setRepoInfo(meta ?? null);
        setLanguages(langs && Object.keys(langs).length ? langs : null);
        setBranches(Array.isArray(brs) ? brs : []);
        setPulls(Array.isArray(prs) ? prs.slice(0, 5) : []);
        setIssues(Array.isArray(iss) ? iss.slice(0, 5) : []);
        setReleases(Array.isArray(rels) ? rels.slice(0, 3) : []);
        setCommits(Array.isArray(cms) ? cms.slice(0, 10) : []);
        setContents(Array.isArray(root) ? root : []);
        try {
          await saveInstallationClient({
            installation_id: installationId,
          });
          const repoUrl = `https://github.com/${owner}/${repo}`;
          try {
            await updateTeam({ githubUrl: repoUrl });
          } catch {}
          try { useDashStore.getState().refresh?.(); } catch {}
          try { usePortalStore.getState().refreshDashboard?.(); } catch {}
          if (isSelectedConnectedRepo) {
            //console.log("[C2C] RepoPreview: attempting to tag repo (connected only)", { installationId, owner, repo });
            const tagRes = await tagRepoAction(installationId, owner, repo).catch(() => ({ ok: false } as const));
            //console.log("[C2C] RepoPreview: tagging result", tagRes);
            if (!tagRes?.ok) {
              setTagNotice(
                "Could not add repository topic automatically. Please grant the GitHub App Repository administration: write (for topics) or Issues: write (for label fallback), or add the 'code2create-6-0' topic manually in the repo UI."
              );
            } else if (tagRes.method === "topics" || tagRes.method === "topics-exists") {
              setTagNotice(null);
            }
          } else {
            //console.log("[C2C] RepoPreview: skipping tag since selected repo is not the connected team repo", { selected: { owner, repo }, connectedOwner, connectedRepo });
          }
        } catch {}
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [installationId, isSelectedConnectedRepo, owner, repo]);

  if (!owner || !repo) return null;

  return (
    <div className="mt-8">
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
              {owner}/{repo}
            </h2>
            {repoInfo && (
              <div className="mt-1 text-sm text-gray-300 flex flex-wrap gap-3">
                <span>★ {repoInfo.stargazers_count ?? 0}</span>
                <span>⑂ {repoInfo.forks_count ?? 0}</span>
                <span>Issues {repoInfo.open_issues_count ?? 0}</span>
                <span>Visibility {repoInfo.private ? "Private" : "Public"}</span>
                {repoInfo.license?.spdx_id && <span>License {repoInfo.license.spdx_id}</span>}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {repoInfo?.html_url && (
              <a href={repoInfo.html_url} target="_blank" rel="noreferrer">
        <PortalButton>Open on GitHub</PortalButton>
              </a>
            )}
          </div>
        </div>
        {tagNotice && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-2 text-sm flex items-center justify-between gap-3">
            <span className="flex-1 pr-2">{tagNotice}</span>
            <div className="flex items-center gap-2">
              {repoInfo?.html_url && (
                <a
                  href={repoInfo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs"
                >
                  Open Repo
                </a>
              )}
              <button
                type="button"
                className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-100 text-xs"
                onClick={async () => {
                  try {
                    if (!isSelectedConnectedRepo) {
                      console.log("[C2C] RepoPreview Retry: skipping tag; not connected repo", { selected: { owner, repo }, connectedOwner, connectedRepo });
                      return;
                    }
                    console.log("[C2C] RepoPreview Retry: attempting to tag (connected)", { installationId, owner, repo });
                    const res = await tagRepoAction(installationId, owner, repo).catch(() => ({ ok: false } as const));
                    console.log("[C2C] RepoPreview Retry: tagging result", res);
                    if (res?.ok) setTagNotice(null);
                  } catch {}
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <div className="mt-4">
          <LanguageBar languages={languages} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card title="Recent Commits">
          <ul className="space-y-2">
            {commits.map((c) => (
              <li key={c.sha} className="p-3 border border-white/10 rounded bg-black/20">
                <div className="font-mono text-sm">
                  {c.sha?.slice(0, 7)} – {c.commit?.message}
                </div>
                <div className="text-xs text-gray-400">
                  {c.commit?.author?.name} •{" "}
                  {new Date(c.commit?.author?.date || Date.now()).toLocaleString()}
                </div>
              </li>
            ))}
            {commits.length === 0 && <Empty text="No commits found" />}
          </ul>
        </Card>

        <Card title="Branches">
          <ul className="space-y-2">
            {branches.map((b) => (
              <li
                key={b.name}
                className="p-2 border border-white/10 rounded bg-black/20 flex items-center justify-between"
              >
                <span className="font-mono text-sm">{b.name}</span>
                {b.protected && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10">protected</span>
                )}
              </li>
            ))}
            {branches.length === 0 && <Empty text="No branches" />}
          </ul>
        </Card>

        <Card title="Open Pull Requests">
          <ul className="space-y-2">
            {pulls.map((p) => (
              <li key={p.id} className="p-3 border border-white/10 rounded bg-black/20">
                <div className="font-semibold">
                  #{p.number} {p.title}
                </div>
                <div className="text-xs text-gray-400">
                  by {p.user?.login} • {new Date(p.created_at || Date.now()).toLocaleString()}
                </div>
                <a className="text-xs underline" href={p.html_url} target="_blank" rel="noreferrer">
                  View PR
                </a>
              </li>
            ))}
            {pulls.length === 0 && <Empty text="No open PRs" />}
          </ul>
        </Card>

        <Card title="Open Issues">
          <ul className="space-y-2">
            {issues.map((i) => (
              <li key={i.id} className="p-3 border border-white/10 rounded bg-black/20">
                <div className="font-semibold">
                  #{i.number} {i.title}
                </div>
                <div className="text-xs text-gray-400">
                  by {i.user?.login} • {new Date(i.created_at || Date.now()).toLocaleString()}
                </div>
                <a className="text-xs underline" href={i.html_url} target="_blank" rel="noreferrer">
                  View Issue
                </a>
              </li>
            ))}
            {issues.length === 0 && <Empty text="No open issues" />}
          </ul>
        </Card>

        <Card title="Releases">
          <ul className="space-y-2">
            {releases.map((r) => (
              <li key={r.id} className="p-3 border border-white/10 rounded bg-black/20">
                <div className="font-semibold">{r.name || r.tag_name}</div>
                <div className="text-xs text-gray-400">
                  {r.prerelease ? "Pre-release" : r.draft ? "Draft" : "Stable"} •{" "}
                  {new Date(r.published_at || Date.now()).toLocaleDateString()}
                </div>
                <a className="text-xs underline" href={r.html_url} target="_blank" rel="noreferrer">
                  View Release
                </a>
              </li>
            ))}
            {releases.length === 0 && <Empty text="No releases" />}
          </ul>
        </Card>

        <Card title={`Files ${currentPath ? `in /${currentPath}` : "(root)"}`}>
          <ul className="space-y-1">
            {contents.map((item: ContentItem) => (
              <li
                key={item.sha}
                className="flex items-center justify-between p-2 border border-white/10 rounded bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10">{item.type}</span>
                  <span>{item.name}</span>
                </div>
                {item.type === "file" && (
                  <a
                    href={item.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline"
                  >
                    View
                  </a>
                )}
              </li>
            ))}
            {contents.length === 0 && <Empty text="No files" />}
          </ul>
        </Card>
      </div>

      {loading && (
        <div className="mt-6 flex items-center justify-center"><InlineLoader size={100} /></div>
      )}
      {error && <div className="mt-2 text-red-300">{error}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-black/30 border border-white/10 rounded-2xl p-5">
      <h3 className="text-lg mb-3" style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-gray-400">{text}</div>;
}
