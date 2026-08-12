import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck, TicketCheck } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="hero-building">
        <div className="container grid gap-12 py-18 text-white lg:grid-cols-[1.1fr_.9fr] lg:py-26">
          <div className="self-center">
            <span className="eyebrow">Layanan aspirasi Yayasan BOPKRI</span>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-[-.04em] sm:text-6xl">
              Setiap suara layak <span className="text-[#f2d35f]">didengar</span>
              <br /> dan ditindaklanjuti.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-50/90">
              Sampaikan pertanyaan, apresiasi, atau keluhan tanpa perlu membuat
              akun. Pantau prosesnya kapan saja menggunakan kode tiket.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kirim-aduan" className="btn-primary">
                Kirim Aduan <ArrowRight size={18} />
              </Link>
              <Link href="/lacak-aduan" className="btn-secondary text-[#17233f]">
                Lacak Tiket
              </Link>
            </div>
          </div>
          <div className="surface relative overflow-hidden p-6 text-[#17233f] sm:p-8">
            <div className="absolute -top-18 -right-14 size-52 rounded-full bg-[#fff4bd]" />
            <p className="relative text-sm font-bold text-[#1f4f8f]">ALUR SEDERHANA</p>
            <div className="relative mt-6 space-y-4">
              {[
                [FileCheck2, "Isi formulir", "Pilih kategori dan ceritakan dengan jelas."],
                [TicketCheck, "Simpan tiket", "Kode tiket diberikan setelah aduan terkirim."],
                [ShieldCheck, "Pantau proses", "Cek status dan catatan tindak lanjut admin."],
              ].map(([Icon, title, text], index) => {
                const StepIcon = Icon as typeof FileCheck2;
                return (
                  <div key={String(title)} className="interactive-card flex gap-4 rounded-2xl bg-[#f4f7fc] p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#1f4f8f] shadow-sm">
                      <StepIcon size={21} />
                    </span>
                    <div>
                      <h2 className="font-bold">{index + 1}. {String(title)}</h2>
                      <p className="mt-1 text-sm text-slate-500">{String(text)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="container py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {CATEGORIES.map(({ value, label, description, icon: Icon, tone }) => (
            <article key={value} className={`surface interactive-card border-t-4 p-6 tone-${tone}`}>
              <Icon className="text-[#1f4f8f]" />
              <h2 className="mt-5 text-xl font-extrabold">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
