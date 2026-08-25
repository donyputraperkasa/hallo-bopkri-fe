"use client";

import Link from "next/link";
import { categoryLabel } from "@/lib/constants";
import type { Dashboard } from "@/types/api";

export function DashboardStatGrid({ data }: { data: Dashboard }) {
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
  );
}
