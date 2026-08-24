"use client";

import { useEffect, useState } from "react";

export type AdminRole = "OWNER" | "DIRECTOR" | "MANAGER";

export interface AuthUser {
  id: string;
  username: string;
  role: AdminRole;
  bidang: string | null;
  displayName: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
