// Client-safe helpers to talk to backend using Google ID token from NextAuth session
async function getIdToken(): Promise<string> {
  const res = await fetch('/api/auth/session');
  if (!res.ok) throw new Error('Not authenticated');
  const s = await res.json();
  if (!s?.idToken) throw new Error('No authentication token found');
  return s.idToken as string;
}

interface InternalSignupData {
  name: string;
  email: string;
  contact_number: string;
  gender: string;
  reg_no: string;
}

interface ExternalSignupData {
  name: string;
  email: string;
  contact_number: string;
  gender: string;
  college_name: string;
}

// Function for internal users (VIT students)
export async function signupInternal(data: InternalSignupData) {
  try {
    const idToken = await getIdToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        contact_number: data.contact_number,
        gender: data.gender,
        reg_no: data.reg_no,
        role: "participant",
        internal: true,
        college_name: "" // Not needed for internal users
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Signup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Internal signup error:', error);
    throw error;
  }
}

// Function for external users (non-VIT students)
export async function signupExternal(data: ExternalSignupData) {
  try {
    const idToken = await getIdToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        contact_number: data.contact_number,
        gender: data.gender,
        reg_no: "", // Not needed for external users
        role: "participant",
        internal: false,
        college_name: data.college_name
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Signup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('External signup error:', error);
    throw error;
  }
}

export async function getUserFromBackend() {
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user`, {
    headers: { 'Authorization': `Bearer ${idToken}` },
    cache: 'no-store',
  });
  return res;
}

export async function createTeam(data: { name: string; description?: string }) {
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ name: data.name, description: data.description ?? null }),
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
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || 'Failed to join team');
  }
  return res.json();
}
