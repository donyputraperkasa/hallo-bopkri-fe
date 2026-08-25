"use client";

import { Check, SendHorizontal } from "lucide-react";
import { BIDANG_TAGS } from "@/lib/constants";

interface ComplaintBidangCardProps {
  selectedBidangs: string[];
  isDispatching: boolean;
  onToggleBidang: (bidang: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenModal: () => void;
}

export function ComplaintBidangCard({
  selectedBidangs,
  isDispatching,
  onToggleBidang,
  onSubmit,
  onOpenModal,
}: ComplaintBidangCardProps) {
  return (
    <div className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SendHorizontal size={18} className="text-[#0f2a4f]" />
          <h3 className="font-semibold text-[#0f172a] text-base">Kirim ke Bidang</h3>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="text-[11px] font-semibold text-[#1f4f8f] hover:underline"
        >
          Modal Lengkap
        </button>
      </div>
      <p className="mt-1 text-xs text-[#748299]">
        Pilih satu atau beberapa bidang untuk meneruskan aduan ini.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="space-y-1.5">
          {BIDANG_TAGS.map((b) => {
            const isSelected = selectedBidangs.includes(b.value);
            const BidangIcon = b.icon;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => onToggleBidang(b.value)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? "border-[#0f2a4f] bg-[#eef4fb] text-[#0f2a4f] ring-1 ring-[#0f2a4f]"
                    : "border-[#dbe5f4] bg-[#f8fbff] text-[#172033] hover:border-[#b6cce8] hover:bg-white"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className={`grid size-4 place-items-center rounded border transition ${
                      isSelected
                        ? "border-[#0f2a4f] bg-[#0f2a4f] text-white"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </span>
                  <BidangIcon
                    size={14}
                    className={isSelected ? "text-[#0f2a4f]" : "text-[#748299]"}
                  />
                  <span>{b.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={isDispatching || selectedBidangs.length === 0}
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-[#0f2a4f] text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50 shadow-xs"
        >
          <SendHorizontal size={14} />
          <span>
            {isDispatching
              ? "Mengirim..."
              : selectedBidangs.length > 1
              ? `Kirim ke ${selectedBidangs.length} Bidang`
              : "Kirim ke Bidang"}
          </span>
        </button>
      </form>
    </div>
  );
}
