"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, ExternalLink, Gauge, MapPin, Navigation, Phone } from "lucide-react";
import type { UnitDilacak } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { Card, CardHeader, Pill, StatusBadge, tombolKedua } from "./ui";

/**
 * Peta skematik.
 *
 * Ini BUKAN peta sungguhan — vendor GPS tracker dan library peta belum
 * diputuskan (`docs/06-keputusan-teknis.md`, pertanyaan terbuka no. 1).
 * Marker diletakkan dari koordinat asli yang dinormalisasi ke dalam kotak,
 * jadi posisi relatif antar unit tetap masuk akal.
 */
export function PetaTracking({ unit }: { unit: UnitDilacak[] }) {
  const [aktif, setAktif] = useState(unit[0]?.kodeTransaksi ?? "");
  const terpilih = unit.find((u) => u.kodeTransaksi === aktif) ?? unit[0];

  const lats = unit.map((u) => u.lat);
  const lngs = unit.map((u) => u.lng);
  const minLat = Math.min(...lats);
  const maksLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maksLng = Math.max(...lngs);

  const posisi = (u: UnitDilacak) => ({
    // 10–90% supaya marker tidak menempel di tepi.
    left: `${10 + ((u.lng - minLng) / (maksLng - minLng || 1)) * 80}%`,
    top: `${10 + ((maksLat - u.lat) / (maksLat - minLat || 1)) * 80}%`,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      {/* Peta */}
      <Card className="overflow-hidden">
        <CardHeader
          judul="Posisi unit"
          deskripsi="Klik penanda untuk melihat detail transaksinya."
          aksi={
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          }
        />
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef0f7]">
          {/* Garis kisi supaya terbaca sebagai bidang peta */}
          <svg className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <pattern id="kisi" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#dcdfec" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kisi)" />
            <path
              d="M -20 62% Q 30% 48%, 55% 58% T 120% 44%"
              fill="none"
              stroke="#c9cee3"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 18% -20 Q 26% 40%, 48% 70% T 66% 120%"
              fill="none"
              stroke="#d5d9ea"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>

          {unit.map((u) => {
            const dipilih = u.kodeTransaksi === terpilih?.kodeTransaksi;
            const telat = u.status === "OVERTIME";
            return (
              <button
                key={u.kodeTransaksi}
                type="button"
                onClick={() => setAktif(u.kodeTransaksi)}
                style={posisi(u)}
                className="absolute -translate-x-1/2 -translate-y-full"
                aria-label={`Lihat ${u.namaMobil}`}
              >
                <span
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-bold shadow-lg transition",
                    telat
                      ? "bg-red-600 text-white"
                      : dipilih
                        ? "bg-primary text-white"
                        : "bg-white text-ink hover:bg-primary hover:text-white",
                    dipilih && "scale-110 ring-2 ring-white",
                  )}
                >
                  <MapPin className="size-3.5" />
                  {u.namaMobil.split(" ").slice(0, 2).join(" ")}
                </span>
                <span
                  className={cn(
                    "mx-auto block size-2 rotate-45",
                    telat ? "bg-red-600" : dipilih ? "bg-primary" : "bg-white",
                  )}
                />
              </button>
            );
          })}

          <p className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-body">
            Peta skematik — posisi relatif dari koordinat asli
          </p>
        </div>
      </Card>

      {/* Detail unit terpilih + daftar */}
      <div className="space-y-4">
        {terpilih ? (
          <Card>
            <CardHeader judul={terpilih.namaMobil} aksi={<StatusBadge status={terpilih.status} />} />
            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">{terpilih.lokasiPerkiraan}</p>
                  <p className="font-mono text-xs text-body">
                    {terpilih.lat.toFixed(4)}, {terpilih.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-mist p-3">
                  <Gauge className="size-4 text-primary" />
                  <p className="mt-1.5 text-xs text-body">Kecepatan</p>
                  <p className="text-[13px] font-bold text-ink">
                    {terpilih.kecepatan > 0 ? `${terpilih.kecepatan} km/jam` : "Berhenti"}
                  </p>
                </div>
                <div className="rounded-xl bg-mist p-3">
                  <Navigation className="size-4 text-primary" />
                  <p className="mt-1.5 text-xs text-body">Arah</p>
                  <p className="text-[13px] font-bold text-ink">{terpilih.arah}</p>
                </div>
              </div>

              <dl className="space-y-2 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-body">Penyewa</dt>
                  <dd className="font-semibold text-ink">{terpilih.namaCustomer}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-body">Batas kembali</dt>
                  <dd className="font-semibold text-ink">{terpilih.batasKembali}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-body">Update terakhir</dt>
                  <dd className="font-semibold text-ink">{terpilih.terakhirUpdate}</dd>
                </div>
              </dl>

              {terpilih.jamTelat > 0 ? (
                <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">
                  <Clock className="size-4" />
                  Telat {terpilih.jamTelat} jam dari batas kembali
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/transaksi/${terpilih.kodeTransaksi}`} className={`${tombolKedua} flex-1`}>
                  Detail transaksi
                </Link>
                <a
                  href={`https://www.google.com/maps?q=${terpilih.lat},${terpilih.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className={tombolKedua}
                >
                  <ExternalLink className="size-4" />
                  Google Maps
                </a>
              </div>
              <a href={`tel:${terpilih.noHpCustomer.replace(/\D/g, "")}`} className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                <Phone className="size-4" />
                {terpilih.noHpCustomer}
              </a>
            </div>
          </Card>
        ) : null}

        <Card>
          <CardHeader judul="Semua unit di luar" deskripsi={`${unit.length} unit sedang dilacak.`} />
          <ul className="divide-y divide-line">
            {unit.map((u) => (
              <li key={u.kodeTransaksi}>
                <button
                  type="button"
                  onClick={() => setAktif(u.kodeTransaksi)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-mist",
                    u.kodeTransaksi === terpilih?.kodeTransaksi && "bg-mist",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      u.status === "OVERTIME" ? "bg-red-500" : u.kecepatan > 0 ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-ink">{u.namaMobil}</span>
                    <span className="block truncate text-xs text-body">{u.lokasiPerkiraan}</span>
                  </span>
                  {u.status === "OVERTIME" ? <Pill nada="bahaya">Telat</Pill> : null}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
