import { authenticatedFetch } from "@/lib/apifetch";

export type Track = {
  id: string;
  title: string;
  description?: string;
};

export async function getTracks(): Promise<Track[]> {
  const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tracks/getall`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load tracks");
  const raw = await res.json();
  const arr = Array.isArray(raw) ? (raw as unknown[]) : [];
  return arr.map((item) => {
    const obj = (item ?? {}) as Record<string, unknown>;
    const idRaw = obj["id"] ?? obj["ID"];
    const id = typeof idRaw === "string" || typeof idRaw === "number" ? String(idRaw) : "";
    const title = typeof obj["title"] === "string" ? (obj["title"] as string) : "";
    const description =
      typeof obj["description"] === "string" ? (obj["description"] as string) : undefined;
    return { id, title, description } satisfies Track;
  });
}

export async function submitTeamSubmission(params: {
  /** if ppt_file is provided, it will be uploaded to the internal API and the returned signed URL used */
  ppt_file?: File | null;
  ppt_url?: string;
  description?: string | null;
  github_url?: string | null;
  figma_url?: string | null;
  other?: string | null;
  track_id: string | null;
  title?: string | null;
}) {
  const MAX_PPT_BYTES = 5 * 1024 * 1024; // 5 MB

  /** If a File is provided, validate size and upload it first to our server route which uses uploader creds. */
  let pptUrl = params.ppt_url;
  if (params.ppt_file) {
    // ensure a single File and size limit
    if (!(params.ppt_file instanceof File)) {
      throw new Error("Invalid file provided");
    }
    if (params.ppt_file.size > MAX_PPT_BYTES) {
      throw new Error("File size exceeds 5 MB limit");
    }
    // enforce PDF only
    const isPdfByType = params.ppt_file.type === "application/pdf";
    const isPdfByName = params.ppt_file.name?.toLowerCase().endsWith(".pdf");
    if (!isPdfByType && !isPdfByName) {
      throw new Error("Only PDF files are allowed");
    }

    const fd = new FormData();
    fd.append("file", params.ppt_file);
    /** Use same-origin fetch with credentials so any session cookies are preserved. */
    const uploadRes = await fetch("/api/upload-ppt", {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    if (!uploadRes.ok) {
      const errBody = await uploadRes.json().catch(() => ({}));
      throw new Error(errBody?.error || "Failed to upload PPT file");
    }
    const body = await uploadRes.json().catch(() => ({}));
    pptUrl = body?.url;
  }

  const requestBody = {
    ppt_url: pptUrl,
    description: params.description ?? null,
    github_url: params.github_url ?? null,
    figma_url: params.figma_url ?? null,
    other: params.other ?? null,
    track_id: params.track_id,
    title: params.title ?? null,
  };

  const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/team/submission`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Failed to submit");
  return data;
}