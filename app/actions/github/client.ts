"use client";

import { authenticatedFetch } from "@/lib/apifetch";

export async function saveInstallationClient(params: {
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
  if (!res.ok) throw new Error((data as any)?.error || "Failed to save installation");
  return data;
}

