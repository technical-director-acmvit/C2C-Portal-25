"use client";

import React from "react";

type Repo = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  private: boolean;
  html_url: string;
};

export default function RepoList({
  installationId,
  repos,
}: {
  installationId: string;
  repos: Repo[];
}) {
  return (
    <ul className="space-y-3">
      {repos.map((r) => (
        <li
          key={r.id}
          className="p-3 border border-white/10 rounded-xl bg-black/20 flex items-center justify-between"
        >
          <div>
            <div
              className="font-semibold"
              style={{ fontFamily: "'Pilat Extended', Arial, sans-serif" }}
            >
              {r.full_name}
            </div>
            <div className="text-xs text-gray-400">{r.private ? "Private" : "Public"}</div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window === "undefined") return;
                const url = new URL(window.location.href);
                url.searchParams.set("owner", r.owner.login);
                url.searchParams.set("repo", r.name);
                window.history.pushState(
                  {},
                  "",
                  `${url.pathname}?${url.searchParams.toString()}#view`,
                );
                // trigger hashchange for listeners
                window.dispatchEvent(new HashChangeEvent("hashchange"));
              }}
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              View
            </button>
            <a
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              GitHub
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
