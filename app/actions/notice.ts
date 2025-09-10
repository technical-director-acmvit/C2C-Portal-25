import { authenticatedFetch } from "@/lib/apifetch";

type Notice = { ID: string; information: string; created_at: string };

export async function getNotices(): Promise<Notice[]> {
  const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notices/`, {
    method: "GET",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to fetch notices${text ? `: ${text}` : ""}`);
  }
  const body = await response.json();
  // Backend returns { notices: Notice[] }
  const raw = Array.isArray(body?.notices) ? body.notices : [];
  // Normalize created_at to always be a string to satisfy consumers
  return raw.map((n: any) => ({
    ID: n.ID ?? n.id ?? "",
    information: n.information ?? "",
    created_at: n.created_at ?? n.createdAt ?? new Date().toISOString(),
  }));
}

