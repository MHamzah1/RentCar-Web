/**
 * RentCar — dataset dummy (pengganti database sementara).
 *
 * PENTING: modul ini berisi data INTERNAL — harga modal, NIK, dokumen, dan
 * kontak darurat customer. **Jangan diimpor dari halaman publik.**
 * Halaman publik memakai proyeksi aman di `src/lib/data.ts`.
 *
 * Semua NIK, alamat, dan nomor telepon di sini adalah karangan untuk demo.
 */

/* ------------------------------------------------------------------ gambar */

export const unsplash = (id: string, w = 1200, q = 70) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/** Foto cadangan kalau foto utama gagal dimuat (dipakai <CarImage />). */
export const FALLBACK_IMAGE = unsplash("1492144534655-ae79c964c9d7");

const FOTO_JALAN = [
  unsplash("1492144534655-ae79c964c9d7"),
  unsplash("1502877338535-766e1452684a"),
  unsplash("1533473359331-0135ef1b58bf"),
];

/* -------------------------------------------------------------------- tipe */

export const KATEGORI = ["MPV", "SUV", "Hatchback", "Minibus"] as const;
export type Kategori = (typeof KATEGORI)[number];

export interface CarRecord {
  slug: string;
  nama: string;
  merek: string;
  tahun: number;
  kategori: Kategori;
  deskripsi: string;
  foto: string;
  galeri: string[];
  spesifikasi: {
    transmisi: "Manual" | "Automatic";
    bahanBakar: "Bensin" | "Diesel" | "Hybrid";
    kursi: number;
    pintu: number;
    ac: boolean;
    bagasi: string;
  };
  fasilitas: string[];
  /** Harga ke customer — satu-satunya harga yang boleh tampil di publik. */
  sellPricePerDay: number;
  /** Biaya sewa unit dari pemilik — INTERNAL, Super Admin saja. */
  costPricePerDay: number;
  /** Jumlah unit yang dimiliki. Unit tidak dibedakan per plat. */
  totalUnit: number;
  /** Tampil di landing page atau tidak. */
  isPublished: boolean;
}

export type StatusRumah = "Milik sendiri" | "Sewa" | "Kos";

export interface JaminanRecord {
  id: string;
  customerId: string;
  kendaraan: string;
  plat: string;
  atasNama: string;
  aktif: boolean;
}

export interface DokumenRecord {
  id: string;
  customerId: string;
  jenis: "KTP" | "KK" | "SIM" | "NPWP" | "Lainnya";
  namaFile: string;
  diunggahPada: string;
  /** Simulasi: di produksi ini signed URL dari storage privat, bukan /public. */
  sumber: "Scan KTP" | "Unggah manual";
}

export interface CustomerRecord {
  id: string;
  /* identitas KTP */
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  alamat: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaanKtp: string;
  kewarganegaraan: string;
  /* kontak & tambahan */
  noHpWa: string;
  email: string;
  instagram: string;
  tiktok: string;
  daruratNama: string;
  daruratHubungan: string;
  daruratNoHp: string;
  statusRumah: StatusRumah;
  pekerjaanDetail: string;
  /* lokasi */
  linkMaps: string;
  fotoRumah: string | null;
  /* meta */
  diinputLewatScanKtp: boolean;
  catatan: string;
  terdaftarPada: string;
}

/**
 * Status yang **disimpan**. `OVERTIME` sengaja tidak ada di sini karena
 * dihitung saat data dibaca — lihat `statusTampil()` di `src/lib/admin.ts`.
 */
export type StatusTersimpan = "BOOKING" | "ON_TRIP" | "EXTENDED" | "DONE" | "CANCELLED";

export interface TransactionRecord {
  kode: string;
  carSlug: string;
  customerId: string;
  jaminanId: string;
  /** Tanggal mulai sewa (YYYY-MM-DD). */
  startDate: string;
  /** Durasi hari — sudah termasuk perpanjangan. endDate dihitung, tidak disimpan. */
  durationDays: number;
  /** Jam berangkat, sekaligus patokan jam pengembalian. */
  jamBerangkat: string;
  /** Snapshot harga saat booking — bukan join ke katalog yang berlaku sekarang. */
  sellPricePerDay: number;
  costPricePerDay: number;
  /** Lepas kunci (false) atau dengan sopir (true). */
  pakaiSopir: boolean;
  hargaSopirPerHari: number;
  upahSopirPerHari: number;
  /** Video kondisi awal unit — WAJIB terisi sebelum status jadi ON_TRIP. */
  videoSerahTerima: string | null;
  videoDiunggahPada: string | null;
  /** Total hari tambahan dari perpanjangan (sudah ikut di durationDays). */
  hariTambahan: number;
  /** Denda yang dikunci saat transaksi ditutup. Selama jalan, denda dihitung live. */
  dendaTercatat: number;
  status: StatusTersimpan;
  dibatalkanPada: string | null;
  alasanBatal: string;
  catatan: string;
  dibuatOlehAdminId: string;
  dibuatPada: string;
}

export interface PaymentRecord {
  id: string;
  kodeTransaksi: string;
  jenis: "DP" | "Pelunasan" | "Denda";
  jumlah: number;
  metode: "Tunai" | "Transfer";
  dibayarPada: string;
  dicatatOlehAdminId: string;
}

export interface PosisiRecord {
  kodeTransaksi: string;
  lat: number;
  lng: number;
  kecepatan: number;
  arah: string;
  lokasiPerkiraan: string;
  terakhirUpdate: string;
}

export type PeranAdmin = "SUPER_ADMIN" | "ADMIN";

export interface AdminRecord {
  id: string;
  nama: string;
  email: string;
  peran: PeranAdmin;
  aktif: boolean;
}

/* ------------------------------------------------------------------ katalog */

const fasilitasStandar = [
  "AC dingin",
  "Audio Bluetooth",
  "Kamera mundur",
  "USB fast charging",
  "Ban baru & servis rutin",
  "Asuransi All Risk",
];

export const carRecords: CarRecord[] = [
  {
    slug: "toyota-avanza",
    nama: "Toyota Avanza 1.5 G",
    merek: "Toyota",
    tahun: 2023,
    kategori: "MPV",
    deskripsi:
      "MPV keluarga paling populer di Indonesia. Irit, kabin lega untuk 7 orang, dan nyaman dipakai dalam kota maupun luar kota.",
    foto: unsplash("1542362567-b07e54358753"),
    galeri: [unsplash("1542362567-b07e54358753"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 7, pintu: 5, ac: true, bagasi: "2 koper" },
    fasilitas: fasilitasStandar,
    sellPricePerDay: 350_000,
    costPricePerDay: 240_000,
    totalUnit: 4,
    isPublished: true,
  },
  {
    slug: "mitsubishi-xpander",
    nama: "Mitsubishi Xpander Ultimate",
    merek: "Mitsubishi",
    tahun: 2023,
    kategori: "MPV",
    deskripsi:
      "Ground clearance tinggi, suspensi empuk, kabin senyap. Pilihan favorit untuk perjalanan keluarga jarak jauh.",
    foto: unsplash("1580273916550-e323be2ae537"),
    galeri: [unsplash("1580273916550-e323be2ae537"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 7, pintu: 5, ac: true, bagasi: "3 koper" },
    fasilitas: fasilitasStandar,
    sellPricePerDay: 450_000,
    costPricePerDay: 310_000,
    totalUnit: 3,
    isPublished: true,
  },
  {
    slug: "toyota-innova-reborn",
    nama: "Toyota Innova Reborn 2.4 V",
    merek: "Toyota",
    tahun: 2022,
    kategori: "MPV",
    deskripsi:
      "Diesel bertenaga dengan kabin premium. Andalan untuk perjalanan dinas dan antar kota dengan bagasi banyak.",
    foto: unsplash("1617788138017-80ad40651399"),
    galeri: [unsplash("1617788138017-80ad40651399"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Diesel", kursi: 7, pintu: 5, ac: true, bagasi: "3 koper" },
    fasilitas: [...fasilitasStandar, "Captain seat baris kedua"],
    sellPricePerDay: 550_000,
    costPricePerDay: 380_000,
    totalUnit: 3,
    isPublished: true,
  },
  {
    slug: "toyota-innova-zenix",
    nama: "Toyota Innova Zenix Hybrid",
    merek: "Toyota",
    tahun: 2024,
    kategori: "MPV",
    deskripsi:
      "Generasi terbaru Innova dengan mesin hybrid — jauh lebih irit, halus, dan senyap. Interior paling mewah di kelasnya.",
    foto: unsplash("1560958089-b8a1929cea89"),
    galeri: [unsplash("1560958089-b8a1929cea89"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Hybrid", kursi: 7, pintu: 5, ac: true, bagasi: "3 koper" },
    fasilitas: [...fasilitasStandar, "Panoramic roof", "Captain seat elektrik"],
    sellPricePerDay: 750_000,
    costPricePerDay: 520_000,
    totalUnit: 2,
    isPublished: true,
  },
  {
    slug: "honda-brio",
    nama: "Honda Brio RS",
    merek: "Honda",
    tahun: 2023,
    kategori: "Hatchback",
    deskripsi:
      "Mungil, lincah, dan paling irit. Cocok untuk keliling kota, cari parkir gampang, dan pemakaian harian.",
    foto: unsplash("1549317661-bd32c8ce0db2"),
    galeri: [unsplash("1549317661-bd32c8ce0db2"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 5, pintu: 5, ac: true, bagasi: "1 koper" },
    fasilitas: fasilitasStandar,
    sellPricePerDay: 275_000,
    costPricePerDay: 185_000,
    totalUnit: 4,
    isPublished: true,
  },
  {
    slug: "toyota-agya",
    nama: "Toyota Agya GR Sport",
    merek: "Toyota",
    tahun: 2023,
    kategori: "Hatchback",
    deskripsi: "City car paling ekonomis di armada kami. Konsumsi BBM paling hemat untuk pemakaian dalam kota.",
    foto: unsplash("1494976388531-d1058494cdd8"),
    galeri: [unsplash("1494976388531-d1058494cdd8"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 5, pintu: 5, ac: true, bagasi: "1 koper" },
    fasilitas: fasilitasStandar,
    sellPricePerDay: 250_000,
    costPricePerDay: 170_000,
    totalUnit: 3,
    isPublished: true,
  },
  {
    slug: "suzuki-ertiga",
    nama: "Suzuki Ertiga Hybrid",
    merek: "Suzuki",
    tahun: 2023,
    kategori: "MPV",
    deskripsi: "MPV 7 kursi dengan konsumsi BBM paling irit di kelasnya. Ringan dikendarai, murah di ongkos jalan.",
    foto: unsplash("1552519507-da3b142c6e3d"),
    galeri: [unsplash("1552519507-da3b142c6e3d"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Hybrid", kursi: 7, pintu: 5, ac: true, bagasi: "2 koper" },
    fasilitas: fasilitasStandar,
    sellPricePerDay: 400_000,
    costPricePerDay: 270_000,
    totalUnit: 2,
    isPublished: true,
  },
  {
    slug: "toyota-rush",
    nama: "Toyota Rush TRD Sportivo",
    merek: "Toyota",
    tahun: 2022,
    kategori: "SUV",
    deskripsi: "SUV 7 kursi bertubuh tinggi. Nyaman untuk jalan menanjak dan jalur wisata yang tidak selalu mulus.",
    foto: unsplash("1568605117036-5fe5e7bab0b7"),
    galeri: [unsplash("1568605117036-5fe5e7bab0b7"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 7, pintu: 5, ac: true, bagasi: "2 koper" },
    fasilitas: fasilitasStandar,
    sellPricePerDay: 450_000,
    costPricePerDay: 310_000,
    totalUnit: 2,
    isPublished: true,
  },
  {
    slug: "honda-hrv",
    nama: "Honda HR-V 1.5 Turbo RS",
    merek: "Honda",
    tahun: 2023,
    kategori: "SUV",
    deskripsi: "SUV modern dengan mesin turbo responsif dan interior yang rapi. Pas untuk perjalanan bisnis.",
    foto: unsplash("1544636331-e26879cd4d9b"),
    galeri: [unsplash("1544636331-e26879cd4d9b"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 5, pintu: 5, ac: true, bagasi: "2 koper" },
    fasilitas: [...fasilitasStandar, "Cruise control"],
    sellPricePerDay: 600_000,
    costPricePerDay: 420_000,
    totalUnit: 2,
    isPublished: true,
  },
  {
    slug: "toyota-fortuner",
    nama: "Toyota Fortuner 2.4 VRZ",
    merek: "Toyota",
    tahun: 2023,
    kategori: "SUV",
    deskripsi: "SUV besar bermesin diesel. Pilihan untuk rombongan, perjalanan jauh, dan medan yang berat.",
    foto: unsplash("1555215695-3004980ad54e"),
    galeri: [unsplash("1555215695-3004980ad54e"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Diesel", kursi: 7, pintu: 5, ac: true, bagasi: "4 koper" },
    fasilitas: [...fasilitasStandar, "Cruise control", "Power back door"],
    sellPricePerDay: 950_000,
    costPricePerDay: 680_000,
    totalUnit: 1,
    isPublished: true,
  },
  {
    slug: "toyota-hiace",
    nama: "Toyota Hiace Premio",
    merek: "Toyota",
    tahun: 2022,
    kategori: "Minibus",
    deskripsi: "Minibus 15 kursi untuk rombongan besar, study tour, atau acara kantor. Bagasi sangat lapang.",
    foto: unsplash("1503376780353-7e6692767b70"),
    galeri: [unsplash("1503376780353-7e6692767b70"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Manual", bahanBakar: "Diesel", kursi: 15, pintu: 4, ac: true, bagasi: "8 koper" },
    fasilitas: ["AC double blower", "Audio Bluetooth", "Kursi reclining", "Asuransi All Risk", "Servis rutin"],
    sellPricePerDay: 1_100_000,
    costPricePerDay: 800_000,
    totalUnit: 1,
    isPublished: true,
  },
  {
    slug: "toyota-alphard",
    nama: "Toyota Alphard 2.5 X",
    merek: "Toyota",
    tahun: 2023,
    kategori: "Minibus",
    deskripsi:
      "Unit paling premium di armada. Kursi kapten elektrik, kabin sangat senyap. Biasa dipakai untuk tamu VIP dan acara pernikahan.",
    foto: unsplash("1533473359331-0135ef1b58bf"),
    galeri: [unsplash("1533473359331-0135ef1b58bf"), ...FOTO_JALAN],
    spesifikasi: { transmisi: "Automatic", bahanBakar: "Bensin", kursi: 7, pintu: 5, ac: true, bagasi: "4 koper" },
    fasilitas: [...fasilitasStandar, "Captain seat elektrik", "Sunroof", "Pintu geser elektrik"],
    sellPricePerDay: 2_500_000,
    costPricePerDay: 1_850_000,
    totalUnit: 1,
    isPublished: true,
  },
];

/* ---------------------------------------------------------------- customer */

export const customerRecords: CustomerRecord[] = [
  {
    id: "CUST-001",
    nik: "3273010101900001",
    namaLengkap: "Andi Setiawan",
    tempatLahir: "Bandung",
    tanggalLahir: "1990-01-01",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Cihampelas No. 112",
    rtRw: "004/007",
    kelurahan: "Cipaganti",
    kecamatan: "Coblong",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    pekerjaanKtp: "Wiraswasta",
    kewarganegaraan: "WNI",
    noHpWa: "0812-1122-3344",
    email: "andi.setiawan@example.com",
    instagram: "@andisetiawan",
    tiktok: "@andisetiawan",
    daruratNama: "Rina Setiawan",
    daruratHubungan: "Istri",
    daruratNoHp: "0812-1122-9900",
    statusRumah: "Milik sendiri",
    pekerjaanDetail: "Pemilik toko bangunan di Jl. Cihampelas",
    linkMaps: "https://maps.google.com/?q=-6.8951,107.6067",
    fotoRumah: "rumah-andi-setiawan.jpg",
    diinputLewatScanKtp: true,
    catatan: "Langganan sejak 2024.",
    terdaftarPada: "2024-11-12",
  },
  {
    id: "CUST-002",
    nik: "3273024502920002",
    namaLengkap: "Rina Marlina",
    tempatLahir: "Cimahi",
    tanggalLahir: "1992-02-05",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Sukajadi No. 45",
    rtRw: "002/003",
    kelurahan: "Sukawarna",
    kecamatan: "Sukajadi",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    pekerjaanKtp: "Karyawan Swasta",
    kewarganegaraan: "WNI",
    noHpWa: "0813-5566-7788",
    email: "rina.marlina@example.com",
    instagram: "@rinamarlina",
    tiktok: "-",
    daruratNama: "Bambang Marlina",
    daruratHubungan: "Ayah",
    daruratNoHp: "0813-5566-1122",
    statusRumah: "Kos",
    pekerjaanDetail: "Staf marketing di perusahaan tekstil Bandung",
    linkMaps: "https://maps.google.com/?q=-6.8896,107.5931",
    fotoRumah: "rumah-rina-marlina.jpg",
    diinputLewatScanKtp: true,
    catatan: "",
    terdaftarPada: "2025-03-04",
  },
  {
    id: "CUST-003",
    nik: "3273031203880003",
    namaLengkap: "Budi Santoso",
    tempatLahir: "Garut",
    tanggalLahir: "1988-03-12",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Buah Batu No. 210",
    rtRw: "005/011",
    kelurahan: "Turangga",
    kecamatan: "Lengkong",
    agama: "Kristen",
    statusPerkawinan: "Kawin",
    pekerjaanKtp: "Pegawai Negeri Sipil",
    kewarganegaraan: "WNI",
    noHpWa: "0857-2233-4455",
    email: "budi.santoso@example.com",
    instagram: "-",
    tiktok: "-",
    daruratNama: "Sari Santoso",
    daruratHubungan: "Istri",
    daruratNoHp: "0857-2233-9911",
    statusRumah: "Milik sendiri",
    pekerjaanDetail: "PNS Dinas Perhubungan Kota Bandung",
    linkMaps: "https://maps.google.com/?q=-6.9389,107.6289",
    fotoRumah: "rumah-budi-santoso.jpg",
    diinputLewatScanKtp: false,
    catatan: "Input manual — foto KTP kurang jelas saat discan.",
    terdaftarPada: "2025-06-21",
  },
  {
    id: "CUST-004",
    nik: "3273045508950004",
    namaLengkap: "Dewi Anggraini",
    tempatLahir: "Bandung",
    tanggalLahir: "1995-08-15",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Dipatiukur No. 78",
    rtRw: "001/009",
    kelurahan: "Lebakgede",
    kecamatan: "Coblong",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    pekerjaanKtp: "Pelajar/Mahasiswa",
    kewarganegaraan: "WNI",
    noHpWa: "0878-9900-1122",
    email: "dewi.anggraini@example.com",
    instagram: "@dewianggr",
    tiktok: "@dewianggr",
    daruratNama: "Hendra Anggara",
    daruratHubungan: "Kakak",
    daruratNoHp: "0878-9900-3344",
    statusRumah: "Kos",
    pekerjaanDetail: "Mahasiswa S2 Unpad",
    linkMaps: "https://maps.google.com/?q=-6.8915,107.6135",
    fotoRumah: "rumah-dewi-anggraini.jpg",
    diinputLewatScanKtp: true,
    catatan: "Wajib konfirmasi ke nomor darurat sebelum serah terima.",
    terdaftarPada: "2025-09-30",
  },
  {
    id: "CUST-005",
    nik: "3273052507870005",
    namaLengkap: "Hendra Gunawan",
    tempatLahir: "Sumedang",
    tanggalLahir: "1987-07-25",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Soekarno Hatta No. 512",
    rtRw: "008/002",
    kelurahan: "Cijawura",
    kecamatan: "Buahbatu",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    pekerjaanKtp: "Wiraswasta",
    kewarganegaraan: "WNI",
    noHpWa: "0821-3344-5566",
    email: "hendra.gunawan@example.com",
    instagram: "@hendragun",
    tiktok: "-",
    daruratNama: "Lilis Gunawan",
    daruratHubungan: "Istri",
    daruratNoHp: "0821-3344-7788",
    statusRumah: "Milik sendiri",
    pekerjaanDetail: "Kontraktor interior",
    linkMaps: "https://maps.google.com/?q=-6.9475,107.6531",
    fotoRumah: "rumah-hendra-gunawan.jpg",
    diinputLewatScanKtp: true,
    catatan: "Langganan rombongan — biasa sewa Hiace untuk proyek luar kota.",
    terdaftarPada: "2025-01-18",
  },
  {
    id: "CUST-006",
    nik: "3273066001930006",
    namaLengkap: "Maya Puspita",
    tempatLahir: "Tasikmalaya",
    tanggalLahir: "1993-01-20",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Setiabudi No. 190",
    rtRw: "003/006",
    kelurahan: "Gegerkalong",
    kecamatan: "Sukasari",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    pekerjaanKtp: "Karyawan Swasta",
    kewarganegaraan: "WNI",
    noHpWa: "0896-1234-5678",
    email: "maya.puspita@example.com",
    instagram: "@mayapuspita",
    tiktok: "@mayapuspita",
    daruratNama: "Rizal Puspita",
    daruratHubungan: "Suami",
    daruratNoHp: "0896-1234-9999",
    statusRumah: "Sewa",
    pekerjaanDetail: "Manager HR di startup Bandung",
    linkMaps: "https://maps.google.com/?q=-6.8641,107.5921",
    fotoRumah: null,
    diinputLewatScanKtp: true,
    catatan: "Foto depan rumah belum diambil — minta saat serah terima berikutnya.",
    terdaftarPada: "2026-02-11",
  },
  {
    id: "CUST-007",
    nik: "3273070409960007",
    namaLengkap: "Rizky Ramadhan",
    tempatLahir: "Bekasi",
    tanggalLahir: "1996-09-04",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Pasteur No. 33",
    rtRw: "006/004",
    kelurahan: "Pasteur",
    kecamatan: "Sukajadi",
    agama: "Islam",
    statusPerkawinan: "Belum Kawin",
    pekerjaanKtp: "Karyawan Swasta",
    kewarganegaraan: "WNI",
    noHpWa: "0838-7788-9900",
    email: "rizky.ramadhan@example.com",
    instagram: "@rizkyrmdhn",
    tiktok: "@rizkyrmdhn",
    daruratNama: "Yuli Ramadhan",
    daruratHubungan: "Ibu",
    daruratNoHp: "0838-7788-1234",
    statusRumah: "Kos",
    pekerjaanDetail: "Software engineer, kerja remote",
    linkMaps: "https://maps.google.com/?q=-6.8975,107.5758",
    fotoRumah: "rumah-rizky-ramadhan.jpg",
    diinputLewatScanKtp: true,
    catatan: "",
    terdaftarPada: "2026-05-08",
  },
  {
    id: "CUST-008",
    nik: "3273081711910008",
    namaLengkap: "Fajar Nugraha",
    tempatLahir: "Cirebon",
    tanggalLahir: "1991-11-17",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Riau No. 88",
    rtRw: "007/005",
    kelurahan: "Citarum",
    kecamatan: "Bandung Wetan",
    agama: "Islam",
    statusPerkawinan: "Kawin",
    pekerjaanKtp: "Wiraswasta",
    kewarganegaraan: "WNI",
    noHpWa: "0819-4455-6677",
    email: "fajar.nugraha@example.com",
    instagram: "@fajarnugraha",
    tiktok: "-",
    daruratNama: "Nia Nugraha",
    daruratHubungan: "Istri",
    daruratNoHp: "0819-4455-1010",
    statusRumah: "Milik sendiri",
    pekerjaanDetail: "Pemilik kafe di Jl. Riau",
    linkMaps: "https://maps.google.com/?q=-6.9034,107.6186",
    fotoRumah: "rumah-fajar-nugraha.jpg",
    diinputLewatScanKtp: false,
    catatan: "Input manual atas permintaan customer.",
    terdaftarPada: "2026-07-02",
  },
];

/* ----------------------------------------------------------------- jaminan */

export const jaminanRecords: JaminanRecord[] = [
  { id: "JMN-001", customerId: "CUST-001", kendaraan: "Honda Vario 160", plat: "D 4521 XY", atasNama: "Andi Setiawan", aktif: true },
  { id: "JMN-002", customerId: "CUST-002", kendaraan: "Yamaha NMAX 155", plat: "D 6712 AB", atasNama: "Bambang Marlina", aktif: true },
  { id: "JMN-003", customerId: "CUST-003", kendaraan: "Honda PCX 160", plat: "D 3390 CD", atasNama: "Budi Santoso", aktif: true },
  { id: "JMN-004", customerId: "CUST-004", kendaraan: "Honda Beat Street", plat: "D 2218 EF", atasNama: "Hendra Anggara", aktif: true },
  { id: "JMN-005", customerId: "CUST-005", kendaraan: "Yamaha Aerox 155", plat: "D 5543 GH", atasNama: "Hendra Gunawan", aktif: true },
  { id: "JMN-006", customerId: "CUST-005", kendaraan: "Honda Scoopy", plat: "D 5544 GH", atasNama: "Lilis Gunawan", aktif: true },
  { id: "JMN-007", customerId: "CUST-006", kendaraan: "Honda Vario 125", plat: "D 8890 IJ", atasNama: "Maya Puspita", aktif: true },
  { id: "JMN-008", customerId: "CUST-007", kendaraan: "Yamaha Fazzio", plat: "D 1177 KL", atasNama: "Rizky Ramadhan", aktif: true },
  { id: "JMN-009", customerId: "CUST-008", kendaraan: "Honda ADV 160", plat: "D 9012 MN", atasNama: "Fajar Nugraha", aktif: true },
];

/* ---------------------------------------------------------------- dokumen */

export const dokumenRecords: DokumenRecord[] = [
  { id: "DOC-001", customerId: "CUST-001", jenis: "KTP", namaFile: "ktp-andi-setiawan.jpg", diunggahPada: "2024-11-12", sumber: "Scan KTP" },
  { id: "DOC-002", customerId: "CUST-001", jenis: "SIM", namaFile: "sim-a-andi-setiawan.jpg", diunggahPada: "2024-11-12", sumber: "Unggah manual" },
  { id: "DOC-003", customerId: "CUST-001", jenis: "KK", namaFile: "kk-andi-setiawan.pdf", diunggahPada: "2024-11-12", sumber: "Unggah manual" },
  { id: "DOC-004", customerId: "CUST-002", jenis: "KTP", namaFile: "ktp-rina-marlina.jpg", diunggahPada: "2025-03-04", sumber: "Scan KTP" },
  { id: "DOC-005", customerId: "CUST-002", jenis: "SIM", namaFile: "sim-a-rina-marlina.jpg", diunggahPada: "2025-03-04", sumber: "Unggah manual" },
  { id: "DOC-006", customerId: "CUST-003", jenis: "KTP", namaFile: "ktp-budi-santoso.jpg", diunggahPada: "2025-06-21", sumber: "Unggah manual" },
  { id: "DOC-007", customerId: "CUST-003", jenis: "NPWP", namaFile: "npwp-budi-santoso.pdf", diunggahPada: "2025-06-21", sumber: "Unggah manual" },
  { id: "DOC-008", customerId: "CUST-004", jenis: "KTP", namaFile: "ktp-dewi-anggraini.jpg", diunggahPada: "2025-09-30", sumber: "Scan KTP" },
  { id: "DOC-009", customerId: "CUST-004", jenis: "SIM", namaFile: "sim-a-dewi-anggraini.jpg", diunggahPada: "2025-09-30", sumber: "Unggah manual" },
  { id: "DOC-010", customerId: "CUST-005", jenis: "KTP", namaFile: "ktp-hendra-gunawan.jpg", diunggahPada: "2025-01-18", sumber: "Scan KTP" },
  { id: "DOC-011", customerId: "CUST-005", jenis: "KK", namaFile: "kk-hendra-gunawan.pdf", diunggahPada: "2025-01-18", sumber: "Unggah manual" },
  { id: "DOC-012", customerId: "CUST-006", jenis: "KTP", namaFile: "ktp-maya-puspita.jpg", diunggahPada: "2026-02-11", sumber: "Scan KTP" },
  { id: "DOC-013", customerId: "CUST-007", jenis: "KTP", namaFile: "ktp-rizky-ramadhan.jpg", diunggahPada: "2026-05-08", sumber: "Scan KTP" },
  { id: "DOC-014", customerId: "CUST-007", jenis: "SIM", namaFile: "sim-a-rizky-ramadhan.jpg", diunggahPada: "2026-05-08", sumber: "Unggah manual" },
  { id: "DOC-015", customerId: "CUST-008", jenis: "KTP", namaFile: "ktp-fajar-nugraha.jpg", diunggahPada: "2026-07-02", sumber: "Unggah manual" },
];

/* --------------------------------------------------------------- transaksi */

const SOPIR = { harga: 500_000, upah: 350_000 };

export const transactionRecords: TransactionRecord[] = [
  /* --- sedang jalan & sudah lewat batas kembali (jadi OVERTIME saat dibaca) --- */
  {
    kode: "TRX-20260729-001",
    carSlug: "toyota-avanza",
    customerId: "CUST-001",
    jaminanId: "JMN-001",
    startDate: "2026-07-29",
    durationDays: 3,
    jamBerangkat: "08.00",
    sellPricePerDay: 350_000,
    costPricePerDay: 240_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260729-001.mp4",
    videoDiunggahPada: "2026-07-29 07.45",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "ON_TRIP",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Sudah dihubungi lewat WhatsApp, customer bilang pulang nanti malam.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-07-27",
  },
  {
    kode: "TRX-20260801-002",
    carSlug: "mitsubishi-xpander",
    customerId: "CUST-005",
    jaminanId: "JMN-005",
    startDate: "2026-08-01",
    durationDays: 5,
    jamBerangkat: "06.30",
    sellPricePerDay: 450_000,
    costPricePerDay: 310_000,
    pakaiSopir: true,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260801-002.mp4",
    videoDiunggahPada: "2026-08-01 06.10",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "ON_TRIP",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Survey proyek ke Cirebon. Pakai sopir.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-07-30",
  },
  {
    kode: "TRX-20260801-003",
    carSlug: "honda-brio",
    customerId: "CUST-007",
    jaminanId: "JMN-008",
    startDate: "2026-08-01",
    durationDays: 3,
    jamBerangkat: "10.00",
    sellPricePerDay: 275_000,
    costPricePerDay: 185_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260801-003.mp4",
    videoDiunggahPada: "2026-08-01 09.50",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "ON_TRIP",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "",
    dibuatOlehAdminId: "ADM-003",
    dibuatPada: "2026-07-31",
  },
  /* --- sudah diperpanjang --- */
  {
    kode: "TRX-20260730-004",
    carSlug: "toyota-innova-reborn",
    customerId: "CUST-003",
    jaminanId: "JMN-003",
    startDate: "2026-07-30",
    durationDays: 6,
    jamBerangkat: "07.00",
    sellPricePerDay: 550_000,
    costPricePerDay: 380_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260730-004.mp4",
    videoDiunggahPada: "2026-07-30 06.40",
    hariTambahan: 2,
    dendaTercatat: 0,
    status: "EXTENDED",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Diperpanjang 2 hari, dinas di Semarang mundur.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-07-29",
  },
  /* --- booking, belum berangkat (video belum ada) --- */
  {
    kode: "TRX-20260802-005",
    carSlug: "toyota-innova-zenix",
    customerId: "CUST-006",
    jaminanId: "JMN-007",
    startDate: "2026-08-04",
    durationDays: 3,
    jamBerangkat: "09.00",
    sellPricePerDay: 750_000,
    costPricePerDay: 520_000,
    pakaiSopir: true,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: null,
    videoDiunggahPada: null,
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "BOOKING",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Jemput tamu kantor di Bandara Kertajati.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-08-02",
  },
  {
    kode: "TRX-20260802-006",
    carSlug: "toyota-alphard",
    customerId: "CUST-008",
    jaminanId: "JMN-009",
    startDate: "2026-08-08",
    durationDays: 2,
    jamBerangkat: "05.00",
    sellPricePerDay: 2_500_000,
    costPricePerDay: 1_850_000,
    pakaiSopir: true,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: null,
    videoDiunggahPada: null,
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "BOOKING",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Acara pernikahan. Minta unit dicuci sehari sebelumnya.",
    dibuatOlehAdminId: "ADM-001",
    dibuatPada: "2026-08-02",
  },
  {
    kode: "TRX-20260802-007",
    carSlug: "toyota-hiace",
    customerId: "CUST-005",
    jaminanId: "JMN-006",
    startDate: "2026-08-10",
    durationDays: 4,
    jamBerangkat: "05.30",
    sellPricePerDay: 1_100_000,
    costPricePerDay: 800_000,
    pakaiSopir: true,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: null,
    videoDiunggahPada: null,
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "BOOKING",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Rombongan 14 orang, tujuan Jogja.",
    dibuatOlehAdminId: "ADM-003",
    dibuatPada: "2026-08-02",
  },
  /* --- dibatalkan --- */
  {
    kode: "TRX-20260731-008",
    carSlug: "honda-hrv",
    customerId: "CUST-004",
    jaminanId: "JMN-004",
    startDate: "2026-08-06",
    durationDays: 2,
    jamBerangkat: "08.00",
    sellPricePerDay: 600_000,
    costPricePerDay: 420_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: null,
    videoDiunggahPada: null,
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "CANCELLED",
    dibatalkanPada: "2026-08-01",
    alasanBatal: "Jadwal keberangkatan customer berubah, belum sempat bayar DP.",
    catatan: "",
    dibuatOlehAdminId: "ADM-003",
    dibuatPada: "2026-07-31",
  },
  /* --- selesai --- */
  {
    kode: "TRX-20260726-009",
    carSlug: "toyota-rush",
    customerId: "CUST-002",
    jaminanId: "JMN-002",
    startDate: "2026-07-26",
    durationDays: 3,
    jamBerangkat: "08.00",
    sellPricePerDay: 450_000,
    costPricePerDay: 310_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260726-009.mp4",
    videoDiunggahPada: "2026-07-26 07.50",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-07-24",
  },
  {
    kode: "TRX-20260722-010",
    carSlug: "honda-hrv",
    customerId: "CUST-004",
    jaminanId: "JMN-004",
    startDate: "2026-07-22",
    durationDays: 2,
    jamBerangkat: "13.00",
    sellPricePerDay: 600_000,
    costPricePerDay: 420_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260722-010.mp4",
    videoDiunggahPada: "2026-07-22 12.40",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "",
    dibuatOlehAdminId: "ADM-003",
    dibuatPada: "2026-07-21",
  },
  {
    kode: "TRX-20260718-011",
    carSlug: "toyota-avanza",
    customerId: "CUST-001",
    jaminanId: "JMN-001",
    startDate: "2026-07-18",
    durationDays: 5,
    jamBerangkat: "07.30",
    sellPricePerDay: 340_000,
    costPricePerDay: 240_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260718-011.mp4",
    videoDiunggahPada: "2026-07-18 07.15",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Harga lama sebelum penyesuaian 25 Juli 2026.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-07-16",
  },
  {
    kode: "TRX-20260715-012",
    carSlug: "toyota-fortuner",
    customerId: "CUST-005",
    jaminanId: "JMN-005",
    startDate: "2026-07-15",
    durationDays: 3,
    jamBerangkat: "06.00",
    sellPricePerDay: 950_000,
    costPricePerDay: 680_000,
    pakaiSopir: true,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260715-012.mp4",
    videoDiunggahPada: "2026-07-15 05.45",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "",
    dibuatOlehAdminId: "ADM-001",
    dibuatPada: "2026-07-13",
  },
  {
    kode: "TRX-20260710-013",
    carSlug: "suzuki-ertiga",
    customerId: "CUST-006",
    jaminanId: "JMN-007",
    startDate: "2026-07-10",
    durationDays: 4,
    jamBerangkat: "09.00",
    sellPricePerDay: 400_000,
    costPricePerDay: 270_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260710-013.mp4",
    videoDiunggahPada: "2026-07-10 08.45",
    hariTambahan: 0,
    dendaTercatat: 150_000,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Telat 3 jam, denda Rp 150.000 sudah dibayar saat pengembalian.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-07-08",
  },
  {
    kode: "TRX-20260705-014",
    carSlug: "toyota-agya",
    customerId: "CUST-007",
    jaminanId: "JMN-008",
    startDate: "2026-07-05",
    durationDays: 2,
    jamBerangkat: "11.00",
    sellPricePerDay: 250_000,
    costPricePerDay: 170_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260705-014.mp4",
    videoDiunggahPada: "2026-07-05 10.50",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "",
    dibuatOlehAdminId: "ADM-003",
    dibuatPada: "2026-07-04",
  },
  {
    kode: "TRX-20260702-015",
    carSlug: "mitsubishi-xpander",
    customerId: "CUST-003",
    jaminanId: "JMN-003",
    startDate: "2026-07-02",
    durationDays: 6,
    jamBerangkat: "07.00",
    sellPricePerDay: 440_000,
    costPricePerDay: 310_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260702-015.mp4",
    videoDiunggahPada: "2026-07-02 06.45",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "Harga lama sebelum penyesuaian 25 Juli 2026.",
    dibuatOlehAdminId: "ADM-002",
    dibuatPada: "2026-06-30",
  },
  {
    kode: "TRX-20260628-016",
    carSlug: "toyota-innova-zenix",
    customerId: "CUST-008",
    jaminanId: "JMN-009",
    startDate: "2026-06-28",
    durationDays: 3,
    jamBerangkat: "08.30",
    sellPricePerDay: 720_000,
    costPricePerDay: 520_000,
    pakaiSopir: false,
    hargaSopirPerHari: SOPIR.harga,
    upahSopirPerHari: SOPIR.upah,
    videoSerahTerima: "serah-terima-TRX-20260628-016.mp4",
    videoDiunggahPada: "2026-06-28 08.15",
    hariTambahan: 0,
    dendaTercatat: 0,
    status: "DONE",
    dibatalkanPada: null,
    alasanBatal: "",
    catatan: "",
    dibuatOlehAdminId: "ADM-001",
    dibuatPada: "2026-06-26",
  },
];

/* -------------------------------------------------------------- pembayaran */

export const paymentRecords: PaymentRecord[] = [
  /* sedang jalan — baru DP */
  { id: "PAY-001", kodeTransaksi: "TRX-20260729-001", jenis: "DP", jumlah: 500_000, metode: "Transfer", dibayarPada: "2026-07-27", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-002", kodeTransaksi: "TRX-20260801-002", jenis: "DP", jumlah: 2_000_000, metode: "Transfer", dibayarPada: "2026-07-30", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-003", kodeTransaksi: "TRX-20260801-003", jenis: "DP", jumlah: 300_000, metode: "Tunai", dibayarPada: "2026-07-31", dicatatOlehAdminId: "ADM-003" },
  { id: "PAY-004", kodeTransaksi: "TRX-20260730-004", jenis: "DP", jumlah: 1_500_000, metode: "Transfer", dibayarPada: "2026-07-29", dicatatOlehAdminId: "ADM-002" },
  /* booking — DP */
  { id: "PAY-005", kodeTransaksi: "TRX-20260802-005", jenis: "DP", jumlah: 1_500_000, metode: "Transfer", dibayarPada: "2026-08-02", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-006", kodeTransaksi: "TRX-20260802-006", jenis: "DP", jumlah: 3_000_000, metode: "Transfer", dibayarPada: "2026-08-02", dicatatOlehAdminId: "ADM-001" },
  /* TRX-...-007 sengaja belum bayar sama sekali */

  /* selesai — DP + pelunasan */
  { id: "PAY-007", kodeTransaksi: "TRX-20260726-009", jenis: "DP", jumlah: 500_000, metode: "Transfer", dibayarPada: "2026-07-24", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-008", kodeTransaksi: "TRX-20260726-009", jenis: "Pelunasan", jumlah: 850_000, metode: "Tunai", dibayarPada: "2026-07-29", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-009", kodeTransaksi: "TRX-20260722-010", jenis: "DP", jumlah: 400_000, metode: "Transfer", dibayarPada: "2026-07-21", dicatatOlehAdminId: "ADM-003" },
  { id: "PAY-010", kodeTransaksi: "TRX-20260722-010", jenis: "Pelunasan", jumlah: 800_000, metode: "Tunai", dibayarPada: "2026-07-24", dicatatOlehAdminId: "ADM-003" },
  { id: "PAY-011", kodeTransaksi: "TRX-20260718-011", jenis: "DP", jumlah: 700_000, metode: "Transfer", dibayarPada: "2026-07-16", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-012", kodeTransaksi: "TRX-20260718-011", jenis: "Pelunasan", jumlah: 1_000_000, metode: "Tunai", dibayarPada: "2026-07-23", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-013", kodeTransaksi: "TRX-20260715-012", jenis: "DP", jumlah: 1_500_000, metode: "Transfer", dibayarPada: "2026-07-13", dicatatOlehAdminId: "ADM-001" },
  { id: "PAY-014", kodeTransaksi: "TRX-20260715-012", jenis: "Pelunasan", jumlah: 2_850_000, metode: "Transfer", dibayarPada: "2026-07-18", dicatatOlehAdminId: "ADM-001" },
  { id: "PAY-015", kodeTransaksi: "TRX-20260710-013", jenis: "DP", jumlah: 600_000, metode: "Tunai", dibayarPada: "2026-07-08", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-016", kodeTransaksi: "TRX-20260710-013", jenis: "Pelunasan", jumlah: 1_000_000, metode: "Tunai", dibayarPada: "2026-07-14", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-017", kodeTransaksi: "TRX-20260710-013", jenis: "Denda", jumlah: 150_000, metode: "Tunai", dibayarPada: "2026-07-14", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-018", kodeTransaksi: "TRX-20260705-014", jenis: "DP", jumlah: 200_000, metode: "Tunai", dibayarPada: "2026-07-04", dicatatOlehAdminId: "ADM-003" },
  { id: "PAY-019", kodeTransaksi: "TRX-20260705-014", jenis: "Pelunasan", jumlah: 300_000, metode: "Tunai", dibayarPada: "2026-07-07", dicatatOlehAdminId: "ADM-003" },
  { id: "PAY-020", kodeTransaksi: "TRX-20260702-015", jenis: "DP", jumlah: 1_000_000, metode: "Transfer", dibayarPada: "2026-06-30", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-021", kodeTransaksi: "TRX-20260702-015", jenis: "Pelunasan", jumlah: 1_640_000, metode: "Transfer", dibayarPada: "2026-07-08", dicatatOlehAdminId: "ADM-002" },
  { id: "PAY-022", kodeTransaksi: "TRX-20260628-016", jenis: "DP", jumlah: 800_000, metode: "Transfer", dibayarPada: "2026-06-26", dicatatOlehAdminId: "ADM-001" },
  { id: "PAY-023", kodeTransaksi: "TRX-20260628-016", jenis: "Pelunasan", jumlah: 1_360_000, metode: "Tunai", dibayarPada: "2026-07-01", dicatatOlehAdminId: "ADM-001" },
];

/* ---------------------------------------------------------------- tracking */

/**
 * Posisi terakhir tiap unit yang sedang di luar, diikat ke kode transaksi
 * (bukan plat — unit tidak dibedakan per plat).
 *
 * Ini data karangan. Sumber posisi sebenarnya (vendor GPS tracker dan API-nya)
 * masih ditahan — lihat pertanyaan terbuka no. 1 di `docs/06-keputusan-teknis.md`.
 */
export const posisiRecords: PosisiRecord[] = [
  {
    kodeTransaksi: "TRX-20260729-001",
    lat: -7.6853,
    lng: 108.6492,
    kecepatan: 0,
    arah: "-",
    lokasiPerkiraan: "Parkir Pantai Pangandaran, Ciamis",
    terakhirUpdate: "12 menit lalu",
  },
  {
    kodeTransaksi: "TRX-20260801-002",
    lat: -6.7063,
    lng: 108.5571,
    kecepatan: 78,
    arah: "Timur laut",
    lokasiPerkiraan: "Tol Cipali KM 178, Cirebon",
    terakhirUpdate: "1 menit lalu",
  },
  {
    kodeTransaksi: "TRX-20260801-003",
    lat: -6.9147,
    lng: 107.6098,
    kecepatan: 0,
    arah: "-",
    lokasiPerkiraan: "Parkir Jl. Braga, Bandung",
    terakhirUpdate: "6 menit lalu",
  },
  {
    kodeTransaksi: "TRX-20260730-004",
    lat: -6.9932,
    lng: 110.4203,
    kecepatan: 34,
    arah: "Timur",
    lokasiPerkiraan: "Jl. Pemuda, Semarang",
    terakhirUpdate: "3 menit lalu",
  },
];

/* ------------------------------------------------------------------- admin */

export const adminRecords: AdminRecord[] = [
  { id: "ADM-001", nama: "Pak Yusuf", email: "owner@rentcar.id", peran: "SUPER_ADMIN", aktif: true },
  { id: "ADM-002", nama: "Sari", email: "sari@rentcar.id", peran: "ADMIN", aktif: true },
  { id: "ADM-003", nama: "Dimas", email: "dimas@rentcar.id", peran: "ADMIN", aktif: true },
];
