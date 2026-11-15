"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChartNoAxesColumn, ClipboardList, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/client-api";
import { useAuth } from "@/hooks/use-auth";
import {
  getReadOverrides,
  isComplaintUnread,
  subscribeReadComplaints,
} from "@/lib/read-complaints";
import type { AdminRole, Complaint, ComplaintList } from "@/types";

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
  const { user } = useAuth();
  const menus = getMenus(role);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({});

  const fetchLatestComplaints = useCallback(() => {
    api<ComplaintList>("/api/admin/complaints?page=1&limit=50")
      .then((res) => {
        const bidang = user?.bidang?.toLowerCase();
        const items =
          role === "manager" && bidang
            ? res.data.filter((item) => {
                const raw = item.tags ?? item.tag ?? "";
                const tags = typeof raw === "string" ? raw.split(",").map((t) => t.trim().toLowerCase()) : [];
                return tags.includes(bidang);
              })
            : res.data;
        setComplaints(items);
      })
      .catch(() => {});
  }, [role, user?.bidang]);

  useEffect(() => {
    fetchLatestComplaints();
  }, [fetchLatestComplaints, pathname]);

  useEffect(() => {
    const unsubscribe = subscribeReadComplaints(() => {
      setReadOverrides(getReadOverrides());
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = complaints.filter((item) =>
    isComplaintUnread(item, role, readOverrides),
  ).length;

  return (
    <nav className="space-y-1">
      {menus.map(([label, href, Icon]) => {
        const active =
          pathname === href ||
          (href !== "/panel/dashboard" &&
            href !== "/panel/director/dashboard" &&
            href !== "/panel/manager/dashboard" &&
            pathname.startsWith(href));
        const isAduanMenu = href.endsWith("/aduan");

        return (
          <Link
            key={href}
            href={href}
            onClick={onItemClick}
            className={[
              "flex items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-semibold transition",
              active
                ? "bg-[#f2d35f] text-[#172033] shadow-sm"
                : "text-[#d7e4f5] hover:bg-white/12 hover:text-white",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <Icon size={18} aria-hidden="true" />
              {label}
            </span>
            {isAduanMenu && unreadCount > 0 && (
              <span
                className={[
                  "inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                  active
                    ? "bg-[#0f2a4f] text-white"
                    : "bg-[#f2d35f] text-[#172033]",
                ].join(" ")}
                title={`${unreadCount} aduan belum dibuka`}
              >
                {unreadCount}
              </span>
            )}
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
