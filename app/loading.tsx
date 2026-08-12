export default function GlobalLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f4f7fc]">
      <div className="h-18 border-b border-[#d9e3f2] bg-white" />
      <section className="container py-16">
        <div className="h-7 w-40 rounded-full bg-[#dce6f4]" />
        <div className="mt-6 h-12 max-w-2xl rounded-xl bg-[#cddbed]" />
        <div className="mt-4 h-5 max-w-xl rounded-lg bg-[#e1e9f4]" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-44 rounded-3xl bg-white shadow-sm" />
          ))}
        </div>
      </section>
    </main>
  );
}
