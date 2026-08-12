import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { FloatingContact } from "@/components/public/floating-contact";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContact />
    </div>
  );
}
