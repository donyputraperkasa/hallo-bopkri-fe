import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE, ROLE_COOKIE } from "@/lib/backend";

type AdminRole = "owner" | "director" | "manager";

function dashboardFor(role: AdminRole): string {
  if (role === "director") return "/panel/director/dashboard";
  if (role === "manager") return "/panel/manager/dashboard";
  return "/panel/dashboard";
}

// Pemeriksaan awal untuk navigasi; API tetap memverifikasi token di server.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const rawRole = request.cookies.get(ROLE_COOKIE)?.value?.toLowerCase() ?? "owner";
  const role = (["owner", "director", "manager"].includes(rawRole) ? rawRole : "owner") as AdminRole;
  const pathname = request.nextUrl.pathname;

  const isLogin = pathname === "/panel/login";

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL("/panel/login", request.url));
  }
  if (hasSession && (isLogin || pathname === "/login")) {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  // Proteksi halaman owner hanya untuk owner
  if (hasSession && pathname.startsWith("/panel/dashboard") && role !== "owner") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }
  // Proteksi halaman director hanya untuk director
  if (hasSession && pathname.startsWith("/panel/director") && role !== "director") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }
  // Proteksi halaman manager hanya untuk manager
  if (hasSession && pathname.startsWith("/panel/manager") && role !== "manager") {
    return NextResponse.redirect(new URL(dashboardFor(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/panel/:path*"],
};
