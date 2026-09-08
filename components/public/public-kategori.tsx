import { CATEGORIES } from "@/lib/constants";

export function PublicKategori() {
  return (
    <section className="container py-14 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-md bg-[#f2d35f] px-3.5 py-1 text-xs font-semibold text-[#2d2a16] shadow-xs">
          Ruang Lingkup Layanan
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#111827] sm:text-3xl">
          Kategori Aduan & Aspirasi
        </h2>
        <p className="mt-2 text-sm text-[#526078]">
          Pilihlah kategori yang sesuai agar pesan Anda segera diteruskan ke unit kerja yang tepat.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {CATEGORIES.map(({ value, label, description, icon: Icon }) => (
          <article
            key={value}
            className="group rounded-xl border border-[#d8e3f4] bg-white p-5 sm:p-6 shadow-xs transition hover:border-[#1f4f8f]/40 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-[#eef3fb] text-[#1f4f8f] border border-[#d8e3f4] group-hover:bg-[#1f4f8f] group-hover:text-white transition">
                <Icon size={18} />
              </span>
              <h3 className="text-base font-semibold text-[#111827]">{label}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#526078]">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PublicKategori;
