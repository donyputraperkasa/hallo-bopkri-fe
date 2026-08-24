import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE, ROLE_COOKIE } from "@/lib/backend";

// Decode JWT payload tanpa verifikasi (verifikasi tetap dilakukan di backend).
function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      sub: string;
      username: string;
      role: string;
      bidang: string | null;
      displayName: string;
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Tidak ada sesi aktif." }, { status: 401 });
  }
  const payload = decodeJwt(token);
  if (!payload) {
    return NextResponse.json({ message: "Token tidak valid." }, { status: 401 });
  }
  // Check token expiry
  if (payload && "exp" in payload) {
    const exp = (payload as unknown as { exp: number }).exp;
    if (exp && Date.now() / 1000 > exp) {
      jar.delete(TOKEN_COOKIE);
      jar.delete(ROLE_COOKIE);
      return NextResponse.json({ message: "Sesi berakhir." }, { status: 401 });
    }
  }
  return NextResponse.json({
    id: payload.sub,
    username: payload.username,
    role: payload.role ?? "OWNER",
    bidang: payload.bidang ?? null,
    displayName: payload.displayName ?? payload.username,
  });
}
