import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { adminDb } from "@/lib/firebaeAdmin";

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing Spotify client envs" }, { status: 500 });
  }
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Validate user session
  const token = await getToken({ req: request as unknown as any, secret: nextAuthSecret });
  const userId = (token as any)?.sub || (token as any)?.userId;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${request.nextUrl.origin}/api/spotify/callback`;

  // Exchange code for tokens
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: params.toString(),
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data?.error || "Failed to exchange code" }, { status: 400 });
  }

  const accessToken: string = data.access_token;
  const refreshToken: string | undefined = data.refresh_token;
  const expiresIn: number = data.expires_in;
  const scope: string | undefined = data.scope;
  const tokenType: string | undefined = data.token_type;

  const expiresAt = Date.now() + (expiresIn ?? 3600) * 1000;

  // Persist per-user tokens
  await adminDb
    .collection("spotify_tokens")
    .doc(userId)
    .set(
      {
        accessToken,
        refreshToken: refreshToken ?? null,
        tokenType: tokenType ?? "Bearer",
        scope: scope ?? null,
        expiresAt,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

  // Optional: redirect back to dashboard without query params
  const successRedirect = `${request.nextUrl.origin}/dashboard?spotify=linked`;
  return NextResponse.redirect(successRedirect);
}


