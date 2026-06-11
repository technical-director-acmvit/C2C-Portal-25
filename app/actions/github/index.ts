"use server";

import { fetchInstallationToken } from "@/lib/github";
import { authenticatedFetch } from "@/lib/apifetch";
import { createAppJwt } from "@/lib/github";

const GITHUB_API = "https://api.github.com";

export async function getInstallUrlAction(origin: string): Promise<string> {
  // note: server action; always pass absolute origin from client
  const slug = process.env.NEXT_PUBLIC_GH_APP_SLUG;
  if (!slug) throw new Error("Missing NEXT_PUBLIC_GH_APP_SLUG");
  const base = `https://github.com/apps/${encodeURIComponent(slug)}/installations/new`;
  const params = new URLSearchParams({ redirect_url: `${origin}/portal/integrations/github`, state: "c2c-gh-install" });
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
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
  const res = await authenticatedFetch(`${base}/api/v1/github/installation`, {
    method: "POST",
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

export async function tagRepoAction(
  installationId: string,
  owner: string,
  repo: string,
  tagHumanReadable = "Code2Create",
) {
  const token = await fetchInstallationToken(installationId);
  // try {
  //   console.log("[C2C] tagRepoAction: start", { owner, repo, installationId, tagHumanReadable });
  // } catch {}

  try {
    let namesExisting: string[] = [];
    try {
      const resp = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/topics`, {
        headers: {
          Accept: "application/vnd.github.mercy-preview+json, application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "c2c-app",
        },
        cache: "no-store",
      });
      if (resp.ok) {
        const t = (await resp.json()) as { names?: string[] };
        namesExisting = Array.isArray(t?.names) ? t!.names! : [];
      }
    } catch {
      namesExisting = [];
    }
    const normalized = tagHumanReadable.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if ((namesExisting ?? []).map((n) => String(n).toLowerCase()).includes(normalized)) {
      try { console.log("[C2C] tagRepoAction: topic already present", { owner, repo, tag: normalized }); } catch {}
      return { ok: true, method: "topics-exists", tag: normalized } as const;
    }
    const names = Array.from(new Set([...(namesExisting ?? []), normalized]));
    const putResp = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/topics`, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github.mercy-preview+json, application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "c2c-app",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ names }),
    });
    if (!putResp.ok) {
      const errText = await putResp.text();
      throw new Error(errText || `PUT /topics failed ${putResp.status}`);
    }
    try {
      // console.log("[C2C] tagRepoAction: topics updated", { owner, repo, tag: normalized });
    } catch {}
    return { ok: true, method: "topics", tag: normalized } as const;
  } catch {
    try {
      // console.log("[C2C] tagRepoAction: topics attempt failed; falling back to labels", {
      //   owner,
      //   repo,
      //   err: e instanceof Error ? e.message : String(e),
      // });
    } catch {}
    try {
      await fetch(`${GITHUB_API}/repos/${owner}/${repo}/labels`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "c2c-app",
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ name: tagHumanReadable, color: "36a64f" }),
      }).then(async (r) => {
        if (r.status === 422) return; // already exists
        if (!r.ok) throw new Error(await r.text());
      });
      try {
        //console.log("[C2C] tagRepoAction: label created or existed", { owner, repo, tag: tagHumanReadable });
      } catch {}
      return { ok: true, method: "labels", tag: tagHumanReadable } as const;
    } catch {
      try {
        // console.log("[C2C] tagRepoAction: label fallback failed", {
        //   owner,
        //   repo,
        //   err: e2 instanceof Error ? e2.message : String(e2),
        // });
      } catch {}
      return { ok: false, reason: "insufficient_permissions" } as const;
    }
  }
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
    pull_request?: unknown;
  };
  const items = await gh<Issue[]>(
    `/repos/${owner}/${repo}/issues?state=${state}&per_page=10`,
    token,
  );
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

export async function getRepoInstallationIdAction(owner: string, repo: string): Promise<string | null> {
  const jwt = createAppJwt();
  const resp = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/installation`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${jwt}`,
      "User-Agent": "c2c-app",
    },
    cache: "no-store",
  });
  if (!resp.ok) return null;
  const data = await resp.json().catch(() => null) as { id?: number } | null;
  const id = data?.id ? String(data.id) : null;
  return id;
}
