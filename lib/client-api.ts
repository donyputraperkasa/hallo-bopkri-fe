// Normalisasi error dari BFF agar semua form menampilkan pesan yang konsisten.
export async function readResponse<T>(response: Response): Promise<T> {
  const type = response.headers.get("content-type") ?? "";
  const body = type.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined" && window.location.pathname.startsWith("/masdon")) {
      window.location.assign("/masdon/login");
    }
    const message =
      typeof body === "object" && body
        ? body.message ?? body.error
        : body;
    throw new Error(
      Array.isArray(message) ? message.join(", ") : message || "Terjadi kesalahan.",
    );
  }
  return body as T;
}

export async function api<T>(url: string, options?: RequestInit) {
  const headers = new Headers(options?.headers);
  if (options?.body && typeof options.body === "string" && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return readResponse<T>(
    await fetch(url, { cache: "no-store", ...options, headers }),
  );
}
