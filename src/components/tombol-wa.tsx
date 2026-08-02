import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { rupiah, waLink } from "@/lib/constants";
import type { Car } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Semua jalur booking di landing page berujung ke WhatsApp admin.
 * Nomornya tidak pernah ditulis ulang di sini — diambil dari `src/lib/constants.ts`.
 */

export const pesanMobil = (mobil: Car) =>
  `Halo Admin RentCar, saya tertarik menyewa ${mobil.nama} (${rupiah(mobil.hargaPerHari)}/hari). ` +
  `Apakah unitnya tersedia?`;

export const pesanUmum = "Halo Admin RentCar, saya mau tanya-tanya soal sewa mobil.";

export function TombolWa({
  pesan,
  children,
  gaya = "utama",
  className,
}: {
  pesan: string;
  children: ReactNode;
  gaya?: "utama" | "kedua" | "aksen";
  className?: string;
}) {
  const warna = {
    utama: "bg-primary text-white hover:bg-primary-dark",
    kedua: "border border-line bg-white text-ink hover:border-primary hover:text-primary",
    aksen: "bg-accent text-ink hover:bg-accent-dark",
  }[gaya];

  return (
    <a
      href={waLink(pesan)}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition",
        warna,
        className,
      )}
    >
      <MessageCircle className="size-[18px]" />
      {children}
    </a>
  );
}
