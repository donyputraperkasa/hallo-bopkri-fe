import type { StoredTicket } from "@/types";

export type { StoredTicket };

function cleanEnv(raw: string | undefined, fallback = ""): string {
  if (!raw) return fallback;
  return raw.trim().replace(/^["']|["']$/g, "");
}

function parseDurationMs(raw: string | undefined, fallbackMs: number): number {
  const cleaned = cleanEnv(raw);
  if (!cleaned) return fallbackMs;
  const match = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?$/i.exec(cleaned);
  if (!match) return fallbackMs;
  const value = parseFloat(match[1]);
  const unit = (match[2] ?? "ms").toLowerCase();
  if (unit === "d") return value * 24 * 60 * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  if (unit === "m") return value * 60 * 1000;
  if (unit === "s") return value * 1000;
  return value;
}

const SESSION_KEY = cleanEnv(process.env.NEXT_PUBLIC_SESSION_KEY, "hallo_session_ticket");
// Masa berlaku tiket sementara di sesi: default 5 Menit (300.000 ms)
const SESSION_TTL_MS = parseDurationMs(
  process.env.NEXT_PUBLIC_SESSION_TTL_MS,
  5 * 60 * 1000,
);

export function getSessionTicket(): StoredTicket | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredTicket;

    // Jika sudah lewat dari 5 menit, otomatis hangus dan bersihkan
    if (data.expiresAt && Date.now() > data.expiresAt) {
      clearSessionTicket();
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveSessionTicket(ticket: Omit<StoredTicket, "expiresAt">) {
  if (typeof window === "undefined") return;
  try {
    const sessionData: StoredTicket = {
      ...ticket,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
}

export function clearSessionTicket() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
}

export function getStoredTickets(): StoredTicket[] {
  const current = getSessionTicket();
  return current ? [current] : [];
}

export function saveStoredTicket(ticket: StoredTicket) {
  saveSessionTicket(ticket);
}

export function removeStoredTicket(_ticketCode: string): StoredTicket[] {
  clearSessionTicket();
  return [];
}
