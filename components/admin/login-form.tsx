"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
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
        }),
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
    <form onSubmit={login} className="surface w-full max-w-md p-7 sm:p-9">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1f4f8f]">
        <LockKeyhole size={23} />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Masuk sebagai admin</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Gunakan akun admin yang dibuat melalui seed backend.
      </p>
      <div className="mt-7 space-y-5">
        <label>
          <span className="label">Username</span>
          <input 
            className="field" 
            name="username" 
            autoComplete="username" 
            placeholder="masukan username nya masdondon"
            required 
          />
        </label>
        <label>
          <span className="label">Password</span>
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
      <button className="btn-primary mt-6 w-full" disabled={loading}>
        {loading ? "Memeriksa..." : "Masuk"} <ArrowRight size={18} />
      </button>
    </form>
  );
}
