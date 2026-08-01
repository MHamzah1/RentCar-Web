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
| Status transaksi | Booking → Sedang Perjalanan → Selesai |

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

## Pertanyaan Terbuka

Hal-hal yang belum terjawab dari catatan fitur dan perlu dikonfirmasi sebelum
implementasi:

1. **Tracking** — GPS tracker sudah terpasang di mobil? Vendornya siapa dan
   apakah menyediakan API? (Paling menentukan; lihat di atas)
2. **Pembayaran** — apakah DP / pelunasan perlu dicatat di transaksi? Catatan
   fitur belum menyebut soal uang masuk, hanya harga jual dan modal.
3. **Denda keterlambatan** — kalau mobil telat dikembalikan, apakah ada
   perhitungan denda?
4. **Pembatalan** — kalau customer batal setelah status Booking, statusnya jadi
   apa? Saat ini alur hanya satu arah sampai Selesai, belum ada "Batal".
5. **Unit mobil** — apakah tiap unit fisik perlu dibedakan (nomor plat
   masing-masing), atau cukup hitungan jumlah unit per model?
6. **Peran pengguna** — apakah cukup satu peran Admin, atau perlu Owner yang
   bisa melihat harga modal & laba versus Staf yang tidak?
7. **Sewa dengan driver** — apakah ada opsi lepas kunci vs dengan driver? Kalau
   ada, harganya berbeda dan perlu field tambahan.
8. **Foto mobil** — foto asli diunggah lewat admin, atau tetap memakai foto
   stok untuk sementara?
