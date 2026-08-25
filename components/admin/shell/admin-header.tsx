"use client";

import { CalendarDays, Menu } from "lucide-react";

interface AdminHeaderProps {
  name: string;
  roleLabel: string;
  onOpenMenu: () => void;
}

export function AdminHeader({ name, roleLabel, onOpenMenu }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#dbe5f4] bg-[#f8fbff]/92 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
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
  );
}
