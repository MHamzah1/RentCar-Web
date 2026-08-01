# Revisi — Pendalaman

Sebelum ngoding apa pun, kita samakan pemahaman dulu soal revisi ini.

## Tugasmu

User memberi daftar revisi untuk fitur yang **sudah ada** (mis. landing page, cek ongkir, tracking).
Tugasmu: rekam daftar itu ke docs, lalu **wawancara mendalam** sampai scope-nya jelas betul.

**JANGAN** menulis kode, mengubah file aplikasi, atau mulai implementasi di command ini — itu tugas
`/revisi-kerjakan`. Command ini berhenti begitu dokumen revisi matang.

## Output: Selalu Tulis ke Doc (KRITIS)

**Jangan andalkan chat sebagai sumber kebenaran.** Chat ke-compact; docs bertahan.

1. **Buat / update** dokumen revisi di awal sesi:
   - Path: `docs/revisi/revisi-[topik].md` (kebab-case, mis. `docs/revisi/revisi-landing-page.md`)
   - Semua dokumen revisi tinggal di folder `docs/revisi/`. Catatan/learning dari `/revisi-kerjakan`
     masuk ke subfolder `docs/revisi/note/`.
2. **Setiap pertanyaan & rekomendasi** masuk ke file itu — bukan cuma di balasan chat.
3. Balasan chat tetap **pendek**: status + link ke doc + apa yang perlu dikonfirmasi (maks 1–3 bullet).
4. Setelah tiap jawaban user, **update doc langsung** (centang keputusan, tambah catatan).

### Struktur dokumen revisi

```markdown
# Revisi: [topik]

## Daftar Revisi (mentah)
Salin persis daftar dari user, apa adanya (poin logo, wallpaper Hero, dll.).

## Konteks
Fitur mana yang direvisi, file/area terkait (hasil eksplorasi singkat).

## Referensi Mockup
Untuk revisi UI: folder screenshot/mockup yang dirujuk user + daftar file mockup relevan
(temukan foldernya, jangan asumsi). Kalau tidak ada revisi UI, tulis "N/A".

## Q&A Pendalaman
Tiap item:
- **Pertanyaan**
- **Rekomendasi** (alasan singkat)
- **Keputusan user** (`[ ]` pending / `[x]` confirmed)
- **Catatan**

## Keputusan Terkunci
Ringkasan keputusan final yang sudah dikonfirmasi. Ini jadi acuan `/revisi-kerjakan`.

## File Terdampak (perkiraan)
Path nyata yang kemungkinan berubah. Tandai file baru secara eksplisit.

## Checklist Definition of Done
Kriteria checkable per poin revisi. Bisa diverifikasi manusia < 5 menit.
- [ ] kriteria 1
- [ ] kriteria 2
```

## Cara

1. **Eksplor dulu** sebelum bertanya:
   - Baca `.claude/rules/project-context.md` + doc relevan di `docs/`
     (mis. `docs/03-modul-admin.md`, `docs/04-landing-page.md`, `docs/05-model-data.md`).
   - Baca kode fitur yang direvisi di `src/`.
   - Untuk revisi UI: **temukan folder screenshot/mockup** yang dirujuk user dan daftar file-nya.
2. **Wawancara**:
   - **Default:** satu pertanyaan per waktu — rekomendasi dulu, tunggu jawaban, **update doc**, lanjut.
   - **Kalau user minta "langsung semua pertanyaan":** taruh seluruh Q&A di doc sekaligus; chat cukup link ke file.
3. Cakup area ini (tak harus urut): Scope (in/out), pengguna & kebutuhan, data, edge case,
   dependency, definition of done, constraint (perf/security/pola existing), dan yang **tidak** dikerjakan.

## Cek Hard Rules Saat Merumuskan

Kalau revisi berpotensi melanggar salah satu ini, **flag di doc** (`⚠️ ...`) dan tanyakan:

- Harga modal (`costPricePerDay`) **tidak boleh** sampai ke sisi publik.
- Data pribadi customer (NIK, dokumen, foto rumah, kontak darurat) tidak pernah
  ke landing page; dokumen tidak disimpan di `public/`.
- Booking customer lewat **WhatsApp** (`wa.me/6281574865632`) — bukan form yang
  persist di landing page.
- Harga di transaksi adalah **snapshot**, bukan join ke harga katalog terkini.
- Stok unit **dihitung** dari transaksi aktif, bukan counter yang di-decrement.
- Status transaksi hanya `BOOKING → ON_TRIP → DONE`.
- Semua `/admin/*` wajib dicek sesinya di server.
- Kode Next.js ditulis setelah baca `node_modules/next/dist/docs/` (lihat `/next16`).
- Jangan edit `CLAUDE.md` / `AGENTS.md`.
- Jangan mengerjakan hal di daftar batasan `docs/01-ruang-lingkup.md`.

Sumber lengkap: `.claude/rules/project-context.md`.

## Khusus Revisi UI

- Ikuti mockup di folder screenshot yang dirujuk user — jangan mengarang tampilan.
- **Jangan** bangun design system baru; ikuti pola komponen existing di
  `src/components/` dan token Tailwind di `src/app/globals.css`.
- Pastikan revisi tidak merusak halaman publik yang sudah jalan (Home, Vehicles,
  Car Details, About, Contact) — catat sebagai kriteria di Checklist DoD.

## Aturan

- **Doc yang kanonik** — kalau chat & doc beda, doc menang setelah user konfirmasi.
- Selalu beri rekomendasi dulu, baru tanya setuju atau tidak.
- Kalau user bilang **"skip"** / **"next"**, lanjut; tulis `skipped` di doc.
- Kalau jawaban kabur, satu follow-up; rekam klarifikasi di **Catatan**.
- Lanjut terus sampai user bilang **"done"**, **"that's enough"**, atau **"cukup"**.
- **Gate:** begitu doc matang & user bilang `done`, **berhenti**. Jangan mulai implementasi.

## Terkait

| Setelah pendalaman | Command / output |
|--------------------|------------------|
| Eksekusi revisi    | `/revisi-kerjakan` → baca `docs/revisi/revisi-[topik].md` lalu implementasi |
| Standar implementasi | `.claude/rules/project-context.md` |
| API Next.js         | `/next16` |
