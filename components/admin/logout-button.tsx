"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

export function LogoutButton() {
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

  return (
    <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-slate-500">
      <LogOut size={17} /> Keluar
    </button>
  );
}
