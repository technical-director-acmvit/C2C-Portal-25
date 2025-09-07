import { NextResponse } from "next/server";
import { upload, getSignedUrl } from "@/lib/bucket";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return new NextResponse(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }
    const filename = (file as File).name ?? `upload-${Date.now()}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = filename.includes(".") ? filename.substring(filename.lastIndexOf(".")) : "";
    // Use a stable destination path; adjust as needed
    const dest = `ppt/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    await upload(buffer, dest, { contentType: file.type });

    // Return a signed viewing URL (default 1 hour). Increase as needed.
    const signedUrl = await getSignedUrl(dest, 60 * 60);

    return new NextResponse(JSON.stringify({ url: signedUrl, path: dest }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
