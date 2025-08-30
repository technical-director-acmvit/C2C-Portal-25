import { getIdToken } from './session';

export type DashboardResponse = {
  user?: any;
  team?: any | null;
  teammates?: any[];
  track?: any;
};

export async function fetchDashboard(): Promise<{ ok: boolean; status: number; data?: DashboardResponse; error?: string }> {
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
    credentials: 'omit',
    cache: 'no-store',
  });
  let data: any = undefined;
  try { data = await res.json(); } catch {}
  if (!res.ok) return { ok: false, status: res.status, error: data?.error };
  return { ok: true, status: res.status, data };
}

