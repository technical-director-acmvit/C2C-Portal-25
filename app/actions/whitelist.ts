import { authenticatedFetch } from "@/lib/apifetch";

export type WhitelistResult = { ok: boolean; internal?: boolean; error?: string };

export async function checkWhitelist(): Promise<WhitelistResult> {
  try {
    const res = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/whitelist`,
      { method: "GET" }
    );

    const body = await res.json().catch(() => ({} as { internal?: unknown; error?: string }));

    if (res.status === 200) {
      return { ok: true, internal: Boolean((body as { internal?: unknown }).internal) };
    }

    if (res.status === 403) {
      // Not whitelisted; surface error for UI.
      return { ok: false, error: (body as { error?: string })?.error || "Email not whitelisted" };
    }

    return { ok: false, error: (body as { error?: string })?.error || `Whitelist check failed (${res.status})` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
