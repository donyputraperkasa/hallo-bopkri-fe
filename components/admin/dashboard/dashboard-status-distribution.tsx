"use client";

import Link from "next/link";
import type { Dashboard } from "@/types/api";

export function DashboardStatusDistribution({ data }: { data: Dashboard }) {
  return (
    <div className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0f172a]">Distribusi Status Aduan</h2>
          <p className="mt-1 text-sm text-[#748299]">
            Ringkasan progres penanganan laporan masyarakat.
          </p>
        </div>
        <Link
          href="/masdon/status"
          className="text-sm font-semibold text-[#0f2a4f] hover:underline"
        >
          Kelola Status
        </Link>
      </div>

      <div className="mt-6 space-y-5">
        {data.byStatus.map((item) => {
          const percentage =
            data.total > 0 ? Math.round((item.count / data.total) * 100) : 0;
          return (
            <div key={item.status.id}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-[#334155]">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.status.color }}
                  />
                  {item.status.name}
                </span>
                <span className="text-[#748299]">
                  <strong className="text-[#172033]">{item.count}</strong> ({percentage}%)
                </span>
              </div>
              <div className="h-2.5 rounded-sm bg-[#e8edf6] overflow-hidden">
                <div
                  className="h-2.5 rounded-sm transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.status.color || "#0f2a4f",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
