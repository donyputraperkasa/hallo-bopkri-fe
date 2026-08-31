import { formatDate } from "@/lib/constants";
import type { ComplaintHistory } from "@/types/api";
import { Clock } from "lucide-react";

export function TrackingHistoryTimeline({ histories }: { histories: ComplaintHistory[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock size={18} className="text-[#1f4f8f]" />
        <h3 className="text-base font-extrabold text-stone-900">Riwayat Penanganan Aduan</h3>
      </div>

      <ol className="mt-4 space-y-0">
        {histories.map((item, index) => (
          <li
            key={`${item.id ?? item.status.code}-${item.createdAt}-${index}`}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {index < histories.length - 1 && (
              <span className="absolute top-6 left-[11px] h-full w-0.5 bg-stone-200" />
            )}
            <span
              className="relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white shadow-xs"
              style={{ border: `2px solid ${item.status.color}` }}
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
  );
}
