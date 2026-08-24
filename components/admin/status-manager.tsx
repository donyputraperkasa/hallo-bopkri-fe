"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LoaderCircle, Plus, SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/client-api";
import type { ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";

export function StatusManager() {
  const { show } = useToast();
  const [statuses, setStatuses] = useState<ComplaintStatus[] | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<ComplaintStatus[]>("/api/admin/complaint-statuses")
      .then(setStatuses)
      .catch((reason) => setError(reason.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/admin/complaint-statuses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          code: String(form.get("code")).trim().toUpperCase().replace(/\s+/g, "_"),
          color: form.get("color"),
          description: form.get("description") || undefined,
        }),
      });
      event.currentTarget.reset();
      show("Status baru berhasil ditambahkan.");
      load();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Status gagal dibuat.";
      setError(message);
      show(message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(item: ComplaintStatus) {
    try {
      await api(`/api/admin/complaint-statuses/${item.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      show(`Status berhasil ${item.isActive === false ? "diaktifkan" : "dinonaktifkan"}.`);
      load();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Status gagal diubah.";
      setError(message);
      show(message, "error");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#0f2a4f]" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Pengaturan Status Aduan</h2>
          </div>
          <p className="text-sm text-[#748299]">
            Tambahkan status baru atau kelola status penanganan aduan masyarakat.
          </p>
        </div>
      </section>

      {/* Form Tambah Status */}
      <form onSubmit={create} className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-[#0f172a]">Tambah Status Baru</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
              Nama status *
            </span>
            <input
              className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
              name="name"
              placeholder="Contoh: Menunggu konfirmasi"
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
              Kode unik *
            </span>
            <input
              className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm text-[#172033] outline-none uppercase placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
              name="code"
              placeholder="MENUNGGU_KONFIRMASI"
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
              Warna Penanda
            </span>
            <div className="flex h-10 items-center gap-3 rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3">
              <input
                className="size-7 cursor-pointer rounded border-0 bg-transparent"
                type="color"
                name="color"
                defaultValue="#0f2a4f"
              />
              <span className="text-xs text-[#748299]">Pilih warna badge status</span>
            </div>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
              Deskripsi
            </span>
            <input
              className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
              name="description"
              placeholder="Keterangan alur status..."
            />
          </label>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f2a4f] px-5 text-sm font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50"
          >
            <Plus size={16} />
            <span>{saving ? "Menyimpan..." : "Tambah Status"}</span>
          </button>
        </div>
      </form>

      {/* Daftar Status */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#dbe5f4] bg-[#f8fbff] px-5 py-3.5">
          <h3 className="text-sm font-semibold text-[#0f172a]">Daftar Status Terdaftar</h3>
        </div>

        {!statuses ? (
          <div className="flex justify-center py-10">
            <LoaderCircle className="size-6 animate-spin text-[#0f2a4f]" />
          </div>
        ) : (
          <div className="divide-y divide-[#eef3fb]">
            {statuses.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-5 transition hover:bg-[#f8fbff]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3.5 rounded-full shadow-xs shrink-0"
                    style={{ background: item.color }}
                  />
                  <div>
                    <p className="font-semibold text-sm text-[#172033]">{item.name}</p>
                    <p className="font-mono text-xs text-[#748299]">{item.code}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(item)}
                  disabled={item.code === "NEW"}
                  className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-semibold transition ${
                    item.isActive === false
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-[#dbe5f4] bg-white text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                  title={item.code === "NEW" ? "Status awal wajib tetap aktif" : undefined}
                >
                  {item.isActive === false ? "Aktifkan" : "Nonaktifkan"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
