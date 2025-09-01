import { getIdToken } from './session';

export async function createTeam(name: string) {
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ name: name }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || 'Failed to create team');
  }
  return res.json();
}

export async function joinTeam(code: string) {
    const idToken = await getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
    });
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Failed to join team');
    }
    return res.json();
}


export async function leaveTeam() {
    const idToken = await getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/leave`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    });
    if (!res.ok) {
        let msg = 'Failed to leave team';
        try {
          const e = await res.json();
          if (e && typeof e.error === 'string') msg = e.error;
        } catch { /* ignore */ }
        throw new Error(msg);
    }
    if (res.status === 204) {
      return { ok: true };
    }
    const text = await res.text().catch(() => '');
    if (!text) return { ok: true };
    try {
      return JSON.parse(text);
    } catch {
      return { ok: true };
    }
}
