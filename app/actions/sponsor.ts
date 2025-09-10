import { authenticatedFetch } from "@/lib/apifetch";

export type SponsorCode = {
  id: string;
  code: string;
  team_id?: string | null;
  status?: string;
  requested_at?: string;
};

export async function getTeamSponsorCodes(): Promise<SponsorCode[]> {
  const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/code/team`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch team sponsor codes (${res.status})`);
  }
  const data = (await res.json()) as { codes?: SponsorCode[] };
  return Array.isArray(data?.codes) ? data.codes : [];
}

export async function requestSponsorCode(): Promise<SponsorCode> {
  const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/code/request`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    let msg = `Failed to request sponsor code (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error as string;
    } catch {}
    throw new Error(msg);
  }
  const data = (await res.json()) as SponsorCode & { team_id?: string | null; requested_at?: string };
  return data as SponsorCode;
}

