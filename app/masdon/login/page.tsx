import { Brand } from "@/components/layout/brand";
import { LoginForm } from "@/components/admin/login-form";
import { Landmark } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <main className="classic-backdrop relative grid min-h-screen place-items-center p-5 overflow-hidden">
      {/* Decorative Classic Background Elements */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-b from-[#1f4f8f]/8 via-[#f2d35f]/6 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-20 size-80 rounded-full bg-[#1f4f8f]/5 blur-2xl" />

      {/* Subtle watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
        <Landmark className="size-[500px] text-[#1f4f8f]" />
      </div>

      <div className="relative z-10 w-full max-w-md my-8">
        <div className="mb-6 flex flex-col items-center justify-center">
          <Brand />
          <span className="mt-2 text-[11px] font-bold uppercase tracking-widest text-stone-400">
            Portal Administrasi Internal
          </span>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-stone-500">
          Sistem Informasi & Pengaduan • Yayasan BOPKRI Yogyakarta
        </p>
      </div>
    </main>
  );
}
