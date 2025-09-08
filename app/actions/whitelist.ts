import { authenticatedFetch } from "@/lib/apifetch";

export async function checkWhitelist() {
  const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/whitelist`, {
    method: "GET",
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || "Not in whitelist");
  }

  if (res.status === 403) {
    return false;
  }
  else if (res.status === 200) {
    return true;    
  } else {
    return false;
  }
}
