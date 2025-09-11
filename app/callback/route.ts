import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const forward = new URL(`/api/spotify/callback`, url.origin);
  url.searchParams.forEach((value, key) => {
    forward.searchParams.set(key, value);
  });
  return NextResponse.redirect(forward.toString());
}


