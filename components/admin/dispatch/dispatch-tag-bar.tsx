"use client";

import { Sparkles, Tag as TagIcon } from "lucide-react";
import { BIDANG_TAGS, getTagStyle } from "@/lib/constants";

interface DispatchTagBarProps {
  tags: string[];
  matchingCount: number;
  onSelectMatching: () => void;
}

export function DispatchTagBar({
  tags,
  matchingCount,
  onSelectMatching,
}: DispatchTagBarProps) {
  if (tags.length === 0) return null;

  return (
    <div className="rounded-lg border border-[#cfe0f5] bg-[#f8fbff] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-xs font-semibold text-[#748299]">
            <TagIcon size={12} /> Tag Aduan:
          </span>
          {tags.map((t) => {
            const tagInfo = BIDANG_TAGS.find(
              (b) => b.value.toLowerCase() === t.toLowerCase()
            );
            const TagIconComponent = tagInfo?.icon;
            return (
              <span
                key={t}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${getTagStyle(
                  t
                )}`}
              >
                {TagIconComponent && <TagIconComponent size={11} />}
                <span>{tagInfo?.label ?? t}</span>
              </span>
            );
          })}
        </div>

        {matchingCount > 0 && (
          <button
            type="button"
            onClick={onSelectMatching}
            className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition"
            title="Pilih otomatis manajer yang sesuai dengan tag aduan ini"
          >
            <Sparkles size={12} />
            <span>Pilih Sesuai Tag</span>
          </button>
        )}
      </div>
    </div>
  );
}
