"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarPlus, Eye, Search } from "lucide-react";
import { CarImage } from "@/components/car-image";
import type { AdminCar } from "@/lib/admin";
import { rupiah } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card, Pill, inputDasar, tombolKedua, tombolUtama } from "./ui";

const KATEGORI = ["Semua", "MPV", "SUV", "Hatchback", "Minibus"] as const;

export function KatalogGrid({ mobil }: { mobil: AdminCar[] }) {
  const [kunci, setKunci] = useState("");
  const [kategori, setKategori] = useState<(typeof KATEGORI)[number]>("Semua");
  const [hanyaTersedia, setHanyaTersedia] = useState(false);

  const hasil = useMemo(() => {
    const k = kunci.trim().toLowerCase();
    return mobil.filter((m) => {
      if (kategori !== "Semua" && m.kategori !== kategori) return false;
      if (hanyaTersedia && m.unitTersedia === 0) return false;
      if (k && !`${m.nama} ${m.merek} ${m.kategori}`.toLowerCase().includes(k)) return false;
      return true;
    });
  }, [mobil, kunci, kategori, hanyaTersedia]);

  return (
    <div className="space-y-5">
      {/* Filter */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <label className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-body" />
          <input
            type="search"
            value={kunci}
            onChange={(e) => setKunci(e.target.value)}
            placeholder="Cari nama atau merek mobil…"
            className={`${inputDasar} pl-10`}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {KATEGORI.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKategori(k)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                k === kategori ? "bg-primary text-white" : "bg-mist text-ink hover:bg-primary-soft",
              )}
            >
              {k}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={hanyaTersedia}
            onChange={(e) => setHanyaTersedia(e.target.checked)}
            className="size-4 accent-primary"
          />
          Hanya yang tersedia
        </label>
      </Card>

      <p className="text-sm text-body">
        Menampilkan <strong className="text-ink">{hasil.length}</strong> dari {mobil.length} model.
      </p>

      {/* Grid */}
      {hasil.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <p className="text-[15px] font-bold text-ink">Tidak ada mobil yang cocok</p>
          <p className="mt-1 text-sm text-body">Coba ubah kata kunci atau kategori.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hasil.map((m) => (
            <KartuMobil key={m.slug} mobil={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function KartuMobil({ mobil: m }: { mobil: AdminCar }) {
  const habis = m.unitTersedia === 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-40 bg-mist">
        <CarImage src={m.foto} alt={m.nama} sizes="(max-width: 768px) 100vw, 33vw" />
        <span className="absolute left-3 top-3">
          <Pill nada="netral">{m.kategori}</Pill>
        </span>
        {!m.isPublished ? (
          <span className="absolute right-3 top-3">
            <Pill nada="peringatan">Tidak tayang</Pill>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-bold text-ink">{m.nama}</h3>
        <p className="text-xs text-body">
          {m.tahun} · {m.spesifikasi.transmisi} · {m.spesifikasi.kursi} kursi
        </p>

        {/* Harga */}
        <div className="mt-4 rounded-xl bg-mist p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-body">Harga jual</span>
            <span className="text-base font-extrabold text-ink">
              {rupiah(m.sellPricePerDay)}
              <span className="text-xs font-medium text-body">/hari</span>
            </span>
          </div>
          {m.modal ? (
            <>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <span className="text-xs text-body">Harga modal</span>
                <span className="text-[13px] font-semibold text-body">{rupiah(m.modal.costPricePerDay)}</span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between gap-2 border-t border-line pt-1.5">
                <span className="text-xs font-semibold text-ink">Margin</span>
                <span className="text-[13px] font-bold text-emerald-600">
                  {rupiah(m.modal.marginPerHari)} ({m.modal.marginPersen}%)
                </span>
              </div>
            </>
          ) : null}
        </div>

        {/* Ketersediaan */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-body">Unit tersedia</span>
            <span className={cn("font-bold", habis ? "text-red-600" : "text-emerald-600")}>
              {m.unitTersedia} dari {m.totalUnit}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: m.totalUnit }).map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 flex-1 rounded-full", i < m.unitTersedia ? "bg-emerald-500" : "bg-line")}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2 pt-1">
          <Link href={`/admin/katalog/${m.slug}`} className={`${tombolKedua} flex-1`}>
            <Eye className="size-4" />
            Detail
          </Link>
          {habis ? (
            <span className={`${tombolUtama} flex-1 cursor-not-allowed opacity-50`} aria-disabled>
              Unit habis
            </span>
          ) : (
            <Link href={`/admin/transaksi/baru?mobil=${m.slug}`} className={`${tombolUtama} flex-1`}>
              <CalendarPlus className="size-4" />
              Booking
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
