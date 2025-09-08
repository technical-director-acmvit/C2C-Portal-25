import { authenticatedFetch } from "@/lib/apifetch";

export async function getNotices() {
  const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notices/`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch notices");
  }
  return response.json();
};
