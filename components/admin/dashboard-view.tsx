"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "@/lib/client-api";
import { categoryLabel } from "@/lib/constants";
import type { Dashboard } from "@/types/api";

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

  const stats = [
    {
      href: "/masdon/aduan",
      label: "Total Aduan",
      value: String(data.total),
      note: "Semua laporan masuk",
    },
    ...data.byCategory.map((item) => ({
      href: `/masdon/aduan?category=${item.category}`,
      label: categoryLabel(item.category),
      value: String(item._count),
      note: "Kategori aduan",
    })),
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner / Search Card */}
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

      {/* Progress & Quick Actions 2-Column Section */}
      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        {/* Status Distribution Progress Card */}
        <div className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0f172a]">Distribusi Status Aduan</h2>
              <p className="mt-1 text-sm text-[#748299]">
                Ringkasan progres penanganan laporan masyarakat.
              </p>
            </div>
            <Link href="/masdon/status" className="text-sm font-semibold text-[#0f2a4f] hover:underline">
              Kelola Status
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {data.byStatus.map((item) => {
              const percentage = data.total > 0 ? Math.round((item.count / data.total) * 100) : 0;
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

        {/* Quick Actions Card */}
        <div className="rounded-lg border border-[#173b6b] bg-[#0f2a4f] p-5 text-white shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">Aksi Cepat</h2>
            <p className="mt-2 text-sm leading-6 text-[#c9d5ec]">
              Akses cepat fungsi pengelolaan aduan dan monitoring dari satu tempat.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/masdon/aduan"
                className="flex w-full items-center justify-between rounded-md bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/14"
              >
                <span className="flex items-center gap-3">
                  <ClipboardList size={17} aria-hidden="true" />
                  Daftar Aduan Masuk
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <Link
                href="/masdon/status"
                className="flex w-full items-center justify-between rounded-md bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/14"
              >
                <span className="flex items-center gap-3">
                  <SlidersHorizontal size={17} aria-hidden="true" />
                  Kelola Status Aduan
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <Link
                href="/kirim-aduan"
                target="_blank"
                className="flex w-full items-center justify-between rounded-md bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/14"
              >
                <span className="flex items-center gap-3">
                  <PlusCircle size={17} aria-hidden="true" />
                  Buat Laporan Baru
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-white/5 p-3 text-xs text-[#b8c8df]">
            Total <strong>{data.total}</strong> laporan tercatat di database Hallo BOPKRI.
          </div>
        </div>
      </section>
    </div>
  );
}
