import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { daftarCustomer, daftarMobil, HARGA_SOPIR_PER_HARI } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { HARI_INI, UPAH_SOPIR_PER_HARI } from "@/lib/constants";
import { FormTransaksi, type OpsiCustomer, type OpsiMobil } from "./form-transaksi";

export const metadata: Metadata = { title: "Booking Baru" };

export default async function TransaksiBaruPage({
  searchParams,
}: {
  searchParams: Promise<{ mobil?: string }>;
}) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const { mobil: slugAwal } = await searchParams;
  const superAdmin = admin.peran === "SUPER_ADMIN";

  // Hanya field yang dibutuhkan form yang dikirim ke client.
  const opsiMobil: OpsiMobil[] = daftarMobil(admin.peran).map((m) => ({
    slug: m.slug,
    nama: m.nama,
    kategori: m.kategori,
    hargaPerHari: m.sellPricePerDay,
    unitTersedia: m.unitTersedia,
    ...(m.modal ? { modalPerHari: m.modal.costPricePerDay } : {}),
  }));

  const opsiCustomer: OpsiCustomer[] = daftarCustomer.map((c) => ({
    id: c.id,
    nama: c.namaLengkap,
    noHp: c.noHpWa,
    langganan: c.langganan,
    jaminan: c.jaminan.map((j) => ({
      id: j.id,
      label: `${j.kendaraan} · ${j.plat} (a.n. ${j.atasNama})`,
    })),
  }));

  return (
    <div className="space-y-6">
      <Link href="/admin/katalog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Kembali ke katalog
      </Link>

      <PageHeader
        judul="Booking Baru"
        deskripsi="Input hasil kesepakatan yang sudah terjadi di WhatsApp. Customer tidak memesan sendiri lewat website."
      />

      <FormTransaksi
        mobil={opsiMobil}
        customer={opsiCustomer}
        slugAwal={slugAwal}
        hargaSopirPerHari={HARGA_SOPIR_PER_HARI}
        {...(superAdmin ? { upahSopirPerHari: UPAH_SOPIR_PER_HARI } : {})}
        hariIni={HARI_INI}
      />
    </div>
  );
}
