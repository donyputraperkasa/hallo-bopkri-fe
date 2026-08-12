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
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
              selected
                ? "border-[#1f4f8f] bg-[#eaf1fb] text-[#1f4f8f]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Icon size={19} />
            <span className="text-sm font-bold">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
