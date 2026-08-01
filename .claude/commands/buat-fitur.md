# Buat Fitur

Kerjakan satu fitur RentCar dari nol sampai bisa dicoba di browser.

## Kapan Dipakai

User minta membangun sesuatu yang konkret: "buat login admin", "buat katalog
mobil", "buat halaman transaksi", "pasang tombol WA di kartu mobil".

Kalau requirement-nya masih kabur atau besar, arahkan ke `/grill-me` dulu —
jangan menebak keputusan bisnis sendiri.

## Langkah

### 1. Baca dulu, jangan langsung ngoding

Wajib, berurutan:

1. `.claude/rules/project-context.md` — hard rules
2. Bagian yang relevan di `docs/03-modul-admin.md` atau `docs/04-landing-page.md`
3. `docs/05-model-data.md` kalau menyentuh data
4. **Dokumentasi Next.js bundled** untuk API yang akan dipakai — lihat `/next16`.
   Ini bukan opsional; `AGENTS.md` mewajibkannya.
5. Kode existing yang mirip di `src/` — ikuti polanya

### 2. Konfirmasi scope (maks 1 pertanyaan)

Kalau ada satu hal yang benar-benar ambigu dan menentukan hasil, tanya **satu**
pertanyaan dengan rekomendasimu di depan. Selain itu, jalan saja dengan asumsi
yang kamu sebutkan.

Cek juga daftar **Pertanyaan Terbuka** di `docs/06-keputusan-teknis.md` — kalau
fitur ini bergantung pada salah satunya (mis. tracking butuh vendor GPS), bilang
di awal.

### 3. Kerjakan sebagai irisan vertikal

Satu fitur = data + logika + UI yang **bisa dilihat hasilnya**. Bukan "bikin
semua schema dulu, UI menyusul".

Urutan yang biasanya benar untuk project ini:

| Lapisan | Lokasi |
|---|---|
| Tipe & konstanta | `src/lib/` |
| Akses data | `src/lib/` (atau lapisan db kalau sudah ada) |
| Server Component / halaman | `src/app/**/page.tsx` |
| Aksi simpan/ubah | Server Action atau `src/app/api/**/route.ts` |
| Komponen UI | `src/components/` |

Aturan saat mengerjakan:

- **Reuse dulu.** Kartu, tombol, layout — pakai yang sudah ada di `src/components/`.
- Jangan bikin design system baru; ikuti token Tailwind di `src/app/globals.css`.
- Client Component hanya kalau butuh interaksi. Data sensitif jangan diturunkan
  ke Client Component.
- Uang = integer Rupiah, format `Rp` hanya di tampilan.

### 4. Hard rules yang paling sering kena

- Harga modal (`costPricePerDay`) tidak boleh sampai ke sisi publik
- Data pribadi customer tidak pernah ke landing page, dokumen bukan di `public/`
- `/admin/*` wajib dicek sesinya di server
- Harga transaksi di-snapshot saat booking
- Stok unit dihitung dari transaksi aktif, bukan counter manual
- Status transaksi hanya `BOOKING → ON_TRIP → DONE`
- Nomor WA admin dari satu konstanta, jangan hardcode tersebar

Detail: `.claude/rules/project-context.md`.

### 5. Verifikasi (wajib sebelum lapor selesai)

1. `npm run build` — harus hijau (ini sekaligus type-check; belum ada script
   `typecheck` terpisah)
2. `npm run lint` — harus bersih
3. Jalankan `npm run dev`, buka halamannya, **coba alurnya sendiri**

Belum ada test runner di project ini. Kalau fitur menyentuh hitungan uang atau
status transaksi dan user ingin test, tanya dulu — memasang test runner adalah
keputusan yang perlu persetujuan.

### 6. Lapor

- Apa yang dibuat/diubah (path)
- Cara mencobanya (URL + langkah singkat)
- Hasil `npm run build` dan `npm run lint` apa adanya
- Yang **tidak** dikerjakan + alasannya, kalau ada

## Larangan

- Jangan mengerjakan hal di daftar batasan `docs/01-ruang-lingkup.md`
- Jangan menambah dependency besar tanpa konfirmasi user
- Jangan menulis kode Next.js dari ingatan — baca `node_modules/next/dist/docs/`
- Jangan edit `CLAUDE.md` / `AGENTS.md`
- Jangan mengklaim selesai kalau `npm run build` belum dijalankan
