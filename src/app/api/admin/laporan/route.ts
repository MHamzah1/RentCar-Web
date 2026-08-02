import { filterTransaksi, rekapTransaksi, type StatusTampil } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";

/**
 * Unduhan rekap transaksi.
 *
 * Kolom modal dan laba hanya ikut kalau yang login Super Admin — bukan
 * dikosongkan, tapi memang tidak ada kolomnya.
 *
 * Formatnya CSV dulu (langsung terbuka di Excel). Untuk `.xlsx` sungguhan
 * dengan format Rupiah dan baris total, rencananya memakai ExcelJS — lihat
 * `docs/06-keputusan-teknis.md`.
 */

const KOLOM_DASAR = [
  "Kode Transaksi",
  "Tanggal Mulai",
  "Tanggal Selesai",
  "Durasi (hari)",
  "Mobil",
  "Customer",
  "No. HP",
  "Layanan",
  "Harga Jual/Hari",
  "Biaya Sewa",
  "Biaya Sopir",
  "Denda",
  "Total Tagihan",
  "Sudah Dibayar",
  "Sisa Tagihan",
  "Status Bayar",
  "Status Transaksi",
];

const KOLOM_MODAL = ["Harga Modal/Hari", "Total Modal", "Laba"];

/** Bungkus nilai supaya aman dipakai di CSV berpemisah titik koma. */
const sel = (nilai: string | number) => {
  const teks = String(nilai);
  return /[";\n]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks;
};

export async function GET(request: Request) {
  const admin = await sesiAdmin();
  if (!admin) {
    return new Response("Tidak berwenang", { status: 401 });
  }

  const url = new URL(request.url);
  const mulai = url.searchParams.get("mulai") ?? undefined;
  const selesai = url.searchParams.get("selesai") ?? undefined;
  const status = (url.searchParams.get("status") as StatusTampil | "SEMUA" | null) ?? "SEMUA";

  const daftar = filterTransaksi(admin.peran, { mulai, selesai, status });
  const rekap = rekapTransaksi(daftar);
  const superAdmin = admin.peran === "SUPER_ADMIN";

  const baris: string[] = [];
  baris.push([...KOLOM_DASAR, ...(superAdmin ? KOLOM_MODAL : [])].map(sel).join(";"));

  for (const t of daftar) {
    const isi: (string | number)[] = [
      t.kode,
      t.startDate,
      t.endDate,
      t.durationDays,
      t.namaMobil,
      t.namaCustomer,
      t.noHpCustomer,
      t.pakaiSopir ? "Dengan sopir" : "Lepas kunci",
      t.sellPricePerDay,
      t.biayaSewa,
      t.biayaSopir,
      t.denda,
      t.totalTagihan,
      t.totalDibayar,
      t.sisaTagihan,
      t.statusBayar,
      t.status,
    ];
    if (superAdmin && t.modal) {
      isi.push(t.modal.costPricePerDay, t.modal.totalCost, t.modal.profit);
    }
    baris.push(isi.map(sel).join(";"));
  }

  // Baris total.
  const total: (string | number)[] = [
    "TOTAL",
    "",
    "",
    rekap.totalHari,
    "",
    "",
    "",
    "",
    "",
    daftar.reduce((n, t) => n + t.biayaSewa, 0),
    daftar.reduce((n, t) => n + t.biayaSopir, 0),
    rekap.totalDenda,
    rekap.totalTagihan,
    rekap.totalDibayar,
    rekap.totalTagihan - rekap.totalDibayar,
    "",
    `${rekap.jumlah} transaksi`,
  ];
  if (superAdmin) total.push("", rekap.totalCost, rekap.profit);
  baris.push(total.map(sel).join(";"));

  const nama = `rekap-transaksi-${mulai ?? "awal"}-sd-${selesai ?? "akhir"}.csv`;
  // BOM supaya Excel membaca karakter Indonesia dengan benar.
  const isi = `﻿${baris.join("\r\n")}`;

  return new Response(isi, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nama}"`,
      "Cache-Control": "no-store",
    },
  });
}
