export async function getIdToken(): Promise<string> {
  const res = await fetch("/api/auth/session", { cache: "no-store" });
  if (!res.ok) throw new Error("Not authenticated");
  const s = await res.json();
  if (!s?.idToken) throw new Error("No authentication token found");
  return s.idToken as string;
}
