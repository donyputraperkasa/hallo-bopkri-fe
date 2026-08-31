import { FileCheck2, ShieldCheck, TicketCheck } from "lucide-react";

export function PublicAlur() {
  return (
    <section className="border-b border-stone-200/80 bg-white py-14 sm:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-[#eef4fb] px-3.5 py-1 text-xs font-bold tracking-wider text-[#1f4f8f] uppercase border border-[#d8e3f4]">
            Tata Cara Pelaporan
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
            Alur Mudah & Transparan
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Tiga tahapan sederhana dalam menyampaikan dan memantau aspirasi Anda.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileCheck2,
              step: "1",
              title: "Isi Formulir Aduan",
              text: "Tuliskan aspirasi atau keluhan Anda secara jelas dan sertakan bukti pendukung jika diperlukan.",
            },
            {
              icon: TicketCheck,
              step: "2",
              title: "Dapatkan Kode Tiket",
              text: "Simpan kode e-tiket unik yang diterbitkan otomatis sebagai akses bukti pelaporan Anda.",
            },
            {
              icon: ShieldCheck,
              step: "3",
              title: "Pantau Tindak Lanjut",
              text: "Lacak perkembangan penanganan dan catatan resmi dari pengurus bidang terkait kapan saja.",
            },
          ].map(({ icon: StepIcon, step, title, text }) => (
            <div
              key={step}
              className="relative rounded-2xl border border-stone-200 bg-[#fbfcfd] p-6 text-left shadow-xs transition hover:border-[#1f4f8f]/40 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-[#eef4fb] text-[#1f4f8f] border border-[#d8e3f4]">
                  <StepIcon size={22} />
                </span>
                <span className="font-mono text-2xl font-black text-stone-300">
                  0{step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-stone-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PublicAlur;