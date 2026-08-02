import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KatalogGrid } from "@/components/admin/katalog-grid";
import { PageHeader } from "@/components/admin/ui";
import { daftarMobil } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Katalog Mobil" };

export default async function KatalogPage() {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const mobil = daftarMobil(admin.peran);

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Katalog Mobil & Pricing"
        deskripsi="Data mobil yang tayang di landing page sekaligus pintu masuk pembuatan booking. Pilih mobil lalu tekan Booking."
      />
      <KatalogGrid mobil={mobil} />
    </div>
  );
}
