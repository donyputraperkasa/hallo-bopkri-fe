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
    <nav className="flex items-center gap-1.5 sm:gap-5">
      {links.map(([label, href, Icon]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`group relative flex items-center gap-1.5 px-2.5 py-2 text-xs sm:text-sm transition-all duration-200 ${
              active
                ? "font-semibold text-[#1f4f8f]"
                : "font-medium text-slate-600 hover:text-[#1f4f8f]"
            }`}
          >
            <Icon
              size={17}
              className={`transition-colors duration-200 ${
                active
                  ? "text-[#1f4f8f]"
                  : "text-slate-400 group-hover:text-[#1f4f8f]"
              }`}
            />
            <span className="hidden sm:inline">{label}</span>

            {/* Indikator garis bawah aktif & hover */}
            <span
              className={`absolute bottom-0 left-1 right-1 h-0.5 rounded-full transition-all duration-300 ${
                active
                  ? "bg-[#1f4f8f] opacity-100 scale-x-100"
                  : "bg-[#1f4f8f] opacity-0 scale-x-0 group-hover:opacity-35 group-hover:scale-x-75"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
