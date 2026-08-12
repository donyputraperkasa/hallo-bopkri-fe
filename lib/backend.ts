import { cookies } from "next/headers";

export const TOKEN_COOKIE = "hallo_admin_token";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000/api";

type Context = { params: Promise<{ path: string[] }> };

// Proxy terpusat: mempertahankan query, body multipart, JSON, dan file unduhan.
export async function forward(
  request: Request,
  context: Context,
  admin = false,
) {
  const { path } = await context.params;
  const incoming = new URL(request.url);
  const prefix = admin ? "admin/" : "";
  const target = `${BACKEND_URL}/${prefix}${path.join("/")}${incoming.search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  if (admin) {
    const token = (await cookies()).get(TOKEN_COOKIE)?.value;
    if (!token) return Response.json({ message: "Sesi berakhir." }, { status: 401 });
    headers.set("authorization", `Bearer ${token}`);
  }

  try {
    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.arrayBuffer();
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
    // Hapus cookie kedaluwarsa agar redirect login tidak berputar.
    if (admin && response.status === 401) {
      (await cookies()).delete(TOKEN_COOKIE);
    }
    const outgoing = new Headers();
    ["content-type", "content-disposition"].forEach((name) => {
      const value = response.headers.get(name);
      if (value) outgoing.set(name, value);
    });
    return new Response(response.body, { status: response.status, headers: outgoing });
  } catch {
    return Response.json(
      { message: "Backend tidak dapat dihubungi. Pastikan NestJS sudah berjalan." },
      { status: 502 },
    );
  }
}
