import Link from "next/link";
import { DoorOpen, Fuel, Settings2, Snowflake, Users } from "lucide-react";
import type { Car } from "@/lib/data";
import { rupiah } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CarImage } from "./car-image";
import { TombolWa, pesanMobil } from "./tombol-wa";

function BadgeKetersediaan({ mobil }: { mobil: Car }) {
  const ada = mobil.unitTersedia > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        ada ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600",
      )}
    >
      <span className={cn("size-1.5 rounded-full", ada ? "bg-emerald-500" : "bg-zinc-400")} />
      {ada ? `Tersedia (${mobil.unitTersedia} unit)` : "Sedang disewa"}
    </span>
  );
}

/** Kartu di beranda — spesifikasi ringkas + tombol WhatsApp. */
export function KartuUnggulan({ mobil }: { mobil: Car }) {
  const spesifikasi = [
    { ikon: Users, label: `${mobil.spesifikasi.kursi} kursi` },
    { ikon: Settings2, label: mobil.spesifikasi.transmisi },
    { ikon: Fuel, label: mobil.spesifikasi.bahanBakar },
    { ikon: DoorOpen, label: `${mobil.spesifikasi.pintu} pintu` },
  ];

  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(20,10,60,0.25)]">
      <Link href={`/vehicles/${mobil.slug}`} className="relative block h-40 overflow-hidden rounded-2xl bg-mist">
        <CarImage src={mobil.foto} alt={mobil.nama} sizes="(max-width: 768px) 100vw, 25vw" />
      </Link>

      <div className="mt-4">
        <BadgeKetersediaan mobil={mobil} />
        <h3 className="mt-2 text-[17px] font-bold text-ink">
          <Link href={`/vehicles/${mobil.slug}`} className="hover:text-primary">
            {mobil.nama}
          </Link>
        </h3>
        <p className="text-sm text-body">{mobil.kategori}</p>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5">
        {spesifikasi.map(({ ikon: Ikon, label }) => (
          <li key={label} className="flex items-center gap-2 text-[13px] text-body">
            <Ikon className="size-4 text-primary" />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-xs text-body">Harga sewa</p>
        <p className="text-lg font-extrabold text-ink">
          {rupiah(mobil.hargaPerHari)}
          <span className="text-sm font-medium text-body"> /hari</span>
        </p>
        <TombolWa pesan={pesanMobil(mobil)} className="mt-3 w-full">
          Booking via WhatsApp
        </TombolWa>
      </div>
    </div>
  );
}

/** Kartu di halaman armada. */
export function KartuMobil({ mobil }: { mobil: Car }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(20,10,60,0.25)]">
      <Link href={`/vehicles/${mobil.slug}`} className="relative block h-44 overflow-hidden rounded-2xl bg-mist">
        <CarImage src={mobil.foto} alt={mobil.nama} sizes="(max-width: 768px) 100vw, 33vw" />
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-bold text-ink">
            <Link href={`/vehicles/${mobil.slug}`} className="hover:text-primary">
              {mobil.nama}
            </Link>
          </h3>
          <p className="text-sm text-body">
            {mobil.kategori} · {mobil.tahun}
          </p>
        </div>
        <p className="shrink-0 text-right">
          <span className="block text-lg font-extrabold text-primary">{rupiah(mobil.hargaPerHari)}</span>
          <span className="block text-xs font-medium text-body">per hari</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-[13px] text-body">
        <span className="flex items-center gap-1.5">
          <Settings2 className="size-4 text-primary" />
          {mobil.spesifikasi.transmisi}
        </span>
        <span className="flex items-center gap-1.5">
          <Fuel className="size-4 text-primary" />
          {mobil.spesifikasi.bahanBakar}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-4 text-primary" />
          {mobil.spesifikasi.kursi}
        </span>
        <span className="flex items-center gap-1.5">
          <Snowflake className="size-4 text-primary" />
          AC
        </span>
      </div>

      <div className="mt-4">
        <BadgeKetersediaan mobil={mobil} />
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/vehicles/${mobil.slug}`}
          className="flex flex-1 items-center justify-center rounded-xl border border-line py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
        >
          Detail
        </Link>
        <TombolWa pesan={pesanMobil(mobil)} className="flex-1 py-3 text-sm">
          Booking
        </TombolWa>
      </div>
    </div>
  );
}
