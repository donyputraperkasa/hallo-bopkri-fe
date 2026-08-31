import type { Category } from "@/types/api";

export interface StoredTicket {
  ticketCode: string;
  category: Category;
  createdAt: string;
  expiresAt?: number;
}

const SESSION_KEY = "hallo_session_ticket";
// Masa berlaku tiket sementara di sesi: 5 Menit (300.000 ms)
const SESSION_TTL_MS = 5 * 60 * 1000;

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
    localStorage.removeItem("hallo_my_tickets");
  } catch {
    // Ignore
  }
}

export function clearSessionTicket() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("hallo_my_tickets");
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
