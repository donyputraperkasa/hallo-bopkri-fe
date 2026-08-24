"use client";

import { ShieldCheck, Tags } from "lucide-react";

export function ComplainNote() {
  return (
    <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-stone-50/80 to-amber-50/80 p-4 text-stone-700 shadow-xs">
      <div className="space-y-2">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-emerald-600" />
          <p className="text-xs leading-relaxed">
            <strong className="font-semibold text-stone-800">Kerahasiaan Terjamin:</strong> Identitas pengirim aduan terlindungi dengan enkripsi keamanan sistem pihak ketiga
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <Tags className="mt-0.5 size-4.5 shrink-0 text-[#1f4f8f]" />
          <p className="text-xs leading-relaxed">
            <strong className="font-semibold text-stone-800">Penyaluran Tepat Sasaran:</strong> Gunakan tag bidang agar aduan atau pertanyaan Anda langsung diteruskan ke bidang/divisi yang berwenang.
          </p>
        </div>
      </div>
    </div>
  );
}