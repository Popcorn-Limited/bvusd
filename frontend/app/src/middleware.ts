import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOCKED = new Set(["US"]);

export const config = {
  matcher: [
    "/((?!block|_next|static|images|favicon.ico).*)",
  ],
};
export default function geoBlock(req: NextRequest) {
  const country =
    req.geo?.country || req.headers.get("x-vercel-ip-country") || null;

  if (BLOCKED.has(country)) {
    return NextResponse.redirect(new URL("/block", req.url));
  }

  return NextResponse.next();
}
