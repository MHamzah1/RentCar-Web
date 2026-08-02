/**
 * Konstanta dan helper format yang dipakai di sisi publik maupun admin.
 *
 * Semua helper format sengaja ditulis manual (tanpa `toLocaleString`) supaya
 * hasil di server dan di browser persis sama — kalau beda, React akan protes
 * hydration mismatch.
 */

/* ------------------------------------------------------------------ kontak */

/** Nomor WhatsApp admin — SATU sumber, jangan di-hardcode di komponen lain. */
export const ADMIN_WA = {
  /** Format tampilan */
  display: "0815-7486-5632",
  /** Format untuk tautan tel: */
  tel: "081574865632",
  /** Format internasional untuk wa.me (tanpa + dan tanpa 0 di depan) */
  intl: "6281574865632",
} as const;

/** Bangun tautan WhatsApp dengan pesan yang sudah terisi. */
export const waLink = (pesan: string) =>
  `https://wa.me/${ADMIN_WA.intl}?text=${encodeURIComponent(pesan)}`;

/* -------------------------------------------------------------------- uang */

/**
 * Format Rupiah. Uang disimpan sebagai integer (350000), format hanya di
 * lapisan tampilan.
 */
export const rupiah = (nilai: number) =>
  `Rp ${Math.round(nilai)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

/** Versi ringkas untuk kartu statistik: Rp 1,2 jt / Rp 950 rb */
export const rupiahRingkas = (nilai: number) => {
  if (nilai >= 1_000_000) {
    const juta = nilai / 1_000_000;
    const teks = juta >= 10 ? Math.round(juta).toString() : juta.toFixed(1).replace(".", ",");
    return `Rp ${teks} jt`;
  }
  if (nilai >= 1_000) return `Rp ${Math.round(nilai / 1_000)} rb`;
  return rupiah(nilai);
};

/* ------------------------------------------------------------------ tanggal */

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const pecah = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};

/** "2026-08-02" → "2 Agustus 2026" */
export const tanggalPanjang = (iso: string) => {
  const { y, m, d } = pecah(iso);
  return `${d} ${BULAN[m - 1]} ${y}`;
};

/** "2026-08-02" → "2 Agu 2026" */
export const tanggalSingkat = (iso: string) => {
  const { y, m, d } = pecah(iso);
  return `${d} ${BULAN_SINGKAT[m - 1]} ${y}`;
};

/** "2026-08-02" → "Minggu" */
export const namaHari = (iso: string) => {
  const { y, m, d } = pecah(iso);
  return HARI[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
};

/** "2026-08" → "Agustus 2026" */
export const namaBulan = (tahunBulan: string) => {
  const [y, m] = tahunBulan.split("-").map(Number);
  return `${BULAN[m - 1]} ${y}`;
};

/** Tambah sejumlah hari ke tanggal ISO, hasilnya tetap "YYYY-MM-DD". */
export const tambahHari = (iso: string, jumlah: number) => {
  const { y, m, d } = pecah(iso);
  const t = new Date(Date.UTC(y, m - 1, d + jumlah));
  return t.toISOString().slice(0, 10);
};

/** Selisih hari antara dua tanggal ISO (b − a). */
export const selisihHari = (a: string, b: string) => {
  const pa = pecah(a);
  const pb = pecah(b);
  const ms = Date.UTC(pb.y, pb.m - 1, pb.d) - Date.UTC(pa.y, pa.m - 1, pa.d);
  return Math.round(ms / 86_400_000);
};

/** Apakah `iso` berada dalam rentang [mulai, selesai] (inklusif). */
export const dalamRentang = (iso: string, mulai: string, selesai: string) =>
  iso >= mulai && iso <= selesai;

/**
 * "Sekarang" versi aplikasi. Data dummy dibuat di sekitar waktu ini supaya
 * dashboard selalu terlihat hidup dan hasilnya sama di server maupun browser.
 * Nanti diganti waktu asli begitu ada database.
 */
export const HARI_INI = "2026-08-02";
export const JAM_SEKARANG = 14; // 14.00 WIB

/** Jam ke-N sejak epoch, dipakai untuk hitung selisih jam yang deterministik. */
export const keJam = (isoTanggal: string, jam: number) => {
  const { y, m, d } = pecah(isoTanggal);
  return Date.UTC(y, m - 1, d, jam) / 3_600_000;
};

export const SEKARANG_JAM = keJam(HARI_INI, JAM_SEKARANG);

/** "08.00" → 8 */
export const jamDariTeks = (teks: string) => Number(teks.split(".")[0]);

/* ------------------------------------------------------------ tarif tetap */

/** Denda keterlambatan pengembalian, per jam. */
export const DENDA_PER_JAM = 50_000;

/** Tambahan biaya sewa dengan sopir, per hari — flat untuk semua mobil. */
export const HARGA_SOPIR_PER_HARI = 500_000;

/**
 * Upah yang dibayarkan ke sopir, per hari (modal).
 *
 * ANGKA SEMENTARA — masih menunggu konfirmasi, lihat pertanyaan terbuka no. 2
 * di `docs/06-keputusan-teknis.md`.
 */
export const UPAH_SOPIR_PER_HARI = 350_000;
