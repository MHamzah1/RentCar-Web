"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/constants";

/**
 * Bukan form yang tersimpan.
 *
 * Isian di sini hanya menyusun pesan WhatsApp — tidak ada data yang dikirim ke
 * server, sesuai keputusan bahwa semua komunikasi lewat WhatsApp admin.
 */

const inputCls =
  "w-full rounded-xl border border-line bg-mist px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-white";

export function ContactForm() {
  const [nama, setNama] = useState("");
  const [kebutuhan, setKebutuhan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [catatan, setCatatan] = useState("");

  const teks = [
    "Halo Admin RentCar,",
    nama ? `Saya ${nama}.` : null,
    kebutuhan ? `Kebutuhan: ${kebutuhan}` : null,
    tanggal ? `Rencana pakai: ${tanggal}` : null,
    catatan ? `Catatan: ${catatan}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="rounded-3xl border border-line bg-white p-7 sm:p-9">
      <h2 className="text-2xl font-extrabold text-ink">Kirim pertanyaan</h2>
      <p className="mt-2 text-sm leading-relaxed text-body">
        Isi seperlunya, lalu tekan tombol di bawah. Pesannya tersusun otomatis dan terbuka di WhatsApp — tidak
        ada data yang tersimpan di website ini.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Nama</span>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda" className={inputCls} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">Butuh mobil apa?</span>
            <input
              value={kebutuhan}
              onChange={(e) => setKebutuhan(e.target.value)}
              placeholder="Contoh: MPV 7 kursi"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-ink">Rencana tanggal</span>
            <input
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              placeholder="Contoh: 10–13 Agustus"
              className={inputCls}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Catatan tambahan</span>
          <textarea
            rows={4}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tujuan perjalanan, butuh sopir atau tidak, dan lain-lain."
            className={inputCls}
          />
        </label>

        <a
          href={waLink(teks)}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
        >
          <MessageCircle className="size-[18px]" />
          Kirim lewat WhatsApp
        </a>
      </div>
    </div>
  );
}
