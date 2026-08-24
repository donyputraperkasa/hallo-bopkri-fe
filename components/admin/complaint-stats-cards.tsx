"use client";

import { BIDANG_TAGS } from "@/lib/constants";

export function ComplaintStatsCards({
  activeBidang,
  stats,
}: {
  activeBidang: string;
  stats: { total: number; pending: number; completed: number; hasAttachments: number };
}) {
  const activeManagerInfo = BIDANG_TAGS.find((b) => b.value === activeBidang);
  const scopeLabel = activeBidang === "all" ? "Seluruh bidang" : `Bidang ${activeManagerInfo?.label}`;

  const items = [
    {
      label: "Total Aduan",
      value: String(stats.total),
      note: scopeLabel,
    },
    {
      label: "Dalam Proses",
      value: String(stats.pending),
      note: "Perlu tindak lanjut",
    },
    {
      label: "Telah Selesai",
      value: String(stats.completed),
      note: "Laporan tuntas",
    },
    {
      label: "Ada Lampiran",
      value: String(stats.hasAttachments),
      note: "Disertai bukti berkas",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-[#dbe5f4] bg-white p-4 shadow-sm transition sm:p-5 hover:-translate-y-0.5 hover:border-[#b6cce8] hover:shadow-md"
        >
          <p className="text-sm font-semibold text-[#748299]">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold sm:text-3xl text-[#172033]">
            {item.value}
          </p>
          <p className="mt-2 text-xs text-[#8b98ad]">{item.note}</p>
        </article>
      ))}
    </div>
  );
}
