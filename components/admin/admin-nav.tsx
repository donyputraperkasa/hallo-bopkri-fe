"use client";

import Link from "next/link";
import { ChartNoAxesColumn, ClipboardList, SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

type AdminRole = "OWNER" | "DIRECTOR" | "MANAGER";

const ownerMenus = [
  ["Dashboard", "/masdon/dashboard", ChartNoAxesColumn],
  ["Daftar Aduan", "/masdon/aduan", ClipboardList],
  ["Status Aduan", "/masdon/status", SlidersHorizontal],
] as const;

const directorMenus = [
  ["Dashboard", "/masdon/director/dashboard", ChartNoAxesColumn],
  ["Semua Aduan", "/masdon/director/aduan", ClipboardList],
] as const;

const managerMenus = [
  ["Dashboard", "/masdon/manager/dashboard", ChartNoAxesColumn],
  ["Aduan Bidang Saya", "/masdon/manager/aduan", ClipboardList],
] as const;

function getMenus(role: AdminRole) {
  if (role === "DIRECTOR") return directorMenus;
  if (role === "MANAGER") return managerMenus;
  return ownerMenus;
}

export function AdminNav({ role = "OWNER" }: { role?: AdminRole }) {
  const pathname = usePathname();
  const menus = getMenus(role);

  return (
    <nav className="mt-7 flex gap-2 overflow-x-auto lg:flex-col">
      {menus.map(([label, href, Icon]) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
              active
                ? "bg-white text-[#1f4f8f] shadow-lg"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
