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
    <div className="surface p-2 overflow-x-auto">
      <div className="flex min-w-max items-center gap-1.5 p-1">
        <button
          type="button"
          onClick={() => onSelectBidang("all")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeBidang === "all"
              ? "bg-[#1f4f8f] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100 hover:text-[#173f78]"
          }`}
        >
          <Building2 size={16} />
          <span>Semua</span>
        </button>

        {BIDANG_TAGS.map((item) => {
          const isSelected = activeBidang === item.value;
          const ItemIcon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelectBidang(item.value)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isSelected
                  ? "bg-[#1f4f8f] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#173f78]"
              }`}
            >
              <ItemIcon size={16} className={isSelected ? "text-white" : "text-slate-500"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
