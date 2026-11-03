import { NextResponse } from "next/server";
import { TOKEN_COOKIE, ROLE_COOKIE, BACKEND_URL } from "@/lib/backend";

export async function POST(request: Request) {
  let response: Response;
  try {
    const bodyText = await request.text();
    response = await fetch(`${BACKEND_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: bodyText,
      cache: "no-store",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Backend tidak dapat dihubungi (${detail}).` },
      { status: 502 },
    );
  }

  try {
    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const userRole = (data.role?.toLowerCase() ?? "owner") as "owner" | "director" | "manager";

    const result = NextResponse.json({
      message: "Login berhasil.",
      role: userRole,
      bidang: data.bidang ?? null,
      displayName: data.displayName ?? null,
    });

    // 60 menit masa berlaku token cookie
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 60 menit
    };

    result.cookies.set(TOKEN_COOKIE || "hallo_admin_token", data.accessToken ?? "", cookieOpts);
    result.cookies.set(ROLE_COOKIE || "hallo_admin_role", userRole, {
      ...cookieOpts,
      httpOnly: false, // Bisa dibaca JS untuk routing & navigasi
    });

    return result;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Gagal memproses respons login (${detail}).` },
      { status: 502 },
    );
  }
}
