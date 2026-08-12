import { Brand } from "./brand";
import { PublicNav } from "./public-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#c8d8ed] bg-gradient-to-r from-[#edf3fb]/95 via-white/95 to-[#fff8d8]/90 backdrop-blur">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1f4f8f] via-[#29328f] to-[#f2d35f]" />
      <div className="container flex min-h-20 items-center justify-between gap-4 py-3">
        <Brand />
        <PublicNav />
      </div>
    </header>
  );
}
