"use client";

import Link from "next/link";
import { Home, Search, Send } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  ["Beranda", "/", Home],
  ["Kirim Aduan", "/kirim-aduan", Send],
  ["Lacak Tiket", "/lacak-aduan", Search],
] as const;

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-lg border border-[#d8e3f4] bg-white/80 p-1 shadow-xs backdrop-blur-md">
      {links.map(([label, href, Icon]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
              active
                ? "bg-[#1f4f8f] text-white shadow-xs"
                : "text-[#526078] hover:bg-[#eef3fb] hover:text-[#1f4f8f]"
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
