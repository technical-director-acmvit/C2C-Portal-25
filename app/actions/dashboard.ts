import { authenticatedFetch } from "@/lib/apifetch";

export type UserSummary = {
  id: string;
  name?: string;
  email?: string;
  profile_picture_url?: string;
  contact_number?: string;
  gender?: string;
  reg_no?: string;
  internal?: boolean;
  college_name?: string;
  role?: string;
  team_id?: string | null;
};

export type TeamInfo = {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  github_url?: string | null;
  figma_url?: string | null;
  other?: string | null;
  track_id?: string | null;
};

export type TrackInfo = {
  id?: string;
  title?: string;
  description?: string;
};

export type DashboardResponse = {
  user?: UserSummary;
  team?: TeamInfo | null;
  teammates?: UserSummary[];
  track?: TrackInfo | null;
  minmembercount?: number;
  submissionOpen?: boolean;
};

export async function fetchDashboard(): Promise<{
  ok: boolean;
  status: number;
  data?: DashboardResponse;
  error?: string;
}> {
  const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/`, {
    credentials: "omit",
    cache: "no-store",
  });
  let raw: unknown = undefined;
  try {
    raw = await res.json();
  } catch {}
  if (!res.ok) {
    const err = (raw as { error?: string })?.error;
    return { ok: false, status: res.status, error: err };
  }
  const r = (raw ?? {}) as {
    minmembercount?: number;
    user?: UserSummary;
    team?: TeamInfo | null;
    teammates?: unknown;
    track?: unknown;
  };
  const teammates: UserSummary[] = Array.isArray(r.teammates) ? (r.teammates as UserSummary[]) : [];
  let track: TrackInfo | null = null;
  if (
    r.track &&
    typeof r.track === "object" &&
    Object.keys(r.track as Record<string, unknown>).length > 0
  ) {
    track = r.track as TrackInfo;
  }
  const cooked: DashboardResponse = {
    user: r.user,
    team: r.team ?? null,
    teammates,
    track,
    minmembercount: r.minmembercount,
    submissionOpen: process.env.NEXT_PUBLIC_SUBMISSION_OPEN === "true",
  };
  return { ok: true, status: res.status, data: cooked };
}