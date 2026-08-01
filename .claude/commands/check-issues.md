# Cek Issues — Audit Masalah Implementasi

Audit **masalah pada implementasi yang sudah ada**: bug berisiko, kebocoran data,
inkonsistensi internal, dan penyimpangan dari docs/rules. Bukan progress fitur
(itu `/check-progress`).

**Hasil hanya di chat** — jangan buat file issue list kecuali user minta.

## Kapan Dipakai

User bilang: check issues, audit issues, cek penyelewengan docs, inkonsistensi,
ada yang bocor tidak, atau sejenisnya.

Opsional scope: "issues transaksi saja" / "issues landing page".

## 1. Muat sumber kebenaran (wajib)

| Sumber | Cek apa |
|---|---|
| `.claude/rules/project-context.md` | Seluruh hard rules |
| `AGENTS.md` / `CLAUDE.md` | Kewajiban baca docs Next.js bundled |
| `docs/01-ruang-lingkup.md` | Ada yang out-of-scope ikut dibangun? |
| `docs/03-modul-admin.md` | Perilaku modul vs spesifikasi |
| `docs/04-landing-page.md` | Data apa yang boleh publik |
| `docs/05-model-data.md` | Field & relasi yang menyimpang |
| `docs/06-keputusan-teknis.md` | Teknologi dipakai padahal belum diputuskan |

## 2. Scan kode (bukti path wajib)

### Kebocoran data — prioritas tertinggi

- `costPricePerDay` / `totalCost` / `profit` terkirim ke halaman atau komponen
  publik (cek props Server → Client Component di `src/app/` dan `src/components/`)
- NIK, dokumen, nomor darurat, link maps rumah, foto rumah muncul di route publik
- File dokumen customer disimpan di `public/` atau URL-nya bisa ditebak
- Kredensial / API key (maps, OCR, storage) terekspos ke bundle client
  (variabel `NEXT_PUBLIC_*` yang seharusnya rahasia)
- Data admin/transaksi bisa diambil dari endpoint tanpa cek sesi

```bash
rg -n "costPrice|totalCost|profit" src/app src/components
rg -n "NEXT_PUBLIC_" src/ .env*
rg -n "nik|ktp|emergency|housePhoto" src/app src/components -i
```

### Auth

- Route `/admin/*` yang tidak dijaga di server
- Pengecekan role/sesi hanya di client (menyembunyikan tombol ≠ mengamankan data)
- Password disimpan tanpa hash

### Integritas data transaksi

- Total dihitung dari harga katalog yang sedang berlaku, bukan snapshot di transaksi
- Stok unit disimpan sebagai counter yang di-decrement manual
- Status transaksi bisa melompat/mundur di luar `BOOKING → ON_TRIP → DONE`
- Uang disimpan sebagai float, bukan integer Rupiah
- `endDate` disimpan manual dan bisa tidak sinkron dengan `startDate + durationDays`

### Drift dari docs

- Landing page punya form booking yang persist (harusnya lewat WhatsApp)
- Nomor WhatsApp di-hardcode tersebar, atau bukan `6281574865632`
- Harga masih USD di UI
- OCR KTP langsung menyimpan tanpa tahap koreksi admin
- Fitur di daftar batasan `docs/01` ikut dibangun (akun customer, pembayaran
  online, notifikasi otomatis)

### Next.js 16

- Pola API lama yang tidak ada lagi di versi ini (cek `node_modules/next/dist/docs/`)
- Penggunaan `middleware` padahal versi ini memakai **Proxy**
- `"use client"` di komponen yang menerima data sensitif dari server

### Kualitas berisiko

- TODO/FIXME di path kritis (auth, transaksi, harga)
- Endpoint create ada tapi list/detail masih mock
- UI menawarkan aksi yang pasti error
- `console.log` yang membocorkan data customer

Jangan laporkan "belum dikerjakan" sebagai issue, kecuali itu **penyimpangan**
(docs bilang X, kode melakukan anti-X) atau **lubang berbahaya** di fitur yang
sudah diklaim jalan.

## 3. Tingkat Keparahan

| Level | Pakai bila |
|---|---|
| `critical` | Data pribadi customer atau harga modal bocor ke publik, admin bisa diakses tanpa login, secret di bundle client |
| `high` | Fitur "jalan" palsu, integritas transaksi rusak (harga/stok/status), auth palsu |
| `medium` | Drift dari docs yang jelas, uang sebagai float, nomor WA tersebar |
| `low` | Naming, copy, nit yang tidak memblok |

## 4. Template Output Chat

```markdown
# Issues — RentCar

**Ringkas:** [1–2 kalimat + jumlah critical/high]

## Critical
- **[judul]** — bukti: `path:line` — aturan yang dilanggar: […] — dampak: […]

## High
- …

## Medium
- …

## Low
- …

## Patuh (opsional, singkat)
- [hal penting yang sudah benar — biar tidak false alarm]

## Rekomendasi urutan fix
1. …
```

Setiap temuan wajib: **bukti path**, **aturan/doc yang dilanggar**, **dampak**.
Jangan generic "perlu dirapikan".

## Aturan

- Beda dari `/check-progress`: di sini fokus **salah / menyimpang / berisiko**,
  bukan persentase selesai.
- Chat only; jangan bikin `docs/issues-*.md` kecuali user minta.
- Jangan mulai fix kecuali user minta setelah laporan.
- Prioritaskan kebocoran data pribadi & harga modal di atas nit UI.
- Kalau scope sempit, tetap cek hard rules yang menyentuh scope itu.
- Hindari false positive: admin **boleh** melihat harga modal dan data customer
  lengkap — yang dilarang adalah data itu keluar ke sisi publik.
