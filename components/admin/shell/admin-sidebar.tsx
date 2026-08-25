"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { AdminNav } from "./admin-nav";

interface AdminSidebarProps {
  role: "owner" | "director" | "manager";
  roleLabel: string;
  name: string;
  bidang?: string | null;
  isMenuOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function AdminSidebar({
  role,
  roleLabel,
  name,
  bidang,
  isMenuOpen,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const dashboardLink =
    role === "owner"
      ? "/masdon/dashboard"
      : role === "director"
      ? "/masdon/director/dashboard"
      : "/masdon/manager/dashboard";

  return (
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
          <Link href={dashboardLink} onClick={onClose} className="flex items-center gap-3">
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
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white lg:hidden hover:bg-white/20 transition"
            aria-label="Tutup menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8">
          <AdminNav role={role} onItemClick={onClose} />
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <div className="rounded-lg border border-white/12 bg-white/8 p-4">
          <p className="text-xs font-semibold uppercase text-[#f2d35f]">Role aktif</p>
          <p className="mt-2 text-sm font-semibold text-white truncate">{name}</p>
          <p className="text-xs text-[#b8c8df]">
            {roleLabel}
            {bidang ? ` (${bidang})` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f2d35f] px-4 py-3 text-sm font-semibold text-[#172033] transition hover:bg-[#e6c64c]"
        >
          <LogOut size={17} aria-hidden="true" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
