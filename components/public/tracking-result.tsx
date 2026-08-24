import { categoryLabel, formatDate } from "@/lib/constants";
import type { TrackResult } from "@/types/api";
import { CheckCircle2, Clock, FileText } from "lucide-react";

export function TrackingResult({ data }: { data: TrackResult }) {
  return (
    <article className="surface mt-8 overflow-hidden border border-stone-200/90 shadow-xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-gradient-to-r from-stone-50 via-white to-stone-50 p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#1f4f8f]/10 text-[#1f4f8f]">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">KODE TIKET RESMI</p>
            <h2 className="mt-0.5 font-mono text-2xl font-black text-[#1f4f8f] tracking-wide">{data.ticketCode}</h2>
            <p className="mt-1 text-xs text-stone-500">
              Kategori: <span className="font-semibold text-stone-700">{categoryLabel(data.category)}</span> · Diajukan pada {formatDate(data.createdAt)}
            </p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-xs"
          style={{
            color: data.status.color,
            backgroundColor: `${data.status.color}15`,
            border: `1px solid ${data.status.color}40`,
          }}
        >
          <span className="size-2 rounded-full" style={{ backgroundColor: data.status.color }} />
          {data.status.name}
        </span>
      </header>

      <div className="p-6 sm:p-8 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={18} className="text-[#1f4f8f]" />
          <h3 className="text-base font-extrabold text-stone-900">Riwayat Penanganan Aduan</h3>
        </div>

        <ol className="mt-4 space-y-0">
          {data.histories.map((item, index) => (
            <li
              key={`${item.id ?? item.status.code}-${item.createdAt}-${index}`}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {index < data.histories.length - 1 && (
                <span className="absolute top-6 left-[11px] h-full w-0.5 bg-stone-200" />
              )}
              <span
                className="relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white shadow-xs"
                style={{
                  border: `2px solid ${item.status.color}`,
                }}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: item.status.color }} />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold text-stone-800">{item.status.name}</p>
                  <p className="text-xs text-stone-400">{formatDate(item.createdAt)}</p>
                </div>
                {item.publicNote && (
                  <div className="mt-2.5 rounded-xl border border-stone-200/70 bg-stone-50/80 p-3.5 text-sm text-stone-700 leading-relaxed">
                    <p className="text-xs font-semibold text-stone-500 mb-1">Catatan Tim Penindaklanjut:</p>
                    {item.publicNote}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
