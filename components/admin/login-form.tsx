"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, User } from "lucide-react";
import { readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";

type AdminRole = "OWNER" | "DIRECTOR" | "MANAGER";

function dashboardFor(role: AdminRole): string {
  if (role === "DIRECTOR") return "/masdon/director/dashboard";
  if (role === "MANAGER") return "/masdon/manager/dashboard";
  return "/masdon/dashboard";
}

export function LoginForm() {
  const { show } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const values = new FormData(event.currentTarget);
    try {
      const data = await readResponse<{ role: AdminRole; displayName: string }>(
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            username: values.get("username"),
            password: values.get("password"),
          }),
        })
      );
      show(`Login berhasil. Selamat datang, ${data.displayName ?? "Admin"}!`);
      window.location.assign(dashboardFor(data.role));
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Login gagal.";
      setError(message);
      show(message, "error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold text-[#2b3445]">Username</span>
        <span className="mt-2 flex h-12 items-center gap-3 rounded-md border border-[#ced9eb] bg-[#f8fbff] px-3 transition focus-within:border-[#0f2a4f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0f2a4f]/15">
          <span className="text-[#728199]">
            <User size={18} />
          </span>
          <input
            autoComplete="username"
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9aa6b8] text-[#172033]"
            disabled={loading}
            name="username"
            placeholder="Masukkan username admin"
            required
          />
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-[#2b3445]">Password</span>
        <span className="mt-2 flex h-12 items-center gap-3 rounded-md border border-[#ced9eb] bg-[#f8fbff] px-3 transition focus-within:border-[#0f2a4f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0f2a4f]/15">
          <span className="text-[#728199]">
            <LockKeyhole size={18} />
          </span>
          <input
            autoComplete="current-password"
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9aa6b8] text-[#172033]"
            disabled={loading}
            name="password"
            placeholder="Masukkan password"
            required
            type={isPasswordVisible ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#728199] transition hover:bg-[#eef3fb] hover:text-[#0f2a4f]"
            aria-label={isPasswordVisible ? "Sembunyikan password" : "Tampilkan password"}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0f2a4f] text-sm font-semibold text-white shadow-lg shadow-[#0f2a4f]/20 transition hover:bg-[#173b6b] disabled:cursor-not-allowed disabled:bg-[#7f98bd]"
      >
        {loading ? "Memeriksa..." : "Masuk ke Panel"}
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </form>
  );
}
