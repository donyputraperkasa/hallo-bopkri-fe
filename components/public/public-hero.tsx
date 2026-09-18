import { HomeActionPortal } from "./home-action-portal";
import { Lock, ShieldCheck, TicketCheck } from "lucide-react";

export function PublicHero() {
  return (
    <section className="hero-building relative overflow-hidden text-white">
      {/* Ornamen dekoratif sudut: dot matrix kanan atas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 right-8 hidden md:block opacity-20"
      >
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="size-1.5 rounded-full bg-white" />
          ))}
        </div>
      </div>

      {/* Ornamen cincin aksen emas kanan atas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 right-16 hidden md:block size-14 rounded-full border-2 border-[#f2d35f]/30"
      />

      {/* Ornamen aksen kotak halus di kiri */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-8 hidden md:block size-16 rounded-2xl border border-white/10 bg-white/[0.02]"
      />

      {/* Garis aksen emas horizontal di atas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2d35f]/50 to-transparent"
      />

      <div className="container relative z-10 pt-16 pb-20 sm:pt-20 sm:pb-24 text-white">
        {/* Header & Deskripsi Beranda (Tengah / Simetris Klasik) */}
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <span className="inline-flex items-center rounded-md bg-[#f2d35f] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#2d2a16] shadow-xs">
            Layanan Aspirasi Yayasan BOPKRI
          </span>

          <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Setiap suara layak{" "}
            <span className="text-[#f2d35f]">didengar</span>
            <br className="hidden sm:inline" /> dan{" "}
            <span className="text-[#f2d35f]">ditindaklanjuti</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-blue-50/90 font-normal">
            Media resmi Yayasan BOPKRI Yogyakarta<br />Sampaikan Aspirasi, Apresiasi, dan Keluhan anda tanpa perlu memiliki akun.
          </p>

          {/* Quick info trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-blue-100/90 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#f2d35f]" />
              <span>Tanpa Perlu Akun</span>
            </div>
            <span className="hidden sm:inline text-blue-300/40">·</span>
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-[#f2d35f]" />
              <span>Kerahasiaan Terjaga</span>
            </div>
            <span className="hidden sm:inline text-blue-300/40">·</span>
            <div className="flex items-center gap-2">
              <TicketCheck size={16} className="text-[#f2d35f]" />
              <span>Pelacakan Real-Time</span>
            </div>
          </div>
        </div>

        {/* 2 Big Action Cards (Menonjol & Proporsional) */}
        <div className="mx-auto mt-12 max-w-4xl animate-fade-up-delay">
          <HomeActionPortal />
        </div>
      </div>
    </section>
  );
}

export default PublicHero;