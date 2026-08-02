"use client";

import { useState } from "react";
import { CalendarDays, CarFront, MessageCircle, UserRound } from "lucide-react";
import { FILTER_KATEGORI, hargaSopirPerHari } from "@/lib/data";
import { rupiah, waLink } from "@/lib/constants";

/**
 * Kartu di hero.
 *
 * Ini BUKAN form pemesanan — tidak ada yang disimpan. Isiannya hanya dipakai
 * untuk menyusun pesan WhatsApp supaya admin langsung tahu kebutuhan customer.
 */

const inputCls =
  "w-full rounded-xl border border-line bg-mist px-3.5 py-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-white";

function Isian({ label, ikon, children }: { label: string; ikon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink">
        <span className="text-primary">{ikon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

export function BookingCard() {
  const [jenis, setJenis] = useState<string>("Semua");
  const [ambil, setAmbil] = useState("");
  const [kembali, setKembali] = useState("");
  const [sopir, setSopir] = useState("Lepas kunci");

  const pesan = [
    "Halo Admin RentCar, saya mau tanya ketersediaan mobil.",
    jenis !== "Semua" ? `Jenis: ${jenis}` : null,
    ambil ? `Tanggal ambil: ${ambil}` : null,
    kembali ? `Tanggal kembali: ${kembali}` : null,
    `Layanan: ${sopir}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_60px_-20px_rgba(20,10,60,0.35)] sm:p-7">
      <h3 className="text-xl font-bold text-ink">Cek ketersediaan</h3>
      <p className="mt-1 text-sm text-body">
        Isi seperlunya, nanti pesannya otomatis tersusun untuk dikirim ke admin.
      </p>

      <div className="mt-5 space-y-4">
        <Isian label="Jenis mobil" ikon={<CarFront className="size-4" />}>
          <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={inputCls}>
            {FILTER_KATEGORI.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </Isian>

        <div className="grid grid-cols-2 gap-3">
          <Isian label="Tanggal ambil" ikon={<CalendarDays className="size-4" />}>
            <input type="date" value={ambil} onChange={(e) => setAmbil(e.target.value)} className={inputCls} />
          </Isian>
          <Isian label="Tanggal kembali" ikon={<CalendarDays className="size-4" />}>
            <input type="date" value={kembali} onChange={(e) => setKembali(e.target.value)} className={inputCls} />
          </Isian>
        </div>

        <Isian label="Layanan" ikon={<UserRound className="size-4" />}>
          <select value={sopir} onChange={(e) => setSopir(e.target.value)} className={inputCls}>
            <option>Lepas kunci</option>
            <option>Dengan sopir</option>
          </select>
        </Isian>

        {sopir === "Dengan sopir" ? (
          <p className="rounded-xl bg-primary-soft px-3.5 py-2.5 text-xs font-medium text-primary">
            Tambahan {rupiah(hargaSopirPerHari)}/hari untuk sopir, berlaku semua mobil.
          </p>
        ) : null}

        <a
          href={waLink(pesan)}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
        >
          <MessageCircle className="size-[18px]" />
          Tanya lewat WhatsApp
        </a>

        <p className="text-center text-xs text-body">
          Pemesanan diproses admin lewat chat — tidak ada pembayaran di website ini.
        </p>
      </div>
    </div>
  );
}
