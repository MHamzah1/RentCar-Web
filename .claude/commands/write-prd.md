# Write PRD — Tulis Dokumen Requirement

Ubah pemahaman bersama jadi dokumen tujuan.

## Tugasmu

Pakai percakapan sejauh ini sebagai sumber kebenaran, lalu tulis PRD yang
lengkap. Ini adalah **tujuan** — ke mana kita akan pergi. Bukan rencana
bagaimana sampai ke sana (itu tahap berikutnya, `/prd-to-issues`).

## Langkah

1. Baca dokumen grill dulu kalau ada (`docs/grills/grill-[topik].md`) — itu
   sumber keputusan yang kanonik; chat hanya pelengkap.
2. Baca dokumen rencana yang menyangkut fitur ini (`docs/03-modul-admin.md`,
   `docs/04-landing-page.md`, `docs/05-model-data.md`) plus
   `.claude/rules/project-context.md` — PRD **tidak boleh** bertentangan
   dengan itu.
3. Tinjau percakapan hanya untuk celah yang belum tercatat di doc grill.
4. Kalau masih ada yang benar-benar ambigu dan menentukan, ajukan **SATU**
   pertanyaan sebelum lanjut — jangan menebak.
5. Telusuri codebase untuk menentukan modul/file mana yang akan tersentuh.
6. Tulis PRD memakai struktur di bawah.
7. Simpan sebagai `docs/prds/prd-[nama-fitur].md`.

## Struktur PRD

```markdown
# PRD: [Nama Fitur]

## Latar Masalah
Masalah apa yang diselesaikan? Siapa yang mengalaminya?
Spesifik — rujuk keluhan/kendala nyata, bukan masalah karangan.

## Tujuan
Satu-dua kalimat: seperti apa bentuk berhasilnya?

## Konteks
Konteks yang perlu diketahui pembaca. Stack, perilaku yang sudah ada,
kenapa ini penting sekarang.

## Definition of Done
Checklist eksplisit. Kalau semua tercentang, fitur siap rilis.
- [ ] item 1
- [ ] item 2

## Ruang Lingkup
Apa yang dicakup PRD ini. Tulis eksplisit.

## Non-Goals / Di Luar Scope
Apa yang **sengaja tidak** dikerjakan di PRD ini.
Ini sama pentingnya dengan bagian Scope.

## Pengguna & User Story
Siapa yang memakai fitur ini dan butuh apa?

- Sebagai [tipe pengguna], saya ingin [aksi] supaya [hasil]
- Sebagai [tipe pengguna], saya ingin [aksi] supaya [hasil]

## Kebutuhan Fungsional
Daftar bernomor: apa yang harus dilakukan sistem.
Kelompokkan per area kalau perlu (Auth, Data, UI, API, dsb.)

## Kebutuhan Non-Fungsional
Batasan performa, keamanan, privasi data, skalabilitas, kompatibilitas.

## Keputusan yang Sudah Disetujui
Keputusan penting yang sudah diambil saat sesi grill.
Daftar bernomor. Ini terkunci — jangan dibuka lagi.

## Pertanyaan Terbuka
Hal yang masih menggantung dan butuh jawaban sebelum atau saat pengerjaan.

## Modul yang Berubah
Daftar file/modul yang akan berubah. Tandai file baru secara eksplisit.

Untuk tiap modul, catat:
- Apa yang berubah
- Apakah file baru atau modifikasi yang sudah ada

## Risiko
Apa yang bisa salah? Apa yang belum diketahui?

## Ukuran Keberhasilan
Bagaimana kita tahu ini berhasil setelah dipakai?
```

## Aturan

- **Jangan** melewati bagian mana pun — tulis "N/A" kalau memang tidak relevan.
- **Jangan** diisi kalimat pengisi — tiap kalimat harus membawa informasi.
- Modul harus berupa path/file nyata, bukan deskripsi kabur.
- Definition of Done harus bisa dicek manusia dalam < 5 menit.
- Bagian "Di Luar Scope" wajib ada — minimal 2–3 poin.
- **Jangan** bertentangan dengan `docs/01`–`docs/06` atau
  `.claude/rules/project-context.md`. Kalau PRD memang perlu mengubah keputusan
  di sana, tulis eksplisit di **Keputusan yang Sudah Disetujui** dan sebutkan
  bahwa doc tersebut harus ikut diperbarui.
- **Jangan** memasukkan hal dari daftar **Batasan (Tidak Termasuk)** di
  `docs/01-ruang-lingkup.md` ke dalam Scope — tempatnya di Non-Goals.
- Setelah PRD tersimpan, **jangan** tanya "mulai implementasi sekarang?" —
  tunggu instruksi user berikutnya.
