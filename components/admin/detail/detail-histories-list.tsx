"use client";

import { formatDate } from "@/lib/constants";
import type { ComplaintHistory } from "@/types/api";

export function DetailHistoriesList({ histories }: { histories?: ComplaintHistory[] }) {
  if (!histories || histories.length === 0) return null;

  return (
    <div>
      <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-2">
        Riwayat Tindak Lanjut
      </span>
      <div className="space-y-2.5 rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-3.5">
        {histories.map((h, idx) => (
          <div
            key={h.id ?? idx}
            className="border-l-2 pl-3"
            style={{ borderColor: h.status.color }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-semibold text-xs text-[#0f172a]">{h.status.name}</p>
              <p className="text-[11px] text-[#748299]">{formatDate(h.createdAt)}</p>
            </div>
            {h.publicNote && (
              <p className="mt-1 text-xs text-[#526078] bg-white p-2.5 rounded-md border border-[#dbe5f4]">
                {h.publicNote}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
