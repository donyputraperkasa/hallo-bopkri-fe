"use client";

import { LoaderCircle } from "lucide-react";
import type { ComplaintStatus } from "@/types/api";

interface StatusListSectionProps {
  statuses: ComplaintStatus[] | null;
  onToggle: (item: ComplaintStatus) => void;
}

export function StatusListSection({ statuses, onToggle }: StatusListSectionProps) {
  return (
    <section className="rounded-lg border border-[#dbe5f4] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[#dbe5f4] bg-[#f8fbff] px-5 py-3.5">
        <h3 className="text-sm font-semibold text-[#0f172a]">Daftar Status Terdaftar</h3>
      </div>

      {!statuses ? (
        <div className="flex justify-center py-10">
          <LoaderCircle className="size-6 animate-spin text-[#0f2a4f]" />
        </div>
      ) : (
        <div className="divide-y divide-[#eef3fb]">
          {statuses.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-5 transition hover:bg-[#f8fbff]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3.5 rounded-full shadow-xs shrink-0"
                  style={{ background: item.color }}
                />
                <div>
                  <p className="font-semibold text-sm text-[#172033]">{item.name}</p>
                  <p className="font-mono text-xs text-[#748299]">{item.code}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggle(item)}
                disabled={item.code === "NEW"}
                className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-semibold transition ${
                  item.isActive === false
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    : "border-[#dbe5f4] bg-white text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={item.code === "NEW" ? "Status awal wajib tetap aktif" : undefined}
              >
                {item.isActive === false ? "Aktifkan" : "Nonaktifkan"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
