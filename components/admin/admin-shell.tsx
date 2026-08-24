"use client";

import { Crown, Briefcase, Users } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { AdminNav } from "./admin-nav";
import { LogoutButton } from "./logout-button";
import { useAuth } from "@/hooks/use-auth";

interface AdminShellProps {
  children: React.ReactNode;
  role?: "OWNER" | "DIRECTOR" | "MANAGER";
  displayName?: string;
  bidang?: string | null;
}

type AdminRole = "OWNER" | "DIRECTOR" | "MANAGER";

const roleConfig: Record<AdminRole, {
  label: string;
  Icon: typeof Crown;
  panelLabel: string;
  greeting: string;
  // Warna diselaraskan dengan logo BOPKRI (navy #1e2d6b, biru #2d4ba0, emas #d4b84a)
  gradient: string;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
}> = {
  OWNER: {
    label: "Owner",
    Icon: Crown,
    panelLabel: "Owner Panel",
    greeting: "Ruang Kendali Hallo BOPKRI",
    gradient: "from-[#0f1c4d] via-[#1e2d6b] to-[#2d3b9a]",
    badgeBg: "bg-[#d4b84a]/20 border-[#d4b84a]/40",
    badgeText: "text-[#f0d878]",
    iconColor: "text-[#f0d878]",
  },
  DIRECTOR: {
    label: "Direktur",
    Icon: Briefcase,
    panelLabel: "Director Panel",
    greeting: "Pantau Seluruh Aduan",
    gradient: "from-[#0f1c4d] via-[#1a2d6b] to-[#1e4080]",
    badgeBg: "bg-sky-400/15 border-sky-300/40",
    badgeText: "text-sky-200",
    iconColor: "text-sky-300",
  },
  MANAGER: {
    label: "Manajer",
    Icon: Users,
    panelLabel: "Manager Panel",
    greeting: "Aduan Bidang Anda",
    gradient: "from-[#0f2518] via-[#1a4030] to-[#1e5c3a]",
    badgeBg: "bg-emerald-400/15 border-emerald-300/40",
    badgeText: "text-emerald-200",
    iconColor: "text-emerald-300",
  },
};

export function AdminShell({
  children,
  role: forcedRole,
  displayName: forcedName,
  bidang: forcedBidang,
}: AdminShellProps) {
  const { user } = useAuth();
  const role = forcedRole ?? user?.role ?? "OWNER";
  const name = forcedName ?? user?.displayName ?? "—";
  const bidang = forcedBidang ?? user?.bidang;
  const cfg = roleConfig[role];
  const RoleIcon = cfg.Icon;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f0f4fb]">
      {/* ── Sidebar ── */}
      <aside
        className={`relative flex flex-col overflow-hidden bg-gradient-to-b ${cfg.gradient} p-5 lg:sticky lg:top-0 lg:h-screen lg:w-66 lg:shrink-0`}
      >
        {/* Decorative ring matching logo circle */}
        <span className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full border-[32px] border-white/5" />
        <span className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full border-[20px] border-white/4" />

        {/* Logo */}
        <div className="relative">
          <Brand
            href={
              role === "OWNER"
                ? "/masdon/dashboard"
                : role === "DIRECTOR"
                ? "/masdon/director/dashboard"
                : "/masdon/manager/dashboard"
            }
            inverse
          />
        </div>

        {/* Navigation */}
        <div className="relative mt-1">
          <AdminNav role={role} />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User info card + Logout — sekarang di sidebar */}
        <div className="relative mt-4 space-y-2">
          {/* User card */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-blue-50 backdrop-blur-xs">
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className={`grid size-8 place-items-center rounded-xl bg-white/15 ${cfg.iconColor}`}
              >
                <RoleIcon size={16} />
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeText}`}
              >
                {cfg.label}
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">{name}</p>
            {bidang && (
              <p className="mt-0.5 text-[11px] text-white/60">Bidang: {bidang}</p>
            )}
          </div>

          {/* Logout button */}
          <LogoutButton variant="sidebar" />
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Slim header — hanya label panel, tanpa tombol logout */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#d4ddf0] bg-white/92 px-5 shadow-xs backdrop-blur-md sm:px-8">
          <div>
            <p className="text-[10px] font-extrabold tracking-widest text-[#d4b84a] uppercase">
              {cfg.panelLabel}
            </p>
            <p className="text-sm font-bold text-[#1e2d6b]">{cfg.greeting}</p>
          </div>
          {/* Nama user saja — logout sudah di sidebar */}
          <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#c8d6ee] bg-[#eef3fb] px-3 py-1 text-xs font-semibold text-[#1e2d6b]">
            <RoleIcon size={12} className="text-[#2d4ba0]" />
            {name}
          </span>
        </header>

        <main className="flex-1 min-h-[calc(100vh-56px)] bg-[radial-gradient(circle_at_95%_0%,#dce8f8_0,transparent_24rem)] p-4 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
