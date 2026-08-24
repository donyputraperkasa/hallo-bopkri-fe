"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";

export function LoginForm() {
  const { show } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const values = new FormData(event.currentTarget);
    try {
      await readResponse(
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            username: values.get("username"),
            password: values.get("password"),
          }),
        })
      );
      show("Login berhasil. Selamat datang kembali.");
      window.location.assign("/masdon/dashboard");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Login gagal.";
      setError(message);
      show(message, "error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login} className="surface relative w-full max-w-md p-7 sm:p-9 border border-stone-200/90 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1f4f8f] shadow-xs">
          <LockKeyhole size={23} />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-xs font-bold text-amber-800">
          <ShieldCheck size={13} /> Akses Admin
        </span>
      </div>

      <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
        Masuk sebagai admin
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        Gunakan akun admin Yayasan BOPKRI.
      </p>

      <div className="mt-6 space-y-4.5">
        <label className="block">
          <span className="label text-stone-800">Username</span>
          <input
            className="field"
            name="username"
            autoComplete="username"
            placeholder="masukan username nya masdondon"
            required
          />
        </label>

        <label className="block">
          <span className="label text-stone-800">Password</span>
          <input
            className="field"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="masukan password masdondon"
            required
          />
        </label>
      </div>

      {error && <p className="error-box mt-5">{error}</p>}

      <button className="btn-primary mt-6 w-full shadow-md" disabled={loading}>
        {loading ? "Memeriksa..." : "Masuk"} <ArrowRight size={18} />
      </button>
    </form>
  );
}
