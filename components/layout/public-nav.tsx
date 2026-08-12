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
    <nav className="flex items-center gap-1 rounded-2xl border border-white/70 bg-white/65 p-1.5 shadow-sm backdrop-blur">
      {links.map(([label, href, Icon]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
              active
                ? "bg-[#1f4f8f] text-white shadow-md"
                : "text-[#40516e] hover:bg-white hover:text-[#1f4f8f]"
            }`}
          >
            <Icon size={17} />
            <span className="hidden md:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
