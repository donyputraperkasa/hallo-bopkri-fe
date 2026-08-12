import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/backend";

// Pemeriksaan awal untuk navigasi; API tetap memverifikasi token di server.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const isLogin = request.nextUrl.pathname === "/masdon/login";

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL("/masdon/login", request.url));
  }
  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL("/masdon/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/masdon/:path*"],
};
