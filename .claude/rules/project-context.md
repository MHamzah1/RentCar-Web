# Project Context — RentCar

Sumber kebenaran hard rules untuk project ini. Command di `.claude/commands/`
merujuk ke file ini. Kalau ada aturan baru yang disepakati, tulis di sini —
bukan disebar ke tiap command.

## Stack

| Bagian | Teknologi |
|---|---|
| Framework | **Next.js 16 (App Router)** + React 19 |
| Styling | Tailwind CSS v4 (token di `src/app/globals.css`) |
| Bahasa | TypeScript strict |
| Ikon | lucide-react |
| Data saat ini | Dummy, hardcode di `src/lib/data.ts` (belum ada database) |

Script yang tersedia (`package.json`): `dev`, `build`, `start`, `lint`.
**Belum ada `typecheck` dan belum ada test runner** — type-check terjadi saat
`npm run build`.

## Docs Kanonik

Rencana fitur ada di `docs/`. Kalau kode dan docs bertentangan, **tanya user**
atau perbarui docs — jangan diam-diam menyimpang.

| Doc | Isi |
|---|---|
| `docs/01-ruang-lingkup.md` | Scope & batasan |
| `docs/02-alur-bisnis.md` | Alur end-to-end |
| `docs/03-modul-admin.md` | Spesifikasi 6 modul admin |
| `docs/04-landing-page.md` | Halaman publik |
| `docs/05-model-data.md` | Entitas & field |
| `docs/06-keputusan-teknis.md` | Pilihan teknologi + pertanyaan terbuka |

## Hard Rules

### 1. Next.js 16 — baca docs bundled dulu

`AGENTS.md` mewajibkan: **baca `node_modules/next/dist/docs/` sebelum menulis
kode Next.js.** Versi ini punya breaking change dari yang mungkin kamu ingat.

Yang paling sering menjebak: sejak Next.js 16 **Middleware bernama Proxy**
(`01-app/01-getting-started/16-proxy.md`).

### 2. Harga modal tidak boleh bocor ke publik

`costPricePerDay` dan turunannya (`totalCost`, `profit`) **hanya untuk admin**.
Tidak boleh masuk ke response/props halaman publik, tidak boleh ikut terkirim ke
client component landing page. Yang publik hanya `sellPricePerDay`.

### 3. Data pribadi customer tidak pernah ke publik

NIK, KK, SIM, NPWP, foto KTP, foto rumah, link maps rumah, nomor darurat —
tidak pernah muncul di landing page dan tidak pernah disimpan di folder
`public/`. Dokumen disimpan di storage privat, diakses lewat signed URL.

### 4. Booking customer lewat WhatsApp, bukan form

Landing page **tidak** menyimpan booking. Tombol booking mengarah ke
`https://wa.me/6281574865632?text=...`. Jangan bikin form pemesanan yang
persist ke database di sisi publik.

Nomor admin **081574865632** disimpan sebagai satu konstanta di `src/lib/`,
jangan di-hardcode tersebar di banyak komponen.

### 5. Harga di transaksi adalah snapshot

Saat transaksi dibuat, `sellPricePerDay` dan `costPricePerDay` **disalin** ke
record transaksi. Jangan menghitung total historis dengan join ke harga katalog
yang sedang berlaku — rekap laba akan salah begitu harga diubah.

### 6. Ketersediaan unit dihitung, bukan di-decrement manual

`availableUnit = totalUnit − transaksi berstatus BOOKING atau ON_TRIP`.
Jangan menyimpan kolom counter yang dikurangi/ditambah manual — itu gampang
drift kalau ada transaksi dibatalkan atau diedit.

### 7. Status transaksi maju satu arah

`BOOKING → ON_TRIP → DONE`. Belum ada status batal (lihat pertanyaan terbuka
di `docs/06`). Jangan menambah status baru tanpa keputusan user.

### 8. Semua `/admin/*` wajib auth

Tidak ada halaman admin yang bisa dibuka tanpa sesi login. Cek auth di sisi
server — jangan hanya menyembunyikan tombol di client.

### 9. Uang disimpan sebagai integer Rupiah

Simpan `350000`, bukan `350000.00` atau `350.0`. Format `Rp 350.000` hanya di
lapisan tampilan.

### 10. Hasil OCR KTP harus bisa dikoreksi

Data hasil scan KTP tidak pernah langsung tersimpan. Tampilkan sebagai form
yang bisa diedit admin, baru simpan setelah admin konfirmasi. Jalur input
manual harus selalu tersedia.

## Larangan

- Jangan edit `CLAUDE.md` dan `AGENTS.md` kecuali user minta.
- Jangan menambah dependency besar (auth library, ORM, state manager, UI kit)
  tanpa konfirmasi user — lihat `docs/06-keputusan-teknis.md`, sebagian masih
  status "perlu diputuskan".
- Jangan bangun design system baru. Ikuti pola komponen yang sudah ada di
  `src/components/`.
- Jangan mengerjakan hal yang ada di daftar **Batasan (Tidak Termasuk)** di
  `docs/01-ruang-lingkup.md` (booking mandiri, akun customer, pembayaran
  online, aplikasi mobile, notifikasi otomatis, multi-cabang).

## Verifikasi Sebelum Lapor Selesai

1. `npm run build` — harus hijau (ini sekaligus type-check).
2. `npm run lint` — harus bersih.
3. Kalau menyentuh UI/alur, jalankan `npm run dev` dan cek di browser.
