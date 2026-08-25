"use client";

import { Calendar, Phone, User } from "lucide-react";
import { formatDate } from "@/lib/constants";
import type { Complaint } from "@/types/api";

export function DetailReporterGrid({ item }: { item: Complaint }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-4 text-xs">
      <div>
        <span className="text-[#748299] flex items-center gap-1 font-medium mb-0.5">
          <User size={13} /> Pelapor
        </span>
        <p className="font-semibold text-[#172033] truncate">
          {item.reporterName || "Anonim"}
        </p>
      </div>
      <div>
        <span className="text-[#748299] flex items-center gap-1 font-medium mb-0.5">
          <Phone size={13} /> Kontak
        </span>
        <p className="font-semibold text-[#172033] truncate">
          {item.contact || "-"}
        </p>
      </div>
      <div>
        <span className="text-[#748299] flex items-center gap-1 font-medium mb-0.5">
          <Calendar size={13} /> Tanggal Masuk
        </span>
        <p className="font-semibold text-[#172033] truncate">
          {formatDate(item.createdAt)}
        </p>
      </div>
    </div>
  );
}
