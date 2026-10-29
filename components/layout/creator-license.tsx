"use client";

import { X } from "lucide-react";
import { licenseItems } from "./license-data";

export function CreatorLicense({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0f172a]/50 px-3 py-6 backdrop-blur-sm"
    >
      <section
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-5 text-[#1f2f46] shadow-2xl shadow-[#1f4f8f]/20 sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-[#d8e3f4] bg-white p-2 text-[#617089] hover:text-[#1f4f8f]"
          aria-label="Tutup modal lisensi"
        >
          <X className="size-4" />
        </button>
        <header className="pr-10">
          <p className="text-xs font-bold tracking-[.3em] text-[#b48700]">
            VERIFIED LICENSE
          </p>
          <h2 className="mt-3 bg-gradient-to-r from-[#123d78] to-[#29328f] bg-clip-text text-3xl font-extrabold text-transparent">
            Hallo BOPKRI
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#55657f]">
            Layanan aduan Yayasan BOPKRI, dirancang dan dikembangkan oleh
            Dony Putra Perkasa.
          </p>
        </header>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
            ✓ Verified Original Software
          </Badge>
          <Badge className="border-blue-200 bg-blue-50 text-blue-700">
            Organization Edition
          </Badge>
          <Badge className="border-amber-200 bg-amber-50 text-amber-700">
            Licensed Software
          </Badge>
        </div>
        <p className="mt-4 rounded-2xl border border-[#dce8f7] bg-[#f7fbff] p-4 text-sm leading-6 text-[#44536b]">
          Source code, arsitektur, antarmuka, dokumentasi, dan desain sistem
          merupakan karya intelektual pemegang hak cipta.
        </p>
        <div className="mt-5 space-y-2">
          {licenseItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#e2eaf6] bg-[#f8fbff] px-4 py-3">
              <p className="text-xs font-medium tracking-wide text-[#7a8aa0] uppercase">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[#f2d35f]/60 bg-[#fff8db] p-4 text-xs leading-6 text-[#675b1f]">
          <strong>Copyright © 2026 Dony Putra Perkasa.</strong>
          <p className="mt-2">
            Penyalinan, penjualan ulang, penghapusan atribusi developer, atau
            penggunaan komersial ulang memerlukan izin tertulis pemegang hak cipta.
          </p>
        </div>
        <button type="button" onClick={onClose} className="btn-primary mt-5 w-full">
          Tutup
        </button>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: string; className: string }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
