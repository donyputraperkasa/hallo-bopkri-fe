"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { BIDANG_TAGS, getTagStyle } from "@/lib/constants";

interface TagProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  name?: string;
  placeholder?: string;
}

export function Tag({
  value,
  onChange,
  name = "tag",
  placeholder = "Pilih bidang terkait (misal: Pendidikan, Keuangan, PSDM...)",
}: TagProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = value ?? internalSelected;

  const updateSelected = (next: string[]) => {
    if (!value) {
      setInternalSelected(next);
    }
    onChange?.(next);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (optionValue: string) => {
    const exists = selected.includes(optionValue);
    const next = exists
      ? selected.filter((item) => item !== optionValue)
      : [...selected, optionValue];
    updateSelected(next);
  };

  const removeTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSelected(selected.filter((item) => item !== optionValue));
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Hidden inputs to pass data when submitted in a standard HTML Form */}
      {selected.map((item) => (
        <input key={item} type="hidden" name={name} value={item} />
      ))}
      <input type="hidden" name={`${name}s`} value={selected.join(",")} />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition-all focus:outline-none ${
          open
            ? "border-[#1f4f8f] ring-3 ring-[#1f4f8f]/15"
            : "border-stone-300 hover:border-stone-400"
        }`}
      >
        <span className="flex flex-wrap items-center gap-1.5">
          {selected.length === 0 ? (
            <span className="text-stone-400">{placeholder}</span>
          ) : (
            selected.map((item) => {
              const tagInfo = BIDANG_TAGS.find((b) => b.value === item);
              const label = tagInfo?.label ?? item;
              return (
                <span
                  key={item}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-xs ${getTagStyle(
                    item
                  )}`}
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeTag(item, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        updateSelected(selected.filter((i) => i !== item));
                      }
                    }}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
                  >
                    <X size={12} />
                  </span>
                </span>
              );
            })
          )}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#1f4f8f]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95">
          <div className="px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
            Pilih satu atau beberapa bidang
          </div>
          {BIDANG_TAGS.map((item) => {
            const isSelected = selected.includes(item.value);
            const ItemIcon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleOption(item.value)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#1f4f8f]/10 text-[#1f4f8f]"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ItemIcon size={16} className={isSelected ? "text-[#1f4f8f]" : "text-stone-500"} />
                  <span>{item.label}</span>
                </span>
                {isSelected && <Check size={16} className="text-[#1f4f8f] font-bold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const ComplaintTag = Tag;