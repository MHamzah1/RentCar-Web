/**
 * Lapisan query untuk Admin Internal.
 *
 * Modul ini boleh melihat semua data. **Jangan diimpor dari halaman publik.**
 *
 * Dua aturan yang dijaga di sini:
 *
 * 1. **Peran menentukan isi data.** Angka modal, margin, dan laba hanya ikut
 *    kalau peran `SUPER_ADMIN`. Untuk `ADMIN` biasa field `modal` sama sekali
 *    tidak ada — bukan disembunyikan di tampilan.
 * 2. **Nilai turunan dihitung, tidak disimpan.** Tanggal selesai, status
 *    Lewat Waktu, denda, total, dan unit tersedia semuanya dihitung dari
 *    sumbernya supaya tidak bisa drift.
 */

import {
  DENDA_PER_JAM,
  HARI_INI,
  SEKARANG_JAM,
  dalamRentang,
  jamDariTeks,
  keJam,
  selisihHari,
  tambahHari,
} from "./constants";
import {
  adminRecords,
  carRecords,
  customerRecords,
  dokumenRecords,
  jaminanRecords,
  paymentRecords,
  posisiRecords,
  transactionRecords,
  type CarRecord,
  type CustomerRecord,
  type PaymentRecord,
  type PeranAdmin,
  type StatusTersimpan,
  type TransactionRecord,
} from "./db";

export type { CustomerRecord, PaymentRecord, PeranAdmin } from "./db";

/* ------------------------------------------------------------------ status */

/** Status yang ditampilkan — termasuk OVERTIME yang tidak disimpan. */
export type StatusTampil = StatusTersimpan | "OVERTIME";

export const STATUS_LABEL: Record<StatusTampil, string> = {
  BOOKING: "Booking",
  ON_TRIP: "Sedang Perjalanan",
  OVERTIME: "Lewat Waktu",
  EXTENDED: "Diperpanjang",
  DONE: "Selesai",
  CANCELLED: "Batal",
};

export const URUTAN_STATUS: StatusTampil[] = ["BOOKING", "ON_TRIP", "OVERTIME", "EXTENDED", "DONE", "CANCELLED"];

/** Status yang menahan satu unit mobil. */
const MENAHAN_UNIT: StatusTersimpan[] = ["BOOKING", "ON_TRIP", "EXTENDED"];

/** Status yang berarti mobil sedang di luar. */
export const SEDANG_DI_LUAR: StatusTampil[] = ["ON_TRIP", "EXTENDED", "OVERTIME"];

/* ----------------------------------------------------------------- katalog */

export interface AdminCar {
  slug: string;
  nama: string;
  merek: string;
  tahun: number;
  kategori: CarRecord["kategori"];
  deskripsi: string;
  foto: string;
  galeri: string[];
  spesifikasi: CarRecord["spesifikasi"];
  fasilitas: string[];
  sellPricePerDay: number;
  totalUnit: number;
  unitTerpakai: number;
  unitTersedia: number;
  isPublished: boolean;
  /** Hanya ada untuk SUPER_ADMIN. */
  modal?: {
    costPricePerDay: number;
    marginPerHari: number;
    marginPersen: number;
  };
}

const hitungUnitTerpakai = (slug: string) =>
  transactionRecords.filter((t) => t.carSlug === slug && MENAHAN_UNIT.includes(t.status)).length;

const keAdminCar = (c: CarRecord, peran: PeranAdmin): AdminCar => {
  const unitTerpakai = hitungUnitTerpakai(c.slug);
  const margin = c.sellPricePerDay - c.costPricePerDay;
  const dasar: AdminCar = {
    slug: c.slug,
    nama: c.nama,
    merek: c.merek,
    tahun: c.tahun,
    kategori: c.kategori,
    deskripsi: c.deskripsi,
    foto: c.foto,
    galeri: c.galeri,
    spesifikasi: c.spesifikasi,
    fasilitas: c.fasilitas,
    sellPricePerDay: c.sellPricePerDay,
    totalUnit: c.totalUnit,
    unitTerpakai,
    unitTersedia: Math.max(0, c.totalUnit - unitTerpakai),
    isPublished: c.isPublished,
  };

  if (peran !== "SUPER_ADMIN") return dasar;

  return {
    ...dasar,
    modal: {
      costPricePerDay: c.costPricePerDay,
      marginPerHari: margin,
      marginPersen: Math.round((margin / c.sellPricePerDay) * 100),
    },
  };
};

export const daftarMobil = (peran: PeranAdmin): AdminCar[] => carRecords.map((c) => keAdminCar(c, peran));

export const getMobil = (slug: string, peran: PeranAdmin) => daftarMobil(peran).find((c) => c.slug === slug);

/* --------------------------------------------------------------- transaksi */

export type StatusBayar = "BELUM_BAYAR" | "DP" | "LUNAS";

export const LABEL_BAYAR: Record<StatusBayar, string> = {
  BELUM_BAYAR: "Belum Bayar",
  DP: "DP",
  LUNAS: "Lunas",
};

export interface AdminTransaksi {
  kode: string;
  carSlug: string;
  customerId: string;
  namaMobil: string;
  kategoriMobil: string;
  fotoMobil: string;
  namaCustomer: string;
  noHpCustomer: string;
  jaminanRingkas: string;
  namaAdmin: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  hariTambahan: number;
  jamBerangkat: string;
  /** Batas pengembalian: endDate pada jam berangkat. */
  batasKembali: string;
  status: StatusTampil;
  statusTersimpan: StatusTersimpan;
  /** Jam keterlambatan, 0 kalau tidak telat. */
  jamTelat: number;
  pakaiSopir: boolean;
  videoSerahTerima: string | null;
  videoDiunggahPada: string | null;
  dibatalkanPada: string | null;
  alasanBatal: string;
  catatan: string;
  dibuatPada: string;
  /* uang */
  sellPricePerDay: number;
  hargaSopirPerHari: number;
  biayaSewa: number;
  biayaSopir: number;
  denda: number;
  totalTagihan: number;
  totalDibayar: number;
  sisaTagihan: number;
  statusBayar: StatusBayar;
  pembayaran: PaymentRecord[];
  /** Hanya ada untuk SUPER_ADMIN. */
  modal?: {
    costPricePerDay: number;
    upahSopirPerHari: number;
    totalCost: number;
    profit: number;
    marginPersen: number;
  };
}

const batasKembaliJam = (t: TransactionRecord) =>
  keJam(tambahHari(t.startDate, t.durationDays), jamDariTeks(t.jamBerangkat));

const hitungJamTelat = (t: TransactionRecord) => {
  if (t.status !== "ON_TRIP" && t.status !== "EXTENDED") return 0;
  return Math.max(0, Math.floor(SEKARANG_JAM - batasKembaliJam(t)));
};

const keAdminTransaksi = (t: TransactionRecord, peran: PeranAdmin): AdminTransaksi => {
  const mobil = carRecords.find((c) => c.slug === t.carSlug);
  const customer = customerRecords.find((c) => c.id === t.customerId);
  const jaminan = jaminanRecords.find((j) => j.id === t.jaminanId);
  const admin = adminRecords.find((a) => a.id === t.dibuatOlehAdminId);
  const pembayaran = paymentRecords.filter((p) => p.kodeTransaksi === t.kode);

  const jamTelat = hitungJamTelat(t);
  const status: StatusTampil = jamTelat > 0 ? "OVERTIME" : t.status;
  const dibatalkan = t.status === "CANCELLED";

  const biayaSewa = dibatalkan ? 0 : t.sellPricePerDay * t.durationDays;
  const biayaSopir = dibatalkan || !t.pakaiSopir ? 0 : t.hargaSopirPerHari * t.durationDays;
  // Selama masih jalan denda dihitung live; begitu ditutup, dipakai angka yang dikunci.
  const denda = dibatalkan ? 0 : jamTelat > 0 ? jamTelat * DENDA_PER_JAM : t.dendaTercatat;
  const totalTagihan = biayaSewa + biayaSopir + denda;
  const totalDibayar = pembayaran.reduce((n, p) => n + p.jumlah, 0);

  const statusBayar: StatusBayar =
    totalDibayar === 0 ? "BELUM_BAYAR" : totalDibayar >= totalTagihan ? "LUNAS" : "DP";

  const dasar: AdminTransaksi = {
    kode: t.kode,
    carSlug: t.carSlug,
    customerId: t.customerId,
    namaMobil: mobil?.nama ?? "(mobil dihapus)",
    kategoriMobil: mobil?.kategori ?? "-",
    fotoMobil: mobil?.foto ?? "",
    namaCustomer: customer?.namaLengkap ?? "(customer dihapus)",
    noHpCustomer: customer?.noHpWa ?? "-",
    jaminanRingkas: jaminan ? `${jaminan.kendaraan} · ${jaminan.plat} (a.n. ${jaminan.atasNama})` : "-",
    namaAdmin: admin?.nama ?? "-",
    startDate: t.startDate,
    endDate: tambahHari(t.startDate, t.durationDays),
    durationDays: t.durationDays,
    hariTambahan: t.hariTambahan,
    jamBerangkat: t.jamBerangkat,
    batasKembali: `${tambahHari(t.startDate, t.durationDays)} ${t.jamBerangkat}`,
    status,
    statusTersimpan: t.status,
    jamTelat,
    pakaiSopir: t.pakaiSopir,
    videoSerahTerima: t.videoSerahTerima,
    videoDiunggahPada: t.videoDiunggahPada,
    dibatalkanPada: t.dibatalkanPada,
    alasanBatal: t.alasanBatal,
    catatan: t.catatan,
    dibuatPada: t.dibuatPada,
    sellPricePerDay: t.sellPricePerDay,
    hargaSopirPerHari: t.hargaSopirPerHari,
    biayaSewa,
    biayaSopir,
    denda,
    totalTagihan,
    totalDibayar,
    sisaTagihan: Math.max(0, totalTagihan - totalDibayar),
    statusBayar,
    pembayaran,
  };

  if (peran !== "SUPER_ADMIN") return dasar;

  const totalCost = dibatalkan
    ? 0
    : (t.costPricePerDay + (t.pakaiSopir ? t.upahSopirPerHari : 0)) * t.durationDays;
  const profit = totalTagihan - totalCost;

  return {
    ...dasar,
    modal: {
      costPricePerDay: t.costPricePerDay,
      upahSopirPerHari: t.upahSopirPerHari,
      totalCost,
      profit,
      marginPersen: totalTagihan > 0 ? Math.round((profit / totalTagihan) * 100) : 0,
    },
  };
};

/** Semua transaksi, yang paling baru mulai di atas. */
export const daftarTransaksi = (peran: PeranAdmin): AdminTransaksi[] =>
  transactionRecords
    .map((t) => keAdminTransaksi(t, peran))
    .sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));

export const getTransaksi = (kode: string, peran: PeranAdmin) =>
  daftarTransaksi(peran).find((t) => t.kode === kode);

export interface FilterTransaksi {
  status?: StatusTampil | "SEMUA";
  mulai?: string;
  selesai?: string;
  cari?: string;
}

export function filterTransaksi(peran: PeranAdmin, { status, mulai, selesai, cari }: FilterTransaksi = {}) {
  const kunci = cari?.trim().toLowerCase() ?? "";
  return daftarTransaksi(peran).filter((t) => {
    if (status && status !== "SEMUA" && t.status !== status) return false;
    if (mulai && t.startDate < mulai) return false;
    if (selesai && t.startDate > selesai) return false;
    if (kunci && !`${t.kode} ${t.namaMobil} ${t.namaCustomer}`.toLowerCase().includes(kunci)) return false;
    return true;
  });
}

export const rekapTransaksi = (daftar: AdminTransaksi[]) => ({
  jumlah: daftar.length,
  totalHari: daftar.reduce((n, t) => n + t.durationDays, 0),
  totalTagihan: daftar.reduce((n, t) => n + t.totalTagihan, 0),
  totalDibayar: daftar.reduce((n, t) => n + t.totalDibayar, 0),
  totalDenda: daftar.reduce((n, t) => n + t.denda, 0),
  totalCost: daftar.reduce((n, t) => n + (t.modal?.totalCost ?? 0), 0),
  profit: daftar.reduce((n, t) => n + (t.modal?.profit ?? 0), 0),
});

/* ---------------------------------------------------------------- customer */

export interface AdminCustomer extends CustomerRecord {
  jumlahTransaksi: number;
  totalBelanja: number;
  transaksiTerakhir: string | null;
  jumlahDokumen: number;
  jaminan: typeof jaminanRecords;
  langganan: boolean;
}

const transaksiMilik = (customerId: string) => transactionRecords.filter((t) => t.customerId === customerId);

const keAdminCustomer = (c: CustomerRecord): AdminCustomer => {
  const miliknya = transaksiMilik(c.id);
  const tanggal = miliknya.map((t) => t.startDate).sort();
  return {
    ...c,
    jumlahTransaksi: miliknya.length,
    totalBelanja: miliknya
      .filter((t) => t.status !== "CANCELLED")
      .reduce((n, t) => n + t.sellPricePerDay * t.durationDays, 0),
    transaksiTerakhir: tanggal.at(-1) ?? null,
    jumlahDokumen: dokumenRecords.filter((d) => d.customerId === c.id).length,
    jaminan: jaminanRecords.filter((j) => j.customerId === c.id),
    langganan: miliknya.length >= 2,
  };
};

export const daftarCustomer: AdminCustomer[] = customerRecords
  .map(keAdminCustomer)
  .sort((a, b) => a.namaLengkap.localeCompare(b.namaLengkap));

export const getCustomer = (id: string) => daftarCustomer.find((c) => c.id === id);

export const cariCustomer = (kunci: string) => {
  const k = kunci.trim().toLowerCase();
  if (!k) return daftarCustomer;
  return daftarCustomer.filter((c) => `${c.namaLengkap} ${c.noHpWa} ${c.nik} ${c.email}`.toLowerCase().includes(k));
};

export const dokumenCustomer = (id: string) => dokumenRecords.filter((d) => d.customerId === id);

export const transaksiCustomer = (id: string, peran: PeranAdmin) =>
  daftarTransaksi(peran).filter((t) => t.customerId === id);

/* ---------------------------------------------------------------- tracking */

export interface UnitDilacak {
  kodeTransaksi: string;
  namaMobil: string;
  lat: number;
  lng: number;
  kecepatan: number;
  arah: string;
  lokasiPerkiraan: string;
  terakhirUpdate: string;
  namaCustomer: string;
  noHpCustomer: string;
  batasKembali: string;
  status: StatusTampil;
  jamTelat: number;
}

export const unitDilacak = (peran: PeranAdmin): UnitDilacak[] => {
  const jalan = daftarTransaksi(peran).filter((t) => SEDANG_DI_LUAR.includes(t.status));
  return jalan
    .map((t) => {
      const p = posisiRecords.find((x) => x.kodeTransaksi === t.kode);
      if (!p) return null;
      return {
        kodeTransaksi: t.kode,
        namaMobil: t.namaMobil,
        lat: p.lat,
        lng: p.lng,
        kecepatan: p.kecepatan,
        arah: p.arah,
        lokasiPerkiraan: p.lokasiPerkiraan,
        terakhirUpdate: p.terakhirUpdate,
        namaCustomer: t.namaCustomer,
        noHpCustomer: t.noHpCustomer,
        batasKembali: t.batasKembali,
        status: t.status,
        jamTelat: t.jamTelat,
      } satisfies UnitDilacak;
    })
    .filter((u): u is UnitDilacak => u !== null);
};

/** Unit yang di luar tapi belum terbaca trackernya — ditampilkan apa adanya. */
export const unitTanpaSinyal = (peran: PeranAdmin) =>
  daftarTransaksi(peran)
    .filter((t) => SEDANG_DI_LUAR.includes(t.status) && !posisiRecords.some((p) => p.kodeTransaksi === t.kode))
    .map((t) => ({ kode: t.kode, namaMobil: t.namaMobil, namaCustomer: t.namaCustomer }));

/* ------------------------------------------------------------ notifikasi */

export interface Notifikasi {
  id: string;
  jenis: "OVERTIME" | "KEMBALI_HARI_INI" | "BERANGKAT_HARI_INI" | "BELUM_BAYAR";
  judul: string;
  detail: string;
  href: string;
  mendesak: boolean;
}

/**
 * Reminder untuk admin — tampil di dalam aplikasi (lonceng + dashboard).
 * Tidak mengirim apa pun ke customer; itu di luar lingkup (`docs/01`).
 */
export const notifikasiAdmin = (peran: PeranAdmin): Notifikasi[] => {
  const semua = daftarTransaksi(peran);
  const hasil: Notifikasi[] = [];

  for (const t of semua.filter((x) => x.status === "OVERTIME")) {
    hasil.push({
      id: `ot-${t.kode}`,
      jenis: "OVERTIME",
      judul: `${t.namaMobil} lewat ${t.jamTelat} jam`,
      detail: `${t.namaCustomer} — batas kembali ${t.batasKembali}. Denda berjalan.`,
      href: `/admin/transaksi/${t.kode}`,
      mendesak: true,
    });
  }

  for (const t of semua.filter((x) => x.endDate === HARI_INI && SEDANG_DI_LUAR.includes(x.status))) {
    hasil.push({
      id: `kb-${t.kode}`,
      jenis: "KEMBALI_HARI_INI",
      judul: `${t.namaMobil} kembali hari ini`,
      detail: `${t.namaCustomer} — jam ${t.jamBerangkat}.`,
      href: `/admin/transaksi/${t.kode}`,
      mendesak: false,
    });
  }

  for (const t of semua.filter((x) => x.startDate === HARI_INI && x.status === "BOOKING")) {
    hasil.push({
      id: `br-${t.kode}`,
      jenis: "BERANGKAT_HARI_INI",
      judul: `${t.namaMobil} berangkat hari ini`,
      detail: `${t.namaCustomer} — jam ${t.jamBerangkat}. Jangan lupa video serah terima.`,
      href: `/admin/transaksi/${t.kode}`,
      mendesak: true,
    });
  }

  for (const t of semua.filter((x) => x.statusBayar === "BELUM_BAYAR" && x.status === "BOOKING")) {
    hasil.push({
      id: `by-${t.kode}`,
      jenis: "BELUM_BAYAR",
      judul: `${t.kode} belum ada pembayaran`,
      detail: `${t.namaCustomer} — berangkat ${t.startDate}, DP belum masuk.`,
      href: `/admin/transaksi/${t.kode}`,
      mendesak: false,
    });
  }

  return hasil;
};

/* --------------------------------------------------------------- dashboard */

const awalBulan = `${HARI_INI.slice(0, 7)}-01`;

export const ringkasanDashboard = (peran: PeranAdmin) => {
  const semua = daftarTransaksi(peran);
  const mobil = daftarMobil(peran);

  const diLuar = semua.filter((t) => SEDANG_DI_LUAR.includes(t.status));
  const booking = semua.filter((t) => t.status === "BOOKING");
  const overtime = semua.filter((t) => t.status === "OVERTIME");
  const bulanIni = semua.filter((t) => t.startDate >= awalBulan && t.status !== "CANCELLED");
  const rekap = rekapTransaksi(bulanIni);

  const totalUnit = mobil.reduce((n, c) => n + c.totalUnit, 0);
  const unitTerpakai = mobil.reduce((n, c) => n + c.unitTerpakai, 0);

  return {
    diLuar: diLuar.length,
    overtime: overtime.length,
    menungguBerangkat: booking.length,
    totalUnit,
    unitTerpakai,
    unitTersedia: totalUnit - unitTerpakai,
    utilisasi: Math.round((unitTerpakai / totalUnit) * 100),
    transaksiBulanIni: bulanIni.length,
    pendapatanBulanIni: rekap.totalTagihan,
    dibayarBulanIni: rekap.totalDibayar,
    piutang: semua
      .filter((t) => t.status !== "CANCELLED")
      .reduce((n, t) => n + t.sisaTagihan, 0),
    labaBulanIni: peran === "SUPER_ADMIN" ? rekap.profit : null,
    modalBulanIni: peran === "SUPER_ADMIN" ? rekap.totalCost : null,
    totalCustomer: daftarCustomer.length,
    customerLangganan: daftarCustomer.filter((c) => c.langganan).length,
  };
};

export const agendaHariIni = (peran: PeranAdmin) => {
  const semua = daftarTransaksi(peran);
  return {
    berangkat: semua.filter((t) => t.startDate === HARI_INI && t.status === "BOOKING"),
    kembali: semua.filter((t) => t.endDate === HARI_INI && SEDANG_DI_LUAR.includes(t.status)),
    terlambat: semua.filter((t) => t.status === "OVERTIME"),
  };
};

/** Performa per mobil untuk grafik batang di dashboard. */
export const performaMobil = (peran: PeranAdmin) => {
  const semua = daftarTransaksi(peran).filter((t) => t.status !== "CANCELLED");
  return daftarMobil(peran)
    .map((c) => {
      const miliknya = semua.filter((t) => t.carSlug === c.slug);
      return {
        slug: c.slug,
        nama: c.nama,
        jumlahTransaksi: miliknya.length,
        totalHari: miliknya.reduce((n, t) => n + t.durationDays, 0),
        pendapatan: miliknya.reduce((n, t) => n + t.totalTagihan, 0),
        laba: peran === "SUPER_ADMIN" ? miliknya.reduce((n, t) => n + (t.modal?.profit ?? 0), 0) : null,
      };
    })
    .sort((a, b) => b.pendapatan - a.pendapatan);
};

/* --------------------------------------------------------------- pembantu */

export const daftarAdmin = adminRecords.filter((a) => a.aktif);

export const durasiDari = (mulai: string, selesai: string) => Math.max(1, selisihHari(mulai, selesai));

export const rentangBulanIni = { mulai: awalBulan, selesai: HARI_INI };

export { DENDA_PER_JAM, HARGA_SOPIR_PER_HARI } from "./constants";
export { dalamRentang };
