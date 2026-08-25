"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, LoaderCircle } from "lucide-react";
import { api } from "@/lib/client-api";
import type { Dashboard } from "@/types/api";
import { DashboardStatGrid } from "./dashboard-stat-grid";
import { DashboardStatusDistribution } from "./dashboard-status-distribution";
import { DashboardQuickActions } from "./dashboard-quick-actions";

export function DashboardView() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Dashboard>("/api/admin/complaints/dashboard")
      .then(setData)
      .catch((reason) => {
        setError(reason.message);
      });
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0f172a]">Ruang Kendali Hallo BOPKRI</h2>
            <p className="mt-1 text-sm text-[#748299]">
              Pantau laporan masyarakat, tindak lanjuti aduan, dan kelola alur status dari satu tempat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/masdon/aduan"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f2a4f] px-4 text-sm font-semibold text-white transition hover:bg-[#173b6b]"
            >
              <ClipboardList size={16} aria-hidden="true" />
              Lihat Seluruh Aduan
            </Link>
          </div>
        </div>
      </section>

      <DashboardStatGrid data={data} />

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <DashboardStatusDistribution data={data} />
        <DashboardQuickActions total={data.total} />
      </section>
    </div>
  );
}
