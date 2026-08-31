import { PublicLayout } from "@/components/layout/public-layout";
import { PublicHero } from "@/components/public/public-hero";
import { PublicAlur } from "@/components/public/public-alur";
import { PublicKategori } from "@/components/public/public-kategori";

export default function HomePage() {
  return (
    <PublicLayout>
      <PublicHero />
      <PublicAlur />
      <PublicKategori />
    </PublicLayout>
  );
}
