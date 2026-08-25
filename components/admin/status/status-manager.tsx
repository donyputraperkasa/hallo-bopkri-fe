"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/client-api";
import type { ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";
import { StatusCreateForm } from "./status-create-form";
import { StatusListSection } from "./status-list-section";

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

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
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

  async function handleToggle(item: ComplaintStatus) {
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

      <StatusCreateForm saving={saving} error={error} onSubmit={handleCreate} />
      <StatusListSection statuses={statuses} onToggle={handleToggle} />
    </div>
  );
}
