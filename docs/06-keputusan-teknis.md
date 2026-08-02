# 06 — Keputusan Teknis

Dokumen ini mencatat pilihan teknologi, rekomendasi, dan hal-hal yang **belum
diputuskan**. Setiap keputusan yang sudah final sebaiknya dipindahkan ke bagian
"Sudah Diputuskan".

---

## Sudah Diputuskan

| Hal | Keputusan |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 |
| Bahasa | TypeScript strict |
| Booking customer | Lewat WhatsApp ke **081574865632**, bukan form di website |
| Yang menginput transaksi | Admin internal, manual |
| Status transaksi | Booking → Sedang Perjalanan → Selesai, plus Batal, Lewat Waktu, Diperpanjang (lihat `docs/02`) |
| Unit mobil | **Tidak** dibedakan per plat — cukup jumlah unit per model |
| Peran pengguna | Dua: **Super Admin (Owner)** dan **Admin (Staf)** |
| Pembayaran | Dicatat di sistem: **DP + pelunasan** |
| Denda keterlambatan | **Rp 50.000 per jam** overtime |
| Sewa dengan sopir | **Rp 500.000 per hari**, flat untuk semua mobil |
| Foto mobil | Diunggah admin lewat modul Katalog |

### Aturan bisnis yang diputuskan 2 Agustus 2026

Rinciannya ada di [02 — Alur Bisnis](02-alur-bisnis.md) dan
[03 — Modul Admin](03-modul-admin.md). Ringkasnya:

1. **Status batal** ada. Unit kembali ke stok saat transaksi dibatalkan.
2. **Video kondisi awal unit wajib** saat admin menekan tombol "Mulai
   Perjalanan". Tanpa video, status tidak bisa berpindah dari Booking.
3. **Status Lewat Waktu (overtime) muncul otomatis** begitu melewati batas
   pengembalian — tidak perlu diklik admin.
4. Dari Lewat Waktu, admin bisa **memperpanjang** sewa dengan menambah jumlah
   hari. Statusnya menjadi **Diperpanjang**.
5. **Reminder overtime** tampil sebagai notifikasi **di dalam aplikasi admin**.
6. **Harga modal dan laba hanya untuk Super Admin.** Admin staf tidak melihat
   kolom modal, laba, maupun margin di mana pun.

### Catatan penting soal Next.js 16

Versi Next.js di project ini punya perubahan yang berbeda dari kebiasaan lama.
**Baca dokumentasi yang ter-bundle di `node_modules/next/dist/docs/` sebelum
menulis kode**, jangan mengandalkan ingatan atau tutorial lama.

Yang paling relevan untuk pekerjaan ini:

| Kebutuhan | Baca |
|---|---|
| Login & proteksi route | `01-app/02-guides/authentication.md` |
| Melindungi `/admin/*` sebelum request selesai | `01-app/01-getting-started/16-proxy.md` |
| Form & aksi input data | `01-app/01-getting-started/07-mutating-data.md`, `02-guides/forms.md` |
| API endpoint (misal export Excel) | `01-app/01-getting-started/15-route-handlers.md` |
| Ambil data dari database | `01-app/01-getting-started/06-fetching-data.md` |
| Caching & revalidasi setelah data berubah | `01-app/01-getting-started/08-caching.md`, `09-revalidating.md` |
| Upload gambar & optimasi | `01-app/01-getting-started/12-images.md` |

> Perubahan yang paling mudah menjebak: sejak Next.js 16, **Middleware sekarang
> bernama Proxy**. Fungsinya sama, namanya berbeda.

---

## Perlu Diputuskan

### Database

Belum ada database sama sekali — semua data masih hardcode di
[src/lib/data.ts](../src/lib/data.ts).

**Rekomendasi:** PostgreSQL + Prisma. Alasannya: relasi antar entitas di
[05 — Model Data](05-model-data.md) cukup banyak, dan Prisma memberi tipe
TypeScript otomatis yang cocok dengan mode strict di project ini. Untuk hosting,
Vercel Postgres / Neon / Supabase sama-sama layak.

Alternatif kalau ingin lebih ringan: SQLite untuk tahap awal, migrasi ke
PostgreSQL saat sudah dipakai produksi.

### Autentikasi admin

**Rekomendasi:** session berbasis cookie yang dibuat sendiri (email + password,
hash pakai bcrypt/argon2) — cukup untuk satu peran admin, tanpa dependensi
besar. Kalau nanti butuh login Google atau multi-peran, baru pertimbangkan
Auth.js.

Ikuti pola di `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.

### Penyimpanan file (foto KTP, KK, SIM, foto rumah)

Ini data pribadi sensitif, **tidak boleh** disimpan di folder `public/`.

**Rekomendasi:** object storage (Vercel Blob, Cloudflare R2, atau S3) dengan
akses privat, dan file hanya bisa dibuka lewat URL bertanda tangan
(*signed URL*) yang punya masa berlaku. URL tidak boleh bisa ditebak.

### OCR KTP

Ini bagian paling tidak pasti — hasil OCR **selalu** perlu dikoreksi manusia,
jadi form harus tetap bisa diedit apa pun teknologinya.

| Pilihan | Catatan |
|---|---|
| Model vision (LLM) | Paling tahan terhadap foto miring/kurang terang, dan bisa langsung mengeluarkan JSON sesuai field yang diminta. Perlu API key & biaya per gambar |
| Google Cloud Vision / AWS Textract | OCR umum, akurat untuk teks, tapi pemetaan ke field KTP harus ditulis sendiri |
| Layanan OCR KTP lokal | Sudah spesifik format KTP Indonesia, perlu dicek vendor & harganya |
| Tesseract.js (offline) | Gratis, tapi akurasinya rendah untuk foto KTP dari kamera HP |

**Rekomendasi:** mulai dari model vision karena hasilnya paling langsung pakai,
dengan catatan tetap sediakan jalur input manual sebagai fallback.

### Tracking Maps

Ada **dua hal terpisah** yang harus diputuskan, jangan tertukar.

**1. Dari mana koordinat mobil didapat?** — ini yang belum jelas dan paling
menentukan.

| Pilihan | Catatan |
|---|---|
| GPS tracker terpasang di mobil | Paling akurat dan otomatis. Vendor tracker (misalnya yang dipakai untuk fleet) biasanya menyediakan API untuk membaca koordinat. **Perlu dipastikan: vendor mana, dan apakah punya API** |
| Share location WhatsApp dari customer | Tanpa biaya perangkat, tapi manual dan tidak real-time |
| Aplikasi di HP driver | Hanya relevan kalau sewa pakai driver |

Tanpa sumber data yang jelas, modul tracking tidak bisa dibangun — peta hanya
akan menampilkan marker kosong. **Ini pertanyaan pertama yang harus dijawab.**

**2. Peta apa yang dipakai untuk menampilkan?**

| Pilihan | Catatan |
|---|---|
| Google Maps JavaScript API | Paling familiar untuk pengguna Indonesia, peta & alamatnya paling lengkap. Berbayar per pemuatan peta, ada kuota gratis bulanan |
| Mapbox GL JS | Tampilan bagus, kuota gratis lumayan |
| Leaflet + OpenStreetMap | Gratis, tanpa API key, tapi detail peta Indonesia kalah lengkap |

**Rekomendasi:** Google Maps JavaScript API — konsisten dengan `mapsLink` lokasi
rumah customer yang juga memakai Google Maps.

### Export Excel

**Rekomendasi:** ExcelJS, dijalankan di server lewat Route Handler yang
mengembalikan file `.xlsx` sebagai unduhan. ExcelJS mendukung format angka
Rupiah, lebar kolom, dan baris total — hal yang tidak bisa dilakukan CSV.

Alternatif lebih ringan: SheetJS (`xlsx`) kalau formatting tidak penting.

---

### Penyimpanan video serah terima

Video kondisi awal unit wajib diunggah saat mobil berangkat. Video jauh lebih
besar dari foto, jadi perlu dipikirkan sejak awal:

- Simpan di object storage yang sama dengan dokumen (privat, signed URL) —
  **bukan** di `public/` dan bukan di database.
- Batasi durasi/ukuran di sisi form (mis. maksimal 60 detik / 50 MB) supaya
  unggahan dari HP admin tidak gagal di tengah jalan.
- Kompresi di sisi browser sebelum unggah layak dipertimbangkan kalau koneksi
  di lapangan lambat.

### Reminder & notifikasi overtime

**Keputusan:** reminder overtime tampil sebagai notifikasi **di dalam aplikasi
admin** (lonceng di topbar + daftar di dashboard). Tidak mengirim WhatsApp atau
email otomatis ke customer — itu masih ada di daftar batasan `docs/01`.

**Rekomendasi teknis:** status Lewat Waktu **dihitung saat data dibaca**
(`sekarang > batas kembali` dan status masih berjalan), bukan disimpan lewat
cron job. Alasannya: tanpa penjadwal, statusnya tetap benar setiap kali halaman
dibuka, dan tidak ada risiko job gagal jalan lalu status ngambang.

---

## Pertanyaan Terbuka

Hal-hal yang masih perlu dikonfirmasi:

1. **Tracking** — GPS tracker sudah terpasang di mobil? Vendornya siapa dan
   apakah menyediakan API? _(status: **ditahan**, user masih mencari tahu —
   modul tracking dibangun sebagai tampilan dummy dulu)_
2. **Modal sopir** — harga jual sopir Rp 500.000/hari sudah pasti. Tapi berapa
   upah yang dibayarkan ke sopir? Angka ini dibutuhkan supaya laba tetap benar
   saat sewa memakai sopir. _(sementara diasumsikan Rp 350.000/hari di data
   dummy — mohon dikoreksi)_
3. **Pembatalan** — batal hanya boleh dari status Booking, atau boleh juga
   setelah mobil jalan? _(sementara diasumsikan: **hanya dari Booking**)_
4. **DP hangus atau tidak** saat transaksi dibatalkan? Belum ada aturannya.
5. **Denda overtime** — dihitung mulai jam ke berapa? Ada toleransi
   (mis. 1 jam pertama gratis) atau langsung dihitung sejak lewat satu menit?
6. **Perpanjangan** — saat sewa diperpanjang, denda overtime yang sudah
   terlanjur berjalan tetap ditagih atau dihapus? _(sementara diasumsikan:
   **tetap ditagih** sampai jam perpanjangan disetujui)_
7. **Batas unggah video** — durasi/ukuran maksimal video serah terima berapa?
