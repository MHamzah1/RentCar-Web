# Grill Me — Wawancara Fitur

Sebelum membangun apa pun, kita samakan pemahaman dulu.

## Tugasmu

Wawancarai user soal fitur atau tugas ini sampai tercapai pemahaman yang sama.

**JANGAN** membuat PRD atau menulis kode sampai user bilang selesai (`done`,
`cukup`, `sudah cukup`, `write the PRD`).

## Output: Selalu Tulis ke Doc (KRITIS)

**Jangan andalkan chat sebagai sumber kebenaran.** Chat ke-compact; docs bertahan.

1. **Buat / update** dokumen grill di awal sesi:
   - Path: `docs/grills/grill-[topik-singkat].md` (kebab-case, mis.
     `docs/grills/grill-tracking-maps.md`)
2. **Setiap pertanyaan dan rekomendasi** masuk ke file itu — bukan cuma di balasan chat.
3. Struktur tiap item:
   - **Pertanyaan**
   - **Rekomendasi** (dengan alasan singkat)
   - **Keputusan user** (`[ ]` pending · `[x]` confirmed · `[~]` skipped)
   - **Catatan** (opsional)
4. **Balasan chat tetap pendek**: status + link ke doc + apa yang perlu
   dikonfirmasi (maks 1–3 bullet).
5. Setelah tiap jawaban user, **update doc langsung** (centang keputusan, tambah catatan).
6. Saat sesi selesai, tambahkan tabel **Log Keputusan** dan tunjuk ke doc
   berikutnya (`docs/prds/prd-[topik].md` lewat `/write-prd`).

Kalau user minta **"langsung semua pertanyaan"** / **"drop all questions"**:
taruh seluruh daftar Q&A di doc grill sekaligus; chat cukup link ke file.
Tetap tidak boleh bikin PRD/kode sampai user bilang selesai.

## Cara

1. **Eksplor codebase dulu**:
   - Pola existing yang relevan (`src/components/`, `src/app/`, `src/lib/`)
   - Implementasi saat ini dari hal-hal terkait
   - Batasan dari stack atau arsitektur
   - `AGENTS.md`, `.claude/rules/project-context.md`, dan dokumen rencana
     `docs/01`–`docs/06`

2. **Baru wawancara**:
   - **Default:** satu pertanyaan **penting** per waktu — rekomendasi dulu,
     tunggu jawaban, **update doc**, lanjut pertanyaan berikutnya.
   - **Kalau user minta:** semua pertanyaan + rekomendasi masuk doc sekaligus.

3. **Kualitas pertanyaan — tanya yang penting saja:**
   - Lewati pertanyaan yang jawabannya sudah ada di repo, di `docs/01`–`docs/06`,
     di grill/PRD sebelumnya, atau di hard rules.
   - Catat hal-hal itu di bagian **Keputusan implisit** (tabel atau bullet),
     bukan ditanyakan ulang.
   - Jangan tanya hal yang jelas atau berisiko rendah kecuali user minta
     pembahasan lengkap.

4. Cakup area berikut **seperlunya** (tidak harus semua, tidak harus urut):
   - **Scope**: apa yang masuk dan tidak
   - **Pengguna**: siapa yang memakai dan butuh apa
   - **Data**: sumber, bentuk, siklus hidupnya
   - **Perilaku**: alur utama, alur alternatif, dan alur gagal
   - **Edge case**: kondisi kosong, hak akses, bentrok bersamaan, data basi/parsial
   - **Dependency**: API, schema, peran, integrasi
   - **Definition of done**: kriteria yang bisa dicek manusia
   - **Constraint**: keamanan, performa, kompatibilitas, deployment
   - **Non-goal**: apa yang sengaja tidak diselesaikan

## Hal Khusus Project Ini

Selalu cek saat merumuskan pertanyaan:

- Apakah fitur ini menyentuh **data pribadi customer** (NIK, dokumen, foto
  rumah)? Kalau ya, tanya soal siapa yang boleh lihat dan di mana disimpan.
- Apakah menyentuh **harga modal**? Pastikan jelas bahwa itu internal saja.
- Apakah bergantung pada item di **Pertanyaan Terbuka**
  (`docs/06-keputusan-teknis.md`) — mis. tracking butuh vendor GPS yang punya
  API? Kalau ya, angkat di awal karena itu bisa memblokir pengerjaan.
- Apakah yang diminta ada di daftar **Batasan (Tidak Termasuk)** di
  `docs/01-ruang-lingkup.md`? Kalau ya, konfirmasi dulu — itu perubahan scope.

## Aturan

- **Doc yang kanonik** — kalau chat dan doc beda, doc menang setelah user konfirmasi.
- Selalu beri rekomendasi dulu, baru tanya setuju atau tidak.
- Jangan asal setuju — uji premis user, sebutkan trade-off, bilang kalau kamu
  tidak akan memilih jalur yang diusulkan.
- Kalau user bilang **"skip"** / **"next"**, lanjut; tulis `[~] skipped` di doc.
- Kalau jawaban kabur, satu follow-up singkat; rekam klarifikasi di **Catatan**.
- Lanjut terus sampai user bilang **"done"**, **"cukup"**, atau **"write the PRD"**.
- Tandai risiko di doc dengan format:

  `⚠️ Potensi masalah: [apa] → [kenapa penting] → [usul solusi]`

- Hormati aturan lokal project (`AGENTS.md`, `.claude/rules/project-context.md`,
  `docs/`) di atas saran generik.

## Terkait

| Setelah grill | Command / output |
|---|---|
| Dokumen requirement | `/write-prd` → `docs/prds/prd-[topik].md` |
| Backlog | `/prd-to-issues` |
| Standar implementasi | `.claude/rules/project-context.md`, `AGENTS.md` |
| Detail API Next.js | `/next16` |
