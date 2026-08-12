"use client";

import Link from "next/link";
import { ChartNoAxesColumn, ClipboardList, SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const menus = [
  ["Dashboard", "/masdon/dashboard", ChartNoAxesColumn],
  ["Daftar Aduan", "/masdon/aduan", ClipboardList],
  ["Status Aduan", "/masdon/status", SlidersHorizontal],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-7 flex gap-2 overflow-x-auto lg:flex-col">
      {menus.map(([label, href, Icon]) => {
        const active = href === "/masdon/aduan"
          ? pathname.startsWith(href)
          : pathname === href;
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
