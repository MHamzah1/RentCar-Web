# Cek Progress — Audit Kemajuan Fitur

Audit progress aplikasi vs rencana fitur di `docs/`. **Hasil hanya di chat** —
jangan buat/update file progress kecuali user minta.

## Kapan Dipakai

User bilang: check progress, status fitur, audit progress, apa yang sudah/belum,
sejauh mana, tech debt scan, atau sejenisnya.

## Alur Kerja

### 1. Baca sumber scope (wajib)

- `docs/03-modul-admin.md` — spesifikasi 6 modul admin (**checklist utama**)
- `docs/04-landing-page.md` — perubahan yang dibutuhkan di halaman publik
- `docs/01-ruang-lingkup.md` — batasan; jangan laporkan out-of-scope sebagai "belum"
- `docs/05-model-data.md` — entitas yang seharusnya ada
- `.claude/rules/project-context.md` — hard rules
- PRD/grill di `docs/prds/` & `docs/grills/` hanya untuk klarifikasi DoD
  (PRD ada ≠ fitur sudah di-ship)

### 2. Map tiap item → kode

| Area | Cari di |
|---|---|
| Landing page | `src/app/page.tsx`, `src/app/vehicles/`, `src/app/about/`, `src/app/contact/` |
| Komponen publik | `src/components/` |
| Admin | `src/app/admin/` (belum ada saat docs ini ditulis) |
| Auth / proteksi route | `proxy.ts` di root atau `src/`, helper session di `src/lib/` |
| Data & tipe | `src/lib/data.ts` (dummy), schema DB (Prisma/SQL) kalau sudah ada |
| API endpoint | `src/app/api/**/route.ts` |

### 3. Nilai status per fitur (pakai label ini saja)

| Status | Artinya |
|---|---|
| `done` | Berfungsi end-to-end mendekati spesifikasi (bukan cuma UI shell) |
| `partial` | Ada UI dan/atau API, tapi masih dummy/TODO/belum wire penuh |
| `scaffold` | Halaman/route ada; datanya palsu atau "Coming Soon" |
| `missing` | Belum ada jejak berarti di kode |
| `blocked` | Ditunda karena keputusan/dependensi belum ada |

Jangan anggap `done` cuma karena file ada. Cek: data dummy vs database asli,
form tanpa persist, tombol yang belum terhubung, TODO di path kritis.

### 4. Checklist yang harus dilaporkan

**Admin internal** (dari `docs/03-modul-admin.md`)

1. Login Admin
2. Katalog Mobil & Pricing (harga jual, harga modal, jumlah unit)
3. Customer (identitas KTP, kontak tambahan, lokasi, dokumen, jaminan, scan KTP)
4. Transaksi (booking dari katalog, tanggal/durasi/jam, status Booking → Sedang Perjalanan → Selesai)
5. Tracking Maps Car
6. Export Transaksi Excel (filter startDate/endDate)

**Landing page** (dari `docs/04-landing-page.md`)

- Tombol booking → WhatsApp `wa.me/6281574865632`
- Harga tampil dalam Rupiah (bukan USD)
- Data mobil dari database, bukan `src/lib/data.ts`
- Status tersedia / tidak tersedia
- Nomor kontak asli, bukan dummy

**Fondasi**

- Database & lapisan persistensi
- Penyimpanan file privat untuk dokumen customer

### 5. Scan debt & risiko (wajib)

- Harga masih USD / hardcode angka dolar
- Data mobil masih dari `src/lib/data.ts` padahal admin katalog sudah ada
- `costPricePerDay` ikut terkirim ke komponen publik
- Dokumen/foto customer disimpan di `public/`
- Halaman `/admin` tanpa pengecekan sesi di server
- Harga transaksi tidak di-snapshot (join langsung ke katalog)
- Stok unit disimpan sebagai counter manual, bukan dihitung
- `console.log` tercecer (lihat `/logging`)
- Kode Next.js yang ditulis tanpa cek docs bundled (lihat `/next16`)
- Docs vs kode bertentangan

### 6. Tulis laporan di chat

```markdown
# Progress — RentCar

**Ringkas:** [1–2 kalimat: kira-kira sejauh mana]

## Sudah (`done`)
- **[Fitur]** — bukti singkat (path / perilaku)

## Partial
- **[Fitur]** — ada apa / kurang apa

## Scaffold
- **[Fitur]** — file ada, belum real

## Belum (`missing`)
- **[Fitur]**

## Blocked
- **[Fitur]** — blocker (keputusan/dependensi)

## Perlu diperhatikan
- [risiko / gap / dependensi]

## Tech debt
- [item + lokasi]

## Inkonsistensi
- [docs ↔ kode]
```

## Aturan

- Sumber checklist = `docs/03-modul-admin.md` + `docs/04-landing-page.md`.
- Output **chat only** — jangan bikin file progress kecuali user minta.
- Jujur: scaffold ≠ done. Sebut bukti (path/file).
- Jangan laporkan item di daftar batasan `docs/01` sebagai "belum dikerjakan" —
  itu memang tidak dikerjakan.
- Jangan mulai implementasi di sesi ini kecuali user minta setelah laporan.
- Kalau user minta fokus satu modul ("progress transaksi saja"), batasi laporan
  ke modul itu + debt terkait.
