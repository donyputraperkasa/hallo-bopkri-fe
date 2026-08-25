"use client";

import { X } from "lucide-react";
import { categoryLabel } from "@/lib/constants";
import type { Complaint } from "@/types/api";

interface DetailModalHeaderProps {
  current: Complaint;
  onClose: () => void;
}

export function DetailModalHeader({ current, onClose }: DetailModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#dbe5f4] bg-[#f8fbff] px-6 py-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm sm:text-base font-semibold text-[#1f4f8f]">
            {current.ticketCode}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{
              color: current.status.color,
              backgroundColor: `${current.status.color}18`,
            }}
          >
            {current.status.name}
          </span>
        </div>
        <h3 className="mt-0.5 text-lg font-semibold text-[#0f172a]">
          {categoryLabel(current.category)}
        </h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-[#748299] hover:bg-[#eef4fb] hover:text-[#0f2a4f] transition"
        title="Tutup (Esc)"
      >
        <X size={20} />
      </button>
    </div>
  );
}
