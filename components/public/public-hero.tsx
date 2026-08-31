import { HomeActionPortal } from "./home-action-portal";
import { Lock, ShieldCheck, TicketCheck } from "lucide-react";

export function PublicHero() {
  return (
    <section className="hero-building relative">
      <div className="container pt-16 pb-20 sm:pt-20 sm:pb-24 text-white">
        {/* Header & Deskripsi Beranda (Tengah / Simetris Klasik) */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d35f]/40 bg-[#fff4bd]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#fff4bd] backdrop-blur-xs">
            <span className="size-2 rounded-full bg-[#f2d35f]" />
            Layanan Aspirasi Yayasan BOPKRI
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Setiap suara layak{" "}
            <span className="text-[#f2d35f]">didengar</span>
            <br className="hidden sm:inline" /> dan{" "}
            <span className="text-[#f2d35f]">ditindaklanjuti</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-blue-50/90 font-normal">
            Media resmi penyampaian pertanyaan, apresiasi, maupun keluhan seputar lingkungan Yayasan BOPKRI Yogyakarta. Praktis, tanpa login, dan terjamin kerahasiaannya.
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
        <div className="mx-auto mt-12 max-w-4xl">
          <HomeActionPortal />
        </div>
      </div>
    </section>
  );
}

export default PublicHero;