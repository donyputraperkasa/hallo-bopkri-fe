import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/backend";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil." });
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}
