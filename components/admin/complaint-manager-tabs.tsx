"use client";

import { Building2 } from "lucide-react";
import { BIDANG_TAGS } from "@/lib/constants";

export function ComplaintManagerTabs({
  activeBidang,
  onSelectBidang,
}: {
  activeBidang: string;
  onSelectBidang: (bidang: string) => void;
}) {
  return (
    <div className="rounded-lg border border-[#dbe5f4] bg-white p-2 shadow-sm overflow-x-auto">
      <div className="flex min-w-max items-center gap-1.5 p-1">
        <button
          type="button"
          onClick={() => onSelectBidang("all")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition ${
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
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                isSelected
                  ? "bg-[#0f2a4f] text-white shadow-xs"
                  : "text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
              }`}
            >
              <ItemIcon size={16} className={isSelected ? "text-white" : "text-[#748299]"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
