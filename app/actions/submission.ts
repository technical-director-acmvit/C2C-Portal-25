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
  const arr = Array.isArray(raw) ? (raw as unknown[]) : [];
  return arr.map((item) => {
    const obj = (item ?? {}) as Record<string, unknown>;
    const idRaw = obj["id"] ?? obj["ID"];
    const id = typeof idRaw === 'string' || typeof idRaw === 'number' ? String(idRaw) : '';
    const title = typeof obj["title"] === 'string' ? (obj["title"] as string) : '';
    const description = typeof obj["description"] === 'string' ? (obj["description"] as string) : undefined;
    return { id, title, description } satisfies Track;
  });
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
