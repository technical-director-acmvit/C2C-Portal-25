import { authenticatedFetch } from "@/lib/apifetch";

export async function getUserData() {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
  });
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to fetch user data");
    }
    return res.json();
}
