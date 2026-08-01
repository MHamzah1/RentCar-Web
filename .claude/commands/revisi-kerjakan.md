# Revisi — Implementasi

Eksekusi dokumen revisi yang sudah matang dari `/revisi`. Dokumen itu sumber kebenaran, bukan chat.

## Tugasmu

Baca `docs/revisi/revisi-[topik].md` dan implementasi **hanya** yang sudah ada di **Keputusan Terkunci**.
Jangan menambah scope, jangan menebak keputusan yang masih pending.

Kalau ada lebih dari satu file `docs/revisi/revisi-*.md`, tanya **satu pertanyaan**: revisi yang mana.
Kalau dokumen revisi belum ada, arahkan user jalankan `/revisi` dulu.

## Langkah

1. Baca `docs/revisi/revisi-[topik].md` — utamakan **Keputusan Terkunci**, **File Terdampak**,
   **Referensi Mockup**, dan **Checklist Definition of Done**.
2. Baca `.claude/rules/project-context.md` sebelum ngoding. Kalau menyentuh API
   Next.js, baca juga docs bundled-nya dulu (lihat `/next16`).
3. Implementasi per **File Terdampak**:
   - Ikuti struktur App Router: `src/app/**/page.tsx` (Server Component) →
     Server Action / `src/app/api/**/route.ts` → akses data di `src/lib/`.
   - **Reuse pola existing** — jangan bikin abstraksi baru tanpa perlu.
   - Untuk UI: cocokkan hasil dengan file di **Referensi Mockup**; jangan bikin design system baru.
4. Jalankan **Verifikasi** (di bawah).
5. **Centang Checklist DoD** di dokumen revisi sesuai yang benar-benar sudah selesai & terverifikasi.

## Tegakkan Hard Rules

- Harga modal (`costPricePerDay`, `totalCost`, `profit`) **tidak boleh** sampai ke sisi publik —
  termasuk sebagai props ke Client Component halaman publik.
- Data pribadi customer (NIK, KK, SIM, NPWP, foto KTP, foto rumah, link maps, kontak darurat)
  tidak pernah ke landing page; dokumen **tidak** disimpan di `public/`.
- Booking customer lewat **WhatsApp** `wa.me/6281574865632` — bukan form yang persist di publik.
  Nomor diambil dari satu konstanta di `src/lib/`, jangan hardcode tersebar.
- Harga di transaksi adalah **snapshot** saat booking, bukan join ke harga katalog terkini.
- `availableUnit` **dihitung** dari transaksi berstatus `BOOKING`/`ON_TRIP`, bukan counter manual.
- Status transaksi hanya `BOOKING → ON_TRIP → DONE`, maju satu arah.
- Semua `/admin/*` dicek sesinya **di server**, bukan cuma menyembunyikan menu di client.
- Uang = integer Rupiah; format `Rp` hanya di lapisan tampilan.
- Kode Next.js ditulis setelah membaca `node_modules/next/dist/docs/` (`/next16`).
- **Jangan edit `CLAUDE.md` / `AGENTS.md`.**

Detail: `.claude/rules/project-context.md`.

## Test (Pengujian)

Project ini **belum punya test runner**. Jangan memasangnya diam-diam. Kalau revisi menyentuh
hitungan uang atau transisi status transaksi dan kamu menilai perlu test, **usulkan ke user**
dan tunggu persetujuan.

## Verifikasi (WAJIB sebelum lapor selesai)

1. `npm run build` — harus hijau. Ini sekaligus type-check; **belum ada script `typecheck`**
   terpisah di `package.json`.
2. `npm run lint` — harus bersih.
3. Untuk revisi yang punya UI/alur: jalankan `npm run dev` dan cek **end-to-end** di browser
   (skill `/run` bisa dipakai). Untuk revisi UI, bandingkan hasil dengan mockup dan pastikan
   halaman publik yang sudah jalan tidak rusak.

## Larangan

- Jangan sentuh apa pun di luar scope dokumen revisi.
- Jangan menambah dependency besar (ORM, auth library, UI kit) tanpa konfirmasi user.
- Jangan mengerjakan hal di daftar batasan `docs/01-ruang-lingkup.md`.
- Jangan edit `CLAUDE.md` / `AGENTS.md`.

## Selesai

- Laporan ringkas: apa yang diubah + status **Checklist DoD** (mana yang `[x]`).
- Sebutkan hasil `npm run build` dan `npm run lint` apa adanya.
- Kalau ada learning penting, catat ke `docs/revisi/note/[topik].md` (**bukan** `CLAUDE.md`).
- Kalau ada item yang tidak bisa diselesaikan, sampaikan apa adanya + alasannya — jangan diam-diam skip.
