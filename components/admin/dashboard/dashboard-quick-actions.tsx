"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, PlusCircle, SlidersHorizontal } from "lucide-react";

export function DashboardQuickActions({ total }: { total: number }) {
  return (
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
        Total <strong>{total}</strong> laporan tercatat di database Hallo BOPKRI.
      </div>
    </div>
  );
}
