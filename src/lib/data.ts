/**
 * Proyeksi PUBLIK dari dataset internal.
 *
 * Halaman landing page hanya boleh mengambil data dari file ini. Fungsi
 * `keCarPublik()` memilih field satu per satu, jadi `costPricePerDay` dan data
 * pribadi customer tidak punya jalan untuk ikut terbawa ke sisi publik.
 */

import { ADMIN_WA, HARGA_SOPIR_PER_HARI } from "./constants";
import { carRecords, transactionRecords, unsplash, type CarRecord, type Kategori } from "./db";

export { FALLBACK_IMAGE, KATEGORI, unsplash } from "./db";
export type { Kategori } from "./db";

/* -------------------------------------------------------------------- situs */

export const site = {
  nama: "RentCar",
  tagline: "Sewa mobil di Bandung, harga jelas di awal",
  deskripsi:
    "Armada terawat, harga transparan, dan proses cepat lewat WhatsApp. Antar-jemput unit di area Bandung dan sekitarnya.",
  telepon: ADMIN_WA.display,
  teleponTel: ADMIN_WA.tel,
  email: "halo@rentcar.id",
  alamat: "Jl. Cihampelas No. 88, Bandung 40131, Jawa Barat",
  jamOperasional: "Setiap hari, 07.00 – 21.00 WIB",
  nav: [
    { label: "Beranda", href: "/" },
    { label: "Armada Mobil", href: "/vehicles" },
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak", href: "/contact" },
  ],
};

/* --------------------------------------------------------------------- tipe */

/** Bentuk mobil yang aman ditampilkan ke publik — tanpa harga modal. */
export interface Car {
  slug: string;
  nama: string;
  merek: string;
  tahun: number;
  kategori: Kategori;
  deskripsi: string;
  foto: string;
  galeri: string[];
  spesifikasi: CarRecord["spesifikasi"];
  fasilitas: string[];
  /** Harga jual per hari. Ini satu-satunya harga yang publik. */
  hargaPerHari: number;
  totalUnit: number;
  unitTersedia: number;
}

export const FILTER_KATEGORI = ["Semua", "MPV", "SUV", "Hatchback", "Minibus"] as const;
export type FilterKategori = (typeof FILTER_KATEGORI)[number];

/* ---------------------------------------------------------------- proyeksi */

/** Status tersimpan yang menahan satu unit. DONE & CANCELLED melepas unit. */
const MENAHAN_UNIT = ["BOOKING", "ON_TRIP", "EXTENDED"];

const unitTerpakai = (slug: string) =>
  transactionRecords.filter((t) => t.carSlug === slug && MENAHAN_UNIT.includes(t.status)).length;

const keCarPublik = (c: CarRecord): Car => ({
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
  hargaPerHari: c.sellPricePerDay,
  totalUnit: c.totalUnit,
  unitTersedia: Math.max(0, c.totalUnit - unitTerpakai(c.slug)),
});

/** Seluruh mobil yang ditayangkan di landing page. */
export const cars: Car[] = carRecords.filter((c) => c.isPublished).map(keCarPublik);

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);

/** Empat mobil yang ditonjolkan di beranda. */
export const mobilPopuler = [
  "toyota-avanza",
  "mitsubishi-xpander",
  "toyota-innova-reborn",
  "honda-brio",
]
  .map((slug) => getCar(slug))
  .filter((c): c is Car => Boolean(c));

/** Harga termurah di armada — untuk teks "mulai dari". */
export const hargaTermurah = Math.min(...cars.map((c) => c.hargaPerHari));

/** Tambahan biaya kalau customer minta sopir. Publik — ini harga jual. */
export const hargaSopirPerHari = HARGA_SOPIR_PER_HARI;

/* ------------------------------------------------------------------ konten */

export const avatars = {
  wanita1: unsplash("1494790108377-be9c29b29330", 200),
  pria1: unsplash("1507003211169-0a1dd7228f2d", 200),
  wanita2: unsplash("1438761681033-6461ffad8d80", 200),
};

export const statistik = [
  { nilai: `${cars.reduce((n, c) => n + c.totalUnit, 0)}+`, label: "Unit siap jalan" },
  { nilai: "1.200+", label: "Penyewa puas" },
  { nilai: "8", label: "Tahun beroperasi" },
  { nilai: "24 jam", label: "Layanan WhatsApp" },
];

export const keunggulan = [
  {
    judul: "Harga jelas di awal",
    isi: "Harga sewa per hari sudah termasuk asuransi. Tidak ada biaya tersembunyi saat serah terima unit.",
  },
  {
    judul: "Armada terawat",
    isi: "Servis rutin tiap 5.000 km, ban dicek sebelum setiap keberangkatan, dan unit selalu dibersihkan.",
  },
  {
    judul: "Proses cepat lewat WhatsApp",
    isi: "Tanya unit, cek ketersediaan, dan atur jadwal langsung lewat chat. Tidak perlu isi formulir panjang.",
  },
];

export const ulasan = [
  {
    kutipan:
      "Prosesnya cepat sekali. Chat WhatsApp sore, besok paginya mobil sudah diantar ke rumah dalam keadaan bersih dan full tank.",
    nama: "Andi S.",
    kota: "Bandung",
    avatar: avatars.pria1,
  },
  {
    kutipan:
      "Harga yang disebut di awal sama persis dengan yang dibayar. Tidak ada biaya tambahan aneh-aneh saat pengembalian.",
    nama: "Rina M.",
    kota: "Cimahi",
    avatar: avatars.wanita1,
  },
  {
    kutipan:
      "Sewa Hiace untuk rombongan kantor, unitnya bagus dan ACnya dingin sampai baris belakang. Sudah tiga kali sewa di sini.",
    nama: "Maya P.",
    kota: "Bandung",
    avatar: avatars.wanita2,
  },
];

export const fotoHero = unsplash("1555215695-3004980ad54e", 1400);
export const fotoTentang = unsplash("1502877338535-766e1452684a", 1800);
export const fotoCerita = unsplash("1492144534655-ae79c964c9d7", 1200);
