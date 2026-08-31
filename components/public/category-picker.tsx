"use client";

import type { Category } from "@/types/api";
import { CATEGORIES } from "@/lib/constants";

export function CategoryPicker({
  value,
  onChange,
}: {
  value: Category;
  onChange: (value: Category) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CATEGORIES.map(({ value: item, label, icon: Icon }) => {
        const selected = value === item;
        return (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
              selected
                ? "border-[#1f4f8f] bg-[#eaf1fb] text-[#1f4f8f] shadow-xs"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <Icon size={19} className={selected ? "text-[#1f4f8f]" : "text-stone-500"} />
            <span className={`text-sm ${selected ? "font-bold text-[#1f4f8f]" : "font-semibold text-stone-800"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
