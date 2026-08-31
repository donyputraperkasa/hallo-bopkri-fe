"use client";

import { useState } from "react";
import {
  ArrowRight,
  FileSignature,
  SearchCheck,
  Send,
  Ticket,
} from "lucide-react";
import { ActionModal } from "./action-modal";
import { ComplaintForm } from "./complaint-form";
import { TrackingForm } from "./tracking-form";

export function HomeActionPortal() {
  const [activeModal, setActiveModal] = useState<"complaint" | "tracking" | null>(null);

  return (
    <>
      {/* 2 Big Action Cards (Luas, Simetris & Bergaya Klasik) */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Card 1: Kirim Aduan & Aspirasi */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveModal("complaint")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setActiveModal("complaint");
            }
          }}
          className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 text-left shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:border-[#1f4f8f] hover:shadow-2xl sm:p-8"
        >
          {/* Subtle Classic Accent Top Border */}
          <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0c264d] via-[#1f4f8f] to-[#29328f]" />

          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#eef4fb] text-[#1f4f8f] border border-[#d8e3f4] transition-all group-hover:bg-[#1f4f8f] group-hover:text-white group-hover:shadow-md">
                <FileSignature size={26} />
              </span>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold tracking-wider text-[#1f4f8f] uppercase">
                Formulir Online
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-black tracking-tight text-stone-900 group-hover:text-[#1f4f8f]">
              Kirim Aduan & Aspirasi
            </h3>
            
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-stone-600">
              Sampaikan pertanyaan, apresiasi, atau keluhan Anda tanpa perlu login akun. Formulir mudah dan data Anda terjaga aman.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-5">
            <span className="text-sm font-bold text-[#1f4f8f]">
              Buka Formulir Aduan
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-[#eef4fb] text-[#1f4f8f] transition-all group-hover:bg-[#1f4f8f] group-hover:text-white group-hover:translate-x-1">
              <ArrowRight size={17} />
            </span>
          </div>
        </div>

        {/* Card 2: Lacak Status E-Tiket */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveModal("tracking")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setActiveModal("tracking");
            }
          }}
          className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 text-left shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:border-[#1f4f8f] hover:shadow-2xl sm:p-8"
        >
          {/* Subtle Classic Accent Top Border */}
          <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#1f4f8f] via-[#f2d35f] to-[#f2d35f]" />

          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#fff9df] text-[#8a6800] border border-[#fae892] transition-all group-hover:bg-[#1f4f8f] group-hover:text-white group-hover:shadow-md">
                <SearchCheck size={26} />
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold tracking-wider text-[#8a6800] uppercase">
                Cek Resi / Tiket
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-black tracking-tight text-stone-900 group-hover:text-[#1f4f8f]">
              Lacak Status E-Tiket
            </h3>
            
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-stone-600">
              Pantau perkembangan dan respon resmi dari tim pengurus bidang terkait secara transparan menggunakan kode tiket Anda.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-5">
            <span className="text-sm font-bold text-[#1f4f8f]">
              Cek Status Aduan
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-[#fff9df] text-[#8a6800] transition-all group-hover:bg-[#1f4f8f] group-hover:text-white group-hover:translate-x-1">
              <ArrowRight size={17} />
            </span>
          </div>
        </div>
      </div>

      {/* Modal 1: Formulir Pengaduan */}
      <ActionModal
        isOpen={activeModal === "complaint"}
        onClose={() => setActiveModal(null)}
        title="Formulir Aspirasi & Aduan"
        subtitle="Yayasan BOPKRI Yogyakarta · Kerahasiaan Terjaga"
        icon={Send}
        maxWidth="3xl"
      >
        <ComplaintForm />
      </ActionModal>

      {/* Modal 2: Pelacakan Tiket */}
      <ActionModal
        isOpen={activeModal === "tracking"}
        onClose={() => setActiveModal(null)}
        title="Pelacakan Status E-Tiket"
        subtitle="Cek tahapan penanganan dan jawaban resmi"
        icon={Ticket}
        maxWidth="2xl"
      >
        <TrackingForm />
      </ActionModal>
    </>
  );
}
