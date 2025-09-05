import { getIdToken } from "@/app/actions/session";

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const idToken = await getIdToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${idToken}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
