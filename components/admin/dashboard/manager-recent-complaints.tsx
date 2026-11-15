"use client";

import Link from "next/link";
import { Mail, MailOpen } from "lucide-react";
import { getDisplayStatusName, isComplaintUnread } from "@/lib/read-complaints";
import type { ManagerRecentComplaintsProps } from "@/types";

export function ManagerRecentComplaints({
  items,
  readOverrides,
}: ManagerRecentComplaintsProps) {
  return (
    <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0f172a]">Aduan Terbaru Bidang Anda</h2>
          <p className="mt-1 text-sm text-[#748299]">
            10 laporan terbaru yang membutuhkan tindak lanjut.
          </p>
        </div>
        <Link
          href="/panel/manager/aduan"
          className="text-sm font-semibold text-[#0f2a4f] hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm font-semibold text-[#748299]">
            Belum ada aduan yang dikirim ke bidang Anda.
          </p>
        ) : (
          items.slice(0, 5).map((item) => {
            const isUnread = isComplaintUnread(item, "manager", readOverrides);
            const displayStatusName = getDisplayStatusName(item, "manager", isUnread);
            return (
              <Link
                key={item.id}
                href="/panel/manager/aduan"
                className={[
                  "flex items-center justify-between rounded-lg border border-l-4 p-4 transition",
                  isUnread
                    ? "border-[#cfe0f5] border-l-[#2563eb] bg-[#eff6ff]/70 hover:bg-[#e5f0ff]/80"
                    : "border-[#dbe5f4] border-l-transparent bg-[#f8fbff] hover:border-[#b6cce8] hover:bg-white",
                ].join(" ")}
              >
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    {isUnread ? (
                      <Mail size={14} className="text-[#2563eb] shrink-0" />
                    ) : (
                      <MailOpen size={14} className="text-[#94a3b8] shrink-0" />
                    )}
                    <span
                      className={[
                        "font-mono text-xs",
                        isUnread ? "font-bold text-[#0f2a4f]" : "font-semibold text-[#1f4f8f]",
                      ].join(" ")}
                    >
                      {item.ticketCode}
                    </span>
                    {isUnread && (
                      <span className="inline-flex items-center rounded-full bg-[#2563eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Baru
                      </span>
                    )}
                  </div>
                  <p
                    className={[
                      "mt-1 truncate text-sm",
                      isUnread ? "font-bold text-[#0f172a]" : "font-medium text-[#475569]",
                    ].join(" ")}
                  >
                    {item.content}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: `${item.status.color}18`,
                    color: item.status.color,
                  }}
                >
                  {displayStatusName}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
