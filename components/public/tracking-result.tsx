import { categoryLabel, formatDate } from "@/lib/constants";
import type { TrackResult } from "@/types/api";

export function TrackingResult({ data }: { data: TrackResult }) {
  return (
    <article className="surface mt-7 overflow-hidden">
      <header className="flex flex-wrap justify-between gap-4 border-b border-slate-100 p-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-slate-500">KODE TIKET</p>
          <h2 className="mt-1 font-mono text-xl font-extrabold">{data.ticketCode}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {categoryLabel(data.category)} · dibuat {formatDate(data.createdAt)}
          </p>
        </div>
        <span
          className="h-fit rounded-full px-4 py-2 text-sm font-bold"
          style={{ color: data.status.color, background: `${data.status.color}18` }}
        >
          {data.status.name}
        </span>
      </header>
      <div className="p-6">
        <h3 className="text-lg font-extrabold">Riwayat proses</h3>
        <ol className="mt-5 space-y-0">
          {data.histories.map((item, index) => (
            <li
              key={`${item.id ?? item.status.code}-${item.createdAt}-${index}`}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {index < data.histories.length - 1 && (
                <span className="absolute top-5 left-[7px] h-full w-px bg-slate-200" />
              )}
              <span
                className="relative mt-1 size-4 shrink-0 rounded-full border-4 border-white"
                style={{ background: item.status.color, boxShadow: "0 0 0 1px #d5dddc" }}
              />
              <div>
                <p className="font-bold">{item.status.name}</p>
                <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                {item.publicNote && (
                  <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    {item.publicNote}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
