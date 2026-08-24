"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

interface LogoutButtonProps {
  /** "sidebar" → full-width, gaya sidebar. "header" → compact text button (default) */
  variant?: "header" | "sidebar";
}

export function LogoutButton({ variant = "sidebar" }: LogoutButtonProps) {
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
        className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/12 cursor-pointer"
      >
        <LogOut size={14} />
        <span>Keluar</span>
      </button>
    );
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 text-xs font-semibold text-[#748299] hover:text-red-500 transition cursor-pointer"
    >
      <LogOut size={15} /> Keluar
    </button>
  );
}
