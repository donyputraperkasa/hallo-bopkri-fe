"use client";

import { Building2, Filter, RotateCcw } from "lucide-react";
import { BIDANG_TAGS } from "@/lib/constants";

export function ComplaintManagerTabs({
  activeBidang,
  onSelectBidang,
}: {
  activeBidang: string;
  onSelectBidang: (bidang: string) => void;
}) {
  const activeItem = BIDANG_TAGS.find(
    (b) => b.value.toLowerCase() === activeBidang.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#dbe5f4] bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Tab Buttons (Scrollable on small screens) */}
      <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto p-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onSelectBidang("all")}
          className={`flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
            activeBidang === "all"
              ? "bg-[#0f2a4f] text-white shadow-xs"
              : "text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
          }`}
        >
          <Building2 size={16} />
          <span>Semua Bidang</span>
        </button>

        {BIDANG_TAGS.map((item) => {
          const isSelected = activeBidang === item.value;
          const ItemIcon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelectBidang(item.value)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                isSelected
                  ? "bg-[#0f2a4f] text-white shadow-xs"
                  : "text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
              }`}
            >
              <ItemIcon
                size={16}
                className={isSelected ? "text-white" : "text-[#748299]"}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Side Filter Status & Reset */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#f0f4f9] px-2 pt-2 sm:border-t-0 sm:border-l sm:border-[#dbe5f4] sm:pl-3 sm:pr-1 sm:pt-0">
        {activeBidang === "all" ? (
          <div className="flex items-center gap-1.5 rounded-md bg-[#f8fbff] border border-[#e2ecf9] px-2.5 py-1.5 text-xs text-[#526078]">
            <Filter size={13} className="text-[#0f2a4f]" />
            <span className="font-medium">
              Filter: <strong className="text-[#0f2a4f]">Semua Bidang</strong>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md bg-[#eef5fc] border border-[#cbdff7] px-2.5 py-1.5 text-xs text-[#0f2a4f]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">
                Bidang: <strong className="font-semibold">{activeItem?.label || activeBidang}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectBidang("all")}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#dbe5f4] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#526078] hover:border-[#0f2a4f] hover:bg-[#f8fbff] hover:text-[#0f2a4f] transition cursor-pointer"
              title="Kembalikan filter ke Semua Bidang"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
