"use client";

import { CheckCheck, MailOpen } from "lucide-react";
import type { ComplaintReadBarProps } from "@/types";

export function ComplaintReadBar({
  unreadCount,
  readCount,
  onMarkAllRead,
}: ComplaintReadBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5edf9] bg-[#fdfefe] px-5 py-2.5 text-xs">
      <div className="flex items-center gap-4 text-[#526078]">
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#0f2a4f]">
          <span className="size-2 rounded-full bg-[#2563eb]" />
          Belum dibuka ({unreadCount})
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#748299]">
          <MailOpen size={13} className="text-[#94a3b8]" />
          Sudah dibuka ({readCount})
        </span>
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#cfe0f5] bg-[#f4f8ff] px-2.5 py-1 text-xs font-semibold text-[#1f4f8f] transition hover:bg-[#e5f0ff] cursor-pointer"
        >
          <CheckCheck size={13} />
          Tandai semua sudah dibuka
        </button>
      )}
    </div>
  );
}

