"use server";

import { getIdToken } from "../session";
import { fetchInstallationToken } from "@/lib/github";

const GITHUB_API = "https://api.github.com";

export async function getInstallUrlAction(origin: string): Promise<string> {
  // note: server action; always pass absolute origin from client
  const slug = process.env.NEXT_PUBLIC_GH_APP_SLUG;
  if (!slug) throw new Error("Missing NEXT_PUBLIC_GH_APP_SLUG");
  const base = `https://github.com/apps/${encodeURIComponent(slug)}/installations/new`;
  const params = new URLSearchParams({ redirect_url: `${origin}/portal`, state: "c2c-gh-install" });
  return `${base}?${params.toString()}`;
}

async function gh<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "c2c-app",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listInstallationReposAction(installationId: string) {
  const token = await fetchInstallationToken(installationId);
  const data = await gh<{
    repositories: Array<{
      id: number;
      name: string;
      full_name: string;
      private: boolean;
      owner: { login: string };
      html_url: string;
    }>;
  }>(`/installation/repositories`, token);
  return data.repositories;
}

export async function listCommitsAction(installationId: string, owner: string, repo: string) {
  const token = await fetchInstallationToken(installationId);
  type Commit = {
    sha: string;
    html_url: string;
    commit: { message: string; author?: { name?: string; date?: string } };
    author?: { login?: string; avatar_url?: string };
  };
  return gh<Commit[]>(`/repos/${owner}/${repo}/commits`, token);
}

export async function getContentsAction(
  installationId: string,
  owner: string,
  repo: string,
  path = "",
) {
  const token = await fetchInstallationToken(installationId);
  type GhContentItem = {
    name: string;
    path: string;
    sha: string;
    size?: number;
    url?: string;
    html_url?: string;
    git_url?: string;
    download_url?: string | null;
    type: "file" | "dir" | "symlink" | "submodule";
  };
  return gh<GhContentItem | GhContentItem[]>(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    token,
  );
}

export async function saveInstallationAction(params: {
  installation_id: string;
  repo_full_name?: string | null;
}) {
  const idToken = await getIdToken();
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
  const res = await fetch(`${base}/api/v1/github/installation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(params),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to save installation");
  return data;
}

// Additional repo insights
export async function getRepoAction(installationId: string, owner: string, repo: string) {
  const token = await fetchInstallationToken(installationId);
  type RepoMeta = {
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    private?: boolean;
    license?: { spdx_id?: string | null } | null;
    html_url?: string;
  };
  return gh<RepoMeta>(`/repos/${owner}/${repo}`, token);
}

export async function listBranchesAction(installationId: string, owner: string, repo: string) {
  const token = await fetchInstallationToken(installationId);
  return gh<Array<{ name: string; protected?: boolean }>>(
    `/repos/${owner}/${repo}/branches`,
    token,
  );
}

export async function listPullsAction(
  installationId: string,
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
) {
  const token = await fetchInstallationToken(installationId);
  return gh<
    Array<{
      id: number;
      number: number;
      title: string;
      html_url: string;
      state: string;
      user?: { login?: string; avatar_url?: string };
      created_at?: string;
    }>
  >(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=10`, token);
}

export async function listIssuesAction(
  installationId: string,
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
) {
  const token = await fetchInstallationToken(installationId);
  type Issue = {
    id: number;
    number: number;
    title: string;
    html_url: string;
    user?: { login?: string };
    created_at?: string;
    pull_request?: unknown; // present when this "issue" is actually a PR
  };
  const items = await gh<Issue[]>(
    `/repos/${owner}/${repo}/issues?state=${state}&per_page=10`,
    token,
  );
  // Filter out PRs (issues API returns PRs too when they exist)
  return items.filter((i) => !i.pull_request);
}

export async function listReleasesAction(installationId: string, owner: string, repo: string) {
  const token = await fetchInstallationToken(installationId);
  return gh<
    Array<{
      id: number;
      tag_name: string;
      name?: string;
      draft?: boolean;
      prerelease?: boolean;
      html_url: string;
      published_at?: string;
    }>
  >(`/repos/${owner}/${repo}/releases?per_page=5`, token);
}

export async function listLanguagesAction(installationId: string, owner: string, repo: string) {
  const token = await fetchInstallationToken(installationId);
  return gh<Record<string, number>>(`/repos/${owner}/${repo}/languages`, token);
}
