"use client";

import { SendHorizontal, X } from "lucide-react";

interface DispatchModalHeaderProps {
  ticketCode: string;
  onClose: () => void;
}

export function DispatchModalHeader({ ticketCode, onClose }: DispatchModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#dbe5f4] pb-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-amber-100 text-amber-800">
          <SendHorizontal size={18} />
        </span>
        <div>
          <h3 className="font-semibold text-[#0f172a] text-base">Kirim ke Bidang</h3>
          <p className="text-xs text-[#748299] font-mono">Tiket: {ticketCode}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-[#748299] hover:bg-[#eef4fb] hover:text-[#0f2a4f] transition"
      >
        <X size={18} />
      </button>
    </div>
  );
}
