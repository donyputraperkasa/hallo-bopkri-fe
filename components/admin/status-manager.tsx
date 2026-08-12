"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
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
    <div>
      <p className="eyebrow">Status dinamis</p>
      <h1 className="mt-3 text-3xl font-extrabold">Status aduan</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Tambahkan status di luar status bawaan. Status nonaktif tetap tersimpan
        pada riwayat, tetapi tidak dapat dipilih untuk pembaruan baru.
      </p>
      <form onSubmit={create} className="surface mt-6 grid gap-4 p-5 md:grid-cols-2">
        <label><span className="label">Nama status *</span><input className="field" name="name" placeholder="Contoh: Menunggu konfirmasi" required /></label>
        <label><span className="label">Kode unik *</span><input className="field uppercase" name="code" placeholder="MENUNGGU_KONFIRMASI" required /></label>
        <label><span className="label">Warna</span><input className="field h-12" type="color" name="color" defaultValue="#1f4f8f" /></label>
        <label><span className="label">Deskripsi</span><input className="field" name="description" placeholder="Keterangan internal..." /></label>
        {error && <p className="error-box md:col-span-2">{error}</p>}
        <button className="btn-primary md:col-span-2" disabled={saving}><Plus size={18} /> {saving ? "Menyimpan..." : "Tambah status"}</button>
      </form>
      <section className="surface mt-5 overflow-hidden">
        {!statuses ? <LoaderCircle className="m-6 animate-spin text-[#1f4f8f]" /> : statuses.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 last:border-0">
            <div className="flex items-center gap-3">
              <i className="size-4 rounded-full" style={{ background: item.color }} />
              <div><p className="font-bold">{item.name}</p><p className="font-mono text-xs text-slate-400">{item.code}</p></div>
            </div>
            <button
              className="btn-secondary py-2 text-sm"
              onClick={() => toggle(item)}
              disabled={item.code === "NEW"}
              title={item.code === "NEW" ? "Status awal wajib tetap aktif" : undefined}
            >
              {item.isActive === false ? "Aktifkan" : "Nonaktifkan"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
