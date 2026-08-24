"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

interface LogoutButtonProps {
  /** "sidebar" → full-width, gaya sidebar. "header" → compact text button (default) */
  variant?: "header" | "sidebar";
}

export function LogoutButton({ variant = "header" }: LogoutButtonProps) {
  const router = useRouter();
  const { show } = useToast();

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      show("Anda berhasil keluar.", "info");
      router.replace("/");
      router.refresh();
    } catch {
      show("Logout gagal. Silakan coba kembali.", "error");
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={logout}
        className="flex w-full items-center gap-2.5 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-300"
      >
        <LogOut size={16} />
        <span>Keluar</span>
      </button>
    );
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition"
    >
      <LogOut size={17} /> Keluar
    </button>
  );
}
