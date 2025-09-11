import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { method, nextUrl } = request;
  if (method === "POST" && nextUrl.pathname.startsWith("/portal/integrations/github")) {
    return NextResponse.redirect(nextUrl, { status: 303 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/integrations/github"],
};

