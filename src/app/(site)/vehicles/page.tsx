import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/sections";
import { VehiclesExplorer } from "@/components/vehicles-explorer";
import { hargaSopirPerHari, hargaTermurah } from "@/lib/data";
import { rupiah } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Armada Mobil",
  description:
    "Daftar mobil yang bisa disewa di RentCar Bandung — MPV, SUV, hatchback, dan minibus — beserta harga sewa per hari dan ketersediaannya.",
};

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-14 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-body">
          <Link href="/" className="text-primary hover:underline">
            Beranda
          </Link>{" "}
          / Armada Mobil
        </p>
        <h1 className="mt-4 text-center text-4xl font-extrabold text-ink sm:text-5xl">
          Pilih mobil yang Anda butuhkan
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-body">
          Harga mulai {rupiah(hargaTermurah)} per hari sudah termasuk asuransi. Butuh sopir? Tambah{" "}
          {rupiah(hargaSopirPerHari)} per hari, berlaku untuk semua jenis mobil.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <VehiclesExplorer kategoriAwal={kategori} />
      </section>

      <CtaBanner />
    </>
  );
}
