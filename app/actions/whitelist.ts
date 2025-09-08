import { authenticatedFetch } from "@/lib/apifetch";

export type WhitelistResult = { ok: boolean; error?: string };

export async function checkWhitelist(): Promise<WhitelistResult> {
  try {
    const res = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whitelist`,
      { method: "GET" }
    );

    if (res.status === 200) return { ok: true };
    if (res.status === 403) return { ok: false };

    const e = await res.json().catch(() => ({} as { error?: string }));
    return { ok: false, error: e?.error || `Whitelist check failed (${res.status})` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
