"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, LogOut, Menu, X } from "lucide-react";
import { AdminNav } from "./admin-nav";
import { useAuth } from "@/hooks/use-auth";
import { showToast } from "@/lib/feedback/toast";
import { useRouter } from "next/navigation";
import { CreatorFooter } from "@/components/layout/creator-footer";

type AdminRole = "OWNER" | "DIRECTOR" | "MANAGER";

interface AdminShellProps {
  children: React.ReactNode;
  role?: AdminRole;
  displayName?: string;
  bidang?: string | null;
}

function formatRole(role: AdminRole): string {
  if (role === "DIRECTOR") return "Direktur";
  if (role === "MANAGER") return "Manajer";
  return "Owner";
}

export function AdminShell({
  children,
  role: forcedRole,
  displayName: forcedName,
  bidang: forcedBidang,
}: AdminShellProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role: AdminRole = forcedRole ?? (user?.role as AdminRole) ?? "OWNER";
  const name = forcedName ?? user?.displayName ?? "Pengguna";
  const bidang = forcedBidang ?? user?.bidang;
  const roleLabel = formatRole(role);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      showToast({
        message: "Sampai jumpa lagi di Hallo BOPKRI.",
        title: "Dadaahhh sayonara",
        type: "success",
      });
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#eef4fb] text-[#172033]">
      <div className="flex h-full min-h-0">
        {/* Mobile Backdrop */}
        {isMenuOpen ? (
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40 bg-[#071529]/55 backdrop-blur-sm lg:hidden"
            aria-label="Tutup menu"
          />
        ) : null}

        {/* Sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0f2a4f]",
            "px-5 py-5 text-white shadow-2xl transition-transform duration-300",
            "lg:static lg:z-auto lg:shrink-0 lg:translate-x-0 lg:shadow-none",
            isMenuOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <Link
                href={
                  role === "OWNER"
                    ? "/masdon/dashboard"
                    : role === "DIRECTOR"
                    ? "/masdon/director/dashboard"
                    : "/masdon/manager/dashboard"
                }
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo-yayasan.png"
                  alt="Logo Yayasan BOPKRI Yogyakarta"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full bg-white object-contain p-1 shadow-sm"
                />
                <div>
                  <p className="text-sm font-semibold uppercase text-white tracking-wide">
                    Yayasan BOPKRI
                  </p>
                  <p className="text-xs text-[#b8c8df]">
                    Hallo BOPKRI ({roleLabel})
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white lg:hidden hover:bg-white/20 transition"
                aria-label="Tutup menu"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8">
              <AdminNav role={role} onItemClick={() => setIsMenuOpen(false)} />
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="rounded-lg border border-white/12 bg-white/8 p-4">
              <p className="text-xs font-semibold uppercase text-[#f2d35f]">
                Role aktif
              </p>
              <p className="mt-2 text-sm font-semibold text-white truncate">
                {name}
              </p>
              <p className="text-xs text-[#b8c8df]">
                {roleLabel}{bidang ? ` (${bidang})` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f2d35f] px-4 py-3 text-sm font-semibold text-[#172033] transition hover:bg-[#e6c64c]"
            >
              <LogOut size={17} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-20 border-b border-[#dbe5f4] bg-[#f8fbff]/92 px-4 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#cfe0f5] bg-white text-[#0f2a4f] shadow-sm lg:hidden hover:bg-[#f0f5fc] transition"
                  aria-label="Buka menu"
                >
                  <Menu size={22} aria-hidden="true" />
                </button>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#617089]">
                    Selamat datang, {name}
                  </span>
                  <h1 className="mt-0.5 truncate text-xl sm:text-2xl font-semibold text-[#0f172a]">
                    Dashboard {roleLabel}
                  </h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="inline-flex h-10 items-center gap-2 rounded-md border border-[#dbe5f4] bg-white px-3 text-sm font-semibold text-[#526078] shadow-sm">
                  <CalendarDays size={16} aria-hidden="true" />
                  Agustus 2026
                </div>
                <div className="rounded-full bg-[#f2d35f] px-4 py-2 text-sm font-semibold text-[#172033] shadow-xs">
                  {roleLabel}
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Container with Content and Footer */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex min-h-full flex-col gap-6">
              <div className="flex-1">{children}</div>
              <div className="pt-4 pb-2">
                <CreatorFooter />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
