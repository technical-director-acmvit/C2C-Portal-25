import { getIdToken } from './session';

export type Track = {
  id: string;
  title: string;
  description?: string;
};

export async function getTracks(): Promise<Track[]> {
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tracks/getall`, {
    headers: { 'Authorization': `Bearer ${idToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load tracks');
  const raw = await res.json();
  return (Array.isArray(raw) ? raw : []).map((t: any) => ({
    id: (t?.id ?? t?.ID ?? '').toString(),
    title: t?.title ?? '',
    description: t?.description ?? undefined,
  })) as Track[];
}

export async function submitTeamSubmission(params: { ppt_url?: string; description?: string | null; github_url?: string | null; figma_url?: string | null; other?: string | null; track_id: string | null; }) {
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/submission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Failed to submit');
  return data;
}

export type Submission = {
  id: string;
  ppt_url?: string;
  description?: string | null;
  round_id?: string;
  team_id?: string;
  created_at?: string;
  updated_at?: string;
};

export async function getCurrentSubmission(): Promise<{ ok: boolean; status: number; data?: Submission }>{
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/submission`, {
    headers: { 'Authorization': `Bearer ${idToken}` },
    cache: 'no-store',
  });
  let raw: unknown = undefined;
  try { raw = await res.json(); } catch {}
  if (!res.ok) {
    return { ok: false, status: res.status };
  }
  return { ok: true, status: res.status, data: raw as Submission };
}
