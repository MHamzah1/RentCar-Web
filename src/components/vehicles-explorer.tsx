"use client";

import { useState } from "react";
import { CarFront } from "lucide-react";
import { cars, FILTER_KATEGORI, type FilterKategori } from "@/lib/data";
import { KartuMobil } from "./car-cards";
import { cn } from "@/lib/utils";

export function VehiclesExplorer({ kategoriAwal }: { kategoriAwal?: string }) {
  const awal = FILTER_KATEGORI.includes(kategoriAwal as FilterKategori)
    ? (kategoriAwal as FilterKategori)
    : "Semua";
  const [aktif, setAktif] = useState<FilterKategori>(awal);
  const [hanyaTersedia, setHanyaTersedia] = useState(false);

  const hasil = cars.filter((c) => {
    if (aktif !== "Semua" && c.kategori !== aktif) return false;
    if (hanyaTersedia && c.unitTersedia === 0) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {FILTER_KATEGORI.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setAktif(k)}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
              k === aktif
                ? "bg-primary text-white shadow-[0_14px_30px_-12px_rgba(89,55,224,0.6)]"
                : "bg-mist text-ink hover:bg-primary-soft",
            )}
          >
            {k !== "Semua" ? <CarFront className="size-4" /> : null}
            {k}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={hanyaTersedia}
            onChange={(e) => setHanyaTersedia(e.target.checked)}
            className="size-4 accent-primary"
          />
          Tampilkan yang tersedia saja
        </label>
        <span className="text-sm text-body">
          {hasil.length} dari {cars.length} mobil
        </span>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hasil.map((mobil) => (
          <KartuMobil key={mobil.slug} mobil={mobil} />
        ))}
      </div>

      {hasil.length === 0 ? (
        <p className="mt-10 text-center text-body">
          Tidak ada mobil di kategori ini yang sedang kosong. Coba hubungi admin — kadang ada unit yang baru
          kembali.
        </p>
      ) : null}
    </div>
  );
}
