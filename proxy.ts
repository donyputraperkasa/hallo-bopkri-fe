import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE, ROLE_COOKIE } from "@/lib/backend";

type AdminRole = "OWNER" | "DIRECTOR" | "MANAGER";

function dashboardFor(role: AdminRole): string {
  if (role === "DIRECTOR") return "/masdon/director/dashboard";
  if (role === "MANAGER") return "/masdon/manager/dashboard";
  return "/masdon/dashboard";
}

// Pemeriksaan awal untuk navigasi; API tetap memverifikasi token di server.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const role = (request.cookies.get(ROLE_COOKIE)?.value ?? "OWNER") as AdminRole;
  const pathname = request.nextUrl.pathname;

  const isLogin = pathname === "/masdon/login";

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL("/masdon/login", request.url));
  }
  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  // Proteksi halaman owner hanya untuk OWNER
  if (hasSession && pathname.startsWith("/masdon/dashboard") && role !== "OWNER") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }
  // Proteksi halaman director hanya untuk DIRECTOR
  if (hasSession && pathname.startsWith("/masdon/director") && role !== "DIRECTOR") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }
  // Proteksi halaman manager hanya untuk MANAGER
  if (hasSession && pathname.startsWith("/masdon/manager") && role !== "MANAGER") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/masdon/:path*"],
};
