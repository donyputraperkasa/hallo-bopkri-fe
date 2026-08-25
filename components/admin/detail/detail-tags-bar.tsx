"use client";

import { SendHorizontal } from "lucide-react";
import { BIDANG_TAGS, getTagStyle } from "@/lib/constants";
import type { Complaint } from "@/types/api";

interface DetailTagsBarProps {
  tags: string[];
  current: Complaint;
  readOnly: boolean;
  onOpenDispatch: (c: Complaint) => void;
}

export function DetailTagsBar({
  tags,
  current,
  readOnly,
  onOpenDispatch,
}: DetailTagsBarProps) {
  return (
    <div>
      <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-1.5">
        Bidang Terkait
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.length === 0 ? (
          <span className="text-xs text-[#8b98ad] italic">Belum ditentukan bidang</span>
        ) : (
          tags.map((t) => {
            const tagInfo = BIDANG_TAGS.find(
              (b) => b.value.toLowerCase() === t.toLowerCase()
            );
            const TagItemIcon = tagInfo?.icon;
            return (
              <span
                key={t}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${getTagStyle(
                  t
                )}`}
              >
                {TagItemIcon && <TagItemIcon size={13} />}
                <span>{tagInfo?.label ?? t}</span>
              </span>
            );
          })
        )}
        {!readOnly && (
          <button
            type="button"
            onClick={() => onOpenDispatch(current)}
            className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 ml-1 transition"
          >
            <SendHorizontal size={12} className="text-amber-700" />
            <span>+ Kirim ke Bidang</span>
          </button>
        )}
      </div>
    </div>
  );
}
