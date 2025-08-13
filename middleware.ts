import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const url = req.nextUrl;

  const protectedPaths = ["/lectures", "/dashboard"];
  const isProtected = protectedPaths.some((p) => url.pathname.startsWith(p));

  if (isProtected && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/lectures/:path*", "/dashboard/:path*"],
};