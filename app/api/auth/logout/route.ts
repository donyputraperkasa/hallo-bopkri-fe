import { NextResponse } from "next/server";
import { TOKEN_COOKIE, ROLE_COOKIE } from "@/lib/backend";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil." });
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(ROLE_COOKIE);
  return response;
}
