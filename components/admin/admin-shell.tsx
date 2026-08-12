import { ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { AdminNav } from "./admin-nav";
import { LogoutButton } from "./logout-button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fc] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="relative overflow-hidden bg-gradient-to-b from-[#173f78] via-[#1f4f8f] to-[#29328f] p-5 lg:min-h-screen">
        <span className="absolute -top-16 -right-16 size-48 rounded-full border-30 border-white/5" />
        <div className="relative"><Brand href="/masdon/dashboard" inverse /></div>
        <div className="relative"><AdminNav /></div>
        <div className="relative mt-7 hidden rounded-2xl border border-white/15 bg-white/10 p-4 text-blue-50 lg:block">
          <ShieldCheck size={20} className="text-[#f2d35f]" />
          <p className="mt-3 text-sm font-bold">Administrator tunggal</p>
          <p className="mt-1 text-xs leading-5 text-blue-100/80">
            Area privat untuk mengelola laporan masyarakat.
          </p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-[#d9e3f2] bg-white/85 px-5 shadow-sm backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-bold tracking-wider text-[#b48700] uppercase">Admin Workspace</p>
            <p className="text-sm font-bold text-[#263b5b]">Ruang kendali Hallo BOPKRI</p>
          </div>
          <LogoutButton />
        </header>
        <main className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_95%_0%,#dce8f8_0,transparent_24rem)] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
