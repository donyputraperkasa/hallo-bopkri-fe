"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { BIDANG_TAGS, getTagStyle } from "@/lib/constants";
import type { ManagerStatItem } from "@/types";

export function ManagerHeaderBanner({ bidang }: { bidang: string }) {
  const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === bidang.toLowerCase());
  const BidangIcon = tagInfo?.icon;

  return (
    <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[#0f172a]">
              Portal Manajer {tagInfo?.label ?? bidang}
            </h2>
            {bidang && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getTagStyle(
                  bidang,
                )}`}
              >
                {BidangIcon && <BidangIcon size={12} />}
                {tagInfo?.label ?? bidang}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#748299]">
            Daftar formulis yang telah didisposisikan secara khusus oleh admin untuk bidang tugas Anda.
          </p>
        </div>

        <Link
          href="/panel/manager/aduan"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f2a4f] px-4 text-sm font-semibold text-white transition hover:bg-[#173b6b]"
        >
          <ClipboardList size={16} aria-hidden="true" />
          Buka Semua Formulis
        </Link>
      </div>
    </section>
  );
}

export function ManagerStatGrid({ stats }: { stats: ManagerStatItem[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
  );
}

