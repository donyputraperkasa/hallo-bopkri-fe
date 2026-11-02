"use client";

import { useEffect } from "react";

function parseDurationMs(raw: string | undefined, fallbackMs: number): number {
  if (!raw) return fallbackMs;
  const trimmed = raw.trim();
  const match = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?$/i.exec(trimmed);
  if (!match) return fallbackMs;
  const value = parseFloat(match[1]);
  const unit = (match[2] ?? "ms").toLowerCase();
  if (unit === "d") return value * 24 * 60 * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  if (unit === "m") return value * 60 * 1000;
  if (unit === "s") return value * 1000;
  return value;
}

const INACTIVITY_LIMIT_MS = parseDurationMs(
  process.env.NEXT_PUBLIC_INACTIVITY_LIMIT_MS,
  60 * 60 * 1000,
);
export const ADMIN_ACTIVITY_STORAGE_KEY =
  process.env.NEXT_PUBLIC_STORAGE_KEY ?? "";

export function useInactivityLogout(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Catat aktivitas pertama saat komponen dimuat jika belum ada
    if (!localStorage.getItem(ADMIN_ACTIVITY_STORAGE_KEY)) {
      localStorage.setItem(ADMIN_ACTIVITY_STORAGE_KEY, Date.now().toString());
    }

    const logoutDueToInactivity = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Abaikan kegagalan network saat logout
      }
      localStorage.removeItem(ADMIN_ACTIVITY_STORAGE_KEY);
      window.location.assign("/panel/login?expired=1");
    };

    const verifyActivity = () => {
      const stored = localStorage.getItem(ADMIN_ACTIVITY_STORAGE_KEY);
      const lastActive = stored ? parseInt(stored, 10) : Date.now();
      const elapsed = Date.now() - lastActive;

      if (elapsed >= INACTIVITY_LIMIT_MS) {
        void logoutDueToInactivity();
      }
    };

    // Throttle pembaruan timestamp aktivitas agar tidak memberatkan browser
    let throttleTimeout: NodeJS.Timeout | null = null;
    const recordActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          localStorage.setItem(ADMIN_ACTIVITY_STORAGE_KEY, Date.now().toString());
          throttleTimeout = null;
        }, 1000);
      }
    };

    const userEvents = ["mousedown", "keydown", "scroll", "touchstart", "click", "wheel"];
    userEvents.forEach((ev) => {
      window.addEventListener(ev, recordActivity, { passive: true });
    });

    // Pengecekan berkala setiap 15 detik
    const timer = setInterval(verifyActivity, 15_000);

    // Cek juga saat tab kembali aktif/fokus
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        verifyActivity();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", verifyActivity);

    return () => {
      if (throttleTimeout) clearTimeout(throttleTimeout);
      clearInterval(timer);
      userEvents.forEach((ev) => {
        window.removeEventListener(ev, recordActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", verifyActivity);
    };
  }, [enabled]);
}
