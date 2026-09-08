import { Brand } from "./brand";
import { PublicNav } from "./public-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d8e3f4] bg-white/90 backdrop-blur-md">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2d35f]/60 to-transparent" />
      <div className="container flex min-h-20 items-center justify-between gap-4 py-3">
        <Brand />
        <PublicNav />
      </div>
    </header>
  );
}
