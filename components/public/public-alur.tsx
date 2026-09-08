import { FileCheck2, ShieldCheck, TicketCheck } from "lucide-react";

export function PublicAlur() {
  return (
    <section className="border-b border-[#d8e3f4] bg-[#f8fbff] py-14 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-md bg-[#eef3fb] px-3.5 py-1 text-xs font-semibold text-[#1f4f8f] border border-[#c9d5ec]">
            Tata Cara Pelaporan
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#111827] sm:text-3xl">
            Alur Mudah & Transparan
          </h2>
          <p className="mt-2 text-sm text-[#526078]">
            Tiga tahapan sederhana dalam menyampaikan dan memantau aspirasi Anda.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileCheck2,
              step: "01",
              title: "Isi Formulir Aduan",
              text: "Tuliskan aspirasi atau keluhan Anda secara jelas dan sertakan bukti pendukung jika diperlukan.",
            },
            {
              icon: TicketCheck,
              step: "02",
              title: "Dapatkan Kode Tiket",
              text: "Simpan kode e-tiket unik yang diterbitkan otomatis sebagai akses bukti pelaporan Anda.",
            },
            {
              icon: ShieldCheck,
              step: "03",
              title: "Pantau Tindak Lanjut",
              text: "Lacak perkembangan penanganan dan catatan resmi dari pengurus bidang terkait kapan saja.",
            },
          ].map(({ icon: StepIcon, step, title, text }) => (
            <div
              key={step}
              className="relative rounded-xl border border-[#d8e3f4] bg-white p-6 text-left shadow-xs transition hover:border-[#1f4f8f]/50 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-lg bg-[#eef3fb] text-[#1f4f8f] border border-[#d8e3f4]">
                  <StepIcon size={20} />
                </span>
                <span className="font-mono text-2xl font-semibold text-[#b0c4de]">
                  {step}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#111827]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#526078]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PublicAlur;