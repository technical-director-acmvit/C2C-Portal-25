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
    tech_stack?: Record<string, unknown> | unknown[] | null;
};

export type TrackInfo = {
  id?: string;
  title?: string;
  description?: string;
};

export type RoundInfo = {
  check_in_flag?: boolean;
  created_at?: string | Date | null;
  description?: string | null;
  end_time?: string | Date | null;
  id?: string;
  name?: string;
  ppt_flag?: boolean;
  round_number?: number;
  screen_flag?: boolean;
  start_time?: string | Date | null;
  updated_at?: string | Date | null;
};

export type DashboardResponse = {
  user?: UserSummary;
  team?: TeamInfo | null;
  teammates?: UserSummary[];
  track?: TrackInfo | null;
  minmembercount?: number;
  c2chappening?: boolean;
  submitted?: boolean;
  submission?: SubmissionInfo | null;
  current_team_round?: RoundInfo | null;
  active_round?: RoundInfo | null;
};

export type SubmissionInfo = {
    title?: string | null;
    ppt_url?: string | null;
    description?: string | null;
    round_end_time?: string | Date | null;
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
    if (res.status === 404) {
      // Surface a structured 404 so callers can route to signup
      return { ok: false, status: 404, error: err || "User not found" };
    }
    return { ok: false, status: res.status, error: err };
  }
  const r = (raw ?? {}) as {
    minmembercount?: number;
    user?: UserSummary;
    team?: TeamInfo | null;
    teammates?: unknown;
    track?: unknown;
    c2chappening?: boolean;
    submitted?: boolean;
    submission?: SubmissionInfo | null;
    active_round?: unknown;
    current_team_round?: unknown;
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
  let active_round: RoundInfo | null = null;
  if (
    r.active_round &&
    typeof r.active_round === "object" &&
    Object.keys(r.active_round as Record<string, unknown>).length > 0
  ) {
    active_round = r.active_round as RoundInfo;
  }
  let current_team_round: RoundInfo | null = null;
  if (
    r.current_team_round &&
    typeof r.current_team_round === "object" &&
    Object.keys(r.current_team_round as Record<string, unknown>).length > 0
  ) {
    current_team_round = r.current_team_round as RoundInfo;
  }
  const cooked: DashboardResponse = {
    user: r.user,
    team: r.team ?? null,
    teammates,
    track,
    minmembercount: r.minmembercount,
    c2chappening: r.c2chappening ?? false,
    submitted: r.submitted ?? false,
    submission: r.submission ?? null,
    current_team_round,
    active_round,
  };
  return { ok: true, status: res.status, data: cooked };
}
