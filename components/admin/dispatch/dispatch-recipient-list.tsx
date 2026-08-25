"use client";

import { Briefcase, Check, CheckCheck, RotateCcw, Users } from "lucide-react";
import { BIDANG_TAGS } from "@/lib/constants";
import type { AdminUser } from "./dispatch-types";

interface DispatchRecipientListProps {
  directors: AdminUser[];
  managers: AdminUser[];
  selectedIds: string[];
  complaintTags: string[];
  onToggle: (userId: string) => void;
  onSelectAllManagers: () => void;
  onClear: () => void;
}

export function DispatchRecipientList({
  directors,
  managers,
  selectedIds,
  complaintTags,
  onToggle,
  onSelectAllManagers,
  onClear,
}: DispatchRecipientListProps) {
  const totalUsers = directors.length + managers.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#748299]">
          Pilih Penerima ({selectedIds.length} dipilih)
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onSelectAllManagers}
            className="text-[#1f4f8f] hover:underline font-semibold flex items-center gap-1"
          >
            <CheckCheck size={12} /> Semua Manajer
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={onClear}
            className="text-[#748299] hover:underline font-semibold flex items-center gap-1"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      {directors.length > 0 && (
        <div className="mt-2">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
            <Briefcase size={11} /> Direktur
          </p>
          <div className="space-y-1.5">
            {directors.map((u) => {
              const isSelected = selectedIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onToggle(u.id)}
                  className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                    isSelected
                      ? "border-[#0f2a4f] bg-[#eef4fb] text-[#0f2a4f] ring-1 ring-[#0f2a4f]"
                      : "border-[#dbe5f4] bg-[#f8fbff] text-[#172033] hover:border-[#b6cce8] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid size-4 place-items-center rounded border transition ${
                        isSelected
                          ? "border-[#0f2a4f] bg-[#0f2a4f] text-white"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <Briefcase
                      size={14}
                      className={isSelected ? "text-[#0f2a4f]" : "text-[#748299]"}
                    />
                    <span>{u.displayName ?? u.username}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {managers.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
            <Users size={11} /> Manajer Bidang
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {managers.map((u) => {
              const isSelected = selectedIds.includes(u.id);
              const isTagMatch = Boolean(
                u.bidang && complaintTags.includes(u.bidang.toLowerCase())
              );
              const tagInfo = u.bidang
                ? BIDANG_TAGS.find(
                    (b) => b.value.toLowerCase() === u.bidang?.toLowerCase()
                  )
                : null;
              const BidangIcon = tagInfo?.icon ?? Users;

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onToggle(u.id)}
                  className={`flex items-center justify-between rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                    isSelected
                      ? "border-[#0f2a4f] bg-[#eef4fb] text-[#0f2a4f] ring-1 ring-[#0f2a4f]"
                      : isTagMatch
                      ? "border-amber-200 bg-amber-50/50 text-[#172033] hover:border-amber-300"
                      : "border-[#dbe5f4] bg-[#f8fbff] text-[#172033] hover:border-[#b6cce8] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`grid size-4 shrink-0 place-items-center rounded border transition ${
                        isSelected
                          ? "border-[#0f2a4f] bg-[#0f2a4f] text-white"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <BidangIcon
                      size={13}
                      className={
                        isSelected ? "text-[#0f2a4f] shrink-0" : "text-[#748299] shrink-0"
                      }
                    />
                    <span className="truncate">{u.displayName ?? u.username}</span>
                  </div>

                  {isTagMatch && (
                    <span className="ml-1.5 shrink-0 rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase tracking-tight">
                      Tag Cocok
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {totalUsers === 0 && (
        <p className="mt-3 text-sm text-center text-[#748299]">
          Belum ada manajer atau direktur yang terdaftar.
        </p>
      )}
    </div>
  );
}
