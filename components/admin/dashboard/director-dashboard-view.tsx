"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, LoaderCircle } from "lucide-react";
import { api } from "@/lib/client-api";
import { categoryLabel } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import type { Dashboard } from "@/types/api";

export function DirectorDashboardView() {
  const { user } = useAuth();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Dashboard>("/api/admin/complaints/dashboard")
      .then(setData)
      .catch((r) => setError(r.message));
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

  const stats = [
    {
      href: "/masdon/director/aduan",
      label: "Total Aduan",
      value: String(data.total),
      note: "Semua laporan yayasan",
    },
    ...data.byCategory.map((item) => ({
      href: `/masdon/director/aduan?category=${item.category}`,
      label: categoryLabel(item.category),
      value: String(item._count),
      note: "Kategori aduan",
    })),
  ];

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0f172a]">
              Overview Direktur Yayasan BOPKRI
            </h2>
            <p className="mt-1 text-sm text-[#748299]">
              Pantau seluruh aduan, aspirasi, dan apresiasi yang masuk secara menyeluruh.
            </p>
          </div>

          <Link
            href="/masdon/director/aduan"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f2a4f] px-4 text-sm font-semibold text-white transition hover:bg-[#173b6b]"
          >
            <ClipboardList size={16} aria-hidden="true" />
            Lihat Semua Aduan
          </Link>
        </div>
      </section>

      {/* Stat Grid */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block rounded-lg border border-[#dbe5f4] bg-white p-4 shadow-sm transition sm:p-5 hover:-translate-y-0.5 hover:border-[#b6cce8] hover:shadow-md"
          >
            <p className="text-sm font-semibold text-[#748299]">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold sm:text-3xl text-[#172033]">
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-[#8b98ad]">{stat.note}</p>
          </Link>
        ))}
      </section>

      {/* Status Distribution */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0f172a]">Distribusi Status Aduan</h2>
            <p className="mt-1 text-sm text-[#748299]">
              Monitoring status tindak lanjut aduan di seluruh bidang.
            </p>
          </div>
          <Link
            href="/masdon/director/aduan"
            className="text-sm font-semibold text-[#0f2a4f] hover:underline"
          >
            Buka Daftar Aduan
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.byStatus.map((item) => (
            <div
              key={item.status.id}
              className="flex items-center justify-between rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-4 transition hover:border-[#b6cce8] hover:bg-white"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-[#172033]">
                <i
                  className="size-2.5 rounded-full"
                  style={{ background: item.status.color }}
                />
                {item.status.name}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f2a4f] shadow-xs border border-[#dbe5f4]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
