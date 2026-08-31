import { CATEGORIES } from "@/lib/constants";

export function PublicKategori() {
  return (
    <section className="container py-14 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="rounded-full bg-[#eef4fb] px-3.5 py-1 text-xs font-bold tracking-wider text-[#1f4f8f] uppercase border border-[#d8e3f4]">
          Ruang Lingkup Layanan
        </span>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
          Kategori Aduan & Aspirasi
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Pilihlah kategori yang sesuai agar pesan Anda segera diteruskan ke unit kerja yang tepat.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {CATEGORIES.map(({ value, label, description, icon: Icon }) => (
          <article
            key={value}
            className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-[#1f4f8f]/40 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-[#eef4fb] text-[#1f4f8f] group-hover:bg-[#1f4f8f] group-hover:text-white transition-colors">
                <Icon size={20} />
              </span>
              <h3 className="text-lg font-bold text-stone-900">{label}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PublicKategori;
