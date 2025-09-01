"use client";

import React, { useEffect, useState } from 'react';
import { getInstallUrlAction, listInstallationReposAction, listCommitsAction, getContentsAction, saveInstallationAction } from '@/app/actions/github';

type Repo = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  private: boolean;
  html_url: string;
};

export default function GithubIntegrationPage() {
  const [installationId, setInstallationId] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string>('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const iid = url.searchParams.get('installation_id');
    if (iid) setInstallationId(iid);
  }, []);

  useEffect(() => {
    if (!installationId) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await listInstallationReposAction(installationId);
        if (active) setRepos(r || []);
        try { await saveInstallationAction({ installation_id: installationId }); } catch {}
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed to fetch repos');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [installationId]);

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        try { setLink(await getInstallUrlAction(window.location.origin)); } catch {}
      }
    })();
  }, []);

  if (!process.env.NEXT_PUBLIC_GH_APP_SLUG) {
    return (
      <div className="min-h-screen grid place-items-center text-red-400">
        Missing NEXT_PUBLIC_GH_APP_SLUG env var
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl mb-4">GitHub Integration</h1>
      {!installationId && (
        <div className="space-y-4">
          <p className="text-gray-300">Link your GitHub by installing the app and granting access to selected repositories.</p>
          <a href={link} className="inline-block px-4 py-2 rounded-md bg-[#48BA86] text-black font-semibold hover:opacity-90">
            Link GitHub
          </a>
        </div>
      )}

      {installationId && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-300">Installation:</span>
            <code className="px-2 py-1 bg-black/40 border border-white/10 rounded">{installationId}</code>
          </div>
          {loading && <div>Loading repositories…</div>}
          {error && <div className="text-red-300">{error}</div>}
          {!loading && !error && (
            <ul className="space-y-2">
              {repos.map((r) => (
                <li key={r.id} className="p-3 border border-white/10 rounded flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.full_name}</div>
                    <div className="text-xs text-gray-400">{r.private ? 'Private' : 'Public'}</div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`${window.location.pathname}?installation_id=${installationId}&owner=${encodeURIComponent(r.owner.login)}&repo=${encodeURIComponent(r.name)}#view`}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                    >
                      View
                    </a>
                    <a href={r.html_url} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">GitHub</a>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {typeof window !== 'undefined' && window.location.hash === '#view' && (
            <RepoPreview installationId={installationId} />
          )}
        </div>
      )}
    </div>
  );
}

function RepoPreview({ installationId }: { installationId: string }) {
  const url = new URL(window.location.href);
  const owner = url.searchParams.get('owner') || '';
  const repo = url.searchParams.get('repo') || '';
  const [commits, setCommits] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || !repo) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const commits = await listCommitsAction(installationId, owner, repo);
        if (active) setCommits(commits || []);
        const c = await getContentsAction(installationId, owner, repo, '');
        if (active && Array.isArray(c)) setContents(c);
        try { await saveInstallationAction({ installation_id: installationId, repo_full_name: `${owner}/${repo}` }); } catch {}
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [installationId, owner, repo]);

  if (!owner || !repo) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl mb-2">{owner}/{repo}</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-300">{error}</div>}
      {!loading && !error && (
        <ul className="space-y-2">
          {commits.slice(0, 10).map((c) => (
            <li key={c.sha} className="p-3 border border-white/10 rounded">
              <div className="font-mono text-sm">{c.sha.slice(0, 7)} – {c.commit?.message}</div>
              <div className="text-xs text-gray-400">{c.commit?.author?.name} • {new Date(c.commit?.author?.date || Date.now()).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">Files {currentPath ? `in /${currentPath}` : '(root)'}</h3>
          <ul className="space-y-1">
            {contents.map((item: any) => (
              <li key={item.sha} className="flex items-center justify-between p-2 border border-white/10 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10">{item.type}</span>
                  <span>{item.name}</span>
                </div>
                {item.type === 'file' && (
                  <a href={item.html_url} target="_blank" rel="noreferrer" className="text-sm underline">View on GitHub</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
