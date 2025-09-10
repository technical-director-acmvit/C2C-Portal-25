import { authenticatedFetch } from "@/lib/apifetch";

export type UpdateRoomDetailsRequest = {
  room_number: string;
  block: string;
};

export async function updateRoomDetails(data: UpdateRoomDetailsRequest): Promise<{
  ok: boolean;
  status: number;
  error?: string;
}> {
  try {
    const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/detail/room`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "omit",
      cache: "no-store",
    });

    let raw: unknown = undefined;
    try {
      raw = await res.json();
    } catch {}

    if (!res.ok) {
      const err = (raw as { error?: string })?.error;
      return { ok: false, status: res.status, error: err || "Failed to update room details" };
    }

    return { ok: true, status: res.status };
  } catch (error) {
    return { 
      ok: false, 
      status: 500, 
      error: error instanceof Error ? error.message : "Network error" 
    };
  }
}
