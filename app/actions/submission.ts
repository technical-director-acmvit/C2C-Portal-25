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
  return res.json();
}

export async function submitTeamSubmission(params: { github_url: string; figma_url: string; other: string; track_id: string; }) {
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

