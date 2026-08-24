import { NextResponse } from "next/server";
import { TOKEN_COOKIE, ROLE_COOKIE } from "@/lib/backend";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000/api";

export async function POST(request: Request) {
  try {
    const response = await fetch(`${BACKEND_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });

    const result = NextResponse.json({
      message: "Login berhasil.",
      role: data.role,
      bidang: data.bidang ?? null,
      displayName: data.displayName ?? null,
    });

    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    };

    result.cookies.set(TOKEN_COOKIE, data.accessToken, cookieOpts);
    result.cookies.set(ROLE_COOKIE, data.role ?? "OWNER", {
      ...cookieOpts,
      httpOnly: false, // Bisa dibaca JS untuk routing
    });

    return result;
  } catch {
    return NextResponse.json(
      { message: "Backend tidak dapat dihubungi." },
      { status: 502 },
    );
  }
}
