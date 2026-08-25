"use client";

import { Info } from "lucide-react";
import type { AdminUser } from "./dispatch-types";

interface DispatchSummaryBoxProps {
  selectedUsers: AdminUser[];
}

export function DispatchSummaryBox({ selectedUsers }: DispatchSummaryBoxProps) {
  if (selectedUsers.length === 0) {
    return (
      <div className="rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
        Pilih minimal satu penerima untuk meneruskan aduan.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 leading-relaxed space-y-1">
      <div className="flex items-center gap-1.5 font-bold text-amber-950">
        <Info size={14} className="shrink-0" />
        <span>
          Aduan akan dikirimkan ke {selectedUsers.length} penerima:
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {selectedUsers.map((u) => (
          <span
            key={u.id}
            className="inline-flex items-center rounded-md bg-amber-200/70 px-2 py-0.5 text-xs font-semibold text-amber-900 border border-amber-300/60"
          >
            {u.displayName ?? u.username}
            {u.bidang ? ` (${u.bidang})` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
