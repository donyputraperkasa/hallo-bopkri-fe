"use client";

import { useEffect } from "react";

// Batas inaktivitas 60 menit (dalam milidetik)
const INACTIVITY_LIMIT_MS = 60 * 60 * 1000;
const STORAGE_KEY = "hallo_admin_last_activity";

export function useInactivityLogout(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Catat aktivitas pertama saat komponen dimuat jika belum ada
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }

    const logoutDueToInactivity = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Abaikan kegagalan network saat logout
      }
      localStorage.removeItem(STORAGE_KEY);
      window.location.assign("/masdon/login?expired=1");
    };

    const verifyActivity = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
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
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
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
