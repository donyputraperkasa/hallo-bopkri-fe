"use client";

import Link from "next/link";
import { ChartNoAxesColumn, ClipboardList, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

type AdminRole = "owner" | "director" | "manager";

const ownerMenus = [
  ["Dashboard", "/panel/dashboard", ChartNoAxesColumn],
  ["Daftar Aduan", "/panel/aduan", ClipboardList],
  ["Status Aduan", "/panel/status", SlidersHorizontal],
] as const;

const directorMenus = [
  ["Dashboard", "/panel/director/dashboard", ChartNoAxesColumn],
  ["Semua Aduan", "/panel/director/aduan", ClipboardList],
] as const;

const managerMenus = [
  ["Dashboard", "/panel/manager/dashboard", ChartNoAxesColumn],
  ["Aduan Bidang Saya", "/panel/manager/aduan", ClipboardList],
] as const;

function getMenus(role: AdminRole) {
  if (role === "director") return directorMenus;
  if (role === "manager") return managerMenus;
  return ownerMenus;
}

export function AdminNav({
  role = "owner",
  onItemClick,
}: {
  role?: AdminRole;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const menus = getMenus(role);

  return (
    <nav className="space-y-1">
      {menus.map(([label, href, Icon]) => {
        const active =
          pathname === href ||
          (href !== "/panel/dashboard" &&
            href !== "/panel/director/dashboard" &&
            href !== "/panel/manager/dashboard" &&
            pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            onClick={onItemClick}
            className={[
              "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition",
              active
                ? "bg-[#f2d35f] text-[#172033] shadow-sm"
                : "text-[#d7e4f5] hover:bg-white/12 hover:text-white",
            ].join(" ")}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        );
      })}

      <div className="pt-3">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-[#b8c8df] hover:bg-white/12 hover:text-white transition"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Halaman Publik
        </Link>
      </div>
    </nav>
  );
}
