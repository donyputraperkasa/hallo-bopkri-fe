import { ShieldCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { AdminNav } from "./admin-nav";
import { LogoutButton } from "./logout-button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f4f7fc]">
      {/* Non-scrollable Fixed/Sticky Sidebar on desktop */}
      <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#173f78] via-[#1f4f8f] to-[#29328f] p-5 lg:sticky lg:top-0 lg:h-screen lg:w-68 lg:shrink-0">
        <span className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full border-30 border-white/5" />
        
        <div>
          <div className="relative">
            <Brand href="/masdon/dashboard" inverse />
          </div>
          <div className="relative mt-6">
            <AdminNav />
          </div>
        </div>

        <div className="relative mt-6 hidden rounded-2xl border border-white/15 bg-white/10 p-4 text-blue-50 lg:block">
          <ShieldCheck size={20} className="text-[#f2d35f]" />
          <p className="mt-2 text-sm font-bold">Administrator Panel</p>
          <p className="mt-0.5 text-xs leading-relaxed text-blue-100/80">
            Sistem pengelolaan dan disposisi aduan Yayasan BOPKRI.
          </p>
        </div>
      </aside>

      {/* Main Scrollable Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#d9e3f2] bg-white/90 px-5 shadow-xs backdrop-blur-md sm:px-8">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-[#b48700] uppercase">Admin Workspace</p>
            <p className="text-sm font-bold text-[#263b5b]">Ruang Kendali Hallo BOPKRI</p>
          </div>
          <LogoutButton />
        </header>

        <main className="flex-1 min-h-[calc(100vh-64px)] bg-[radial-gradient(circle_at_95%_0%,#dce8f8_0,transparent_24rem)] p-4 sm:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
