# PRD to Issues — Pecah PRD jadi Backlog

Ubah dokumen tujuan jadi backlog yang bisa dikerjakan.

## Tugasmu

Baca PRD lalu pecah jadi issue-issue yang bisa diambil secara mandiri, memakai
**irisan vertikal** (vertical slice). Tiap issue harus bisa dikerjakan satu
orang (atau satu agent) tanpa menunggu issue lain — kecuali memang ada
dependensi yang jelas.

## Langkah

1. Baca PRD dari `docs/prds/prd-[fitur].md`.
2. Telusuri codebase untuk memahami struktur modul yang disebut di PRD
   (`src/app/`, `src/components/`, `src/lib/`).
3. Susun draft issue irisan vertikal (lihat aturan di bawah).
4. Tanya **SATU** pertanyaan kalau pemecahannya masih tidak jelas, sebelum
   difinalkan.
5. Simpan tiap issue sebagai `docs/issues/issue-XX-[nama-singkat].md`.
6. Tampilkan ringkasan dependensi berisi urutan pengerjaan.

## Aturan Irisan Vertikal

Irisan vertikal memotong **seluruh lapisan** stack untuk satu potong
fungsionalitas yang terlihat oleh pengguna.

Lapisan di project ini: data/tipe di `src/lib/` → Server Component
`src/app/**/page.tsx` → Server Action atau `src/app/api/**/route.ts` →
komponen UI di `src/components/`.

✅ Irisan vertikal yang baik:
- Menyentuh data/schema + logika + halaman/route + UI
- Menghasilkan sesuatu yang **terlihat atau bisa dicoba** di akhir
- Bisa di-QA manusia secara terpisah

❌ Irisan horizontal (buruk):
- "Bikin semua schema database dulu"
- "Bangun semua endpoint API dulu, UI belakangan"
- Irisan yang tidak menghasilkan apa pun sampai fase ketiga

**Tes cepat:** di akhir issue ini, apakah seseorang bisa membuka browser (atau
memanggil endpoint) dan memverifikasi sesuatu jalan end-to-end? Kalau tidak →
terlalu horizontal, pecah dengan cara lain.

## Struktur File Issue

```markdown
# Issue [XX]: [Judul Singkat]

## Tujuan
Satu kalimat: issue ini menghasilkan apa?

## Tipe
AFK (agent bisa jalan sendiri) atau
Human-in-the-loop (butuh review/keputusan di tengah jalan)

## Diblokir Oleh
- Issue XX (alasan)
Atau: "Tidak ada — bisa langsung dikerjakan"

## User Story yang Dicakup
Daftar user story dari PRD yang dijawab issue ini.

## Ruang Lingkup

### File Baru
- `path/ke/file-baru.ext` — untuk apa

### File yang Diubah
- `path/ke/file-existing.ext` — apa yang berubah

### Eksplisit Di Luar Scope
Apa yang **tidak** ditangani issue ini (walau terkait).

## Tugas
Langkah implementasi berurutan:
1. Baca guide terkait di `node_modules/next/dist/docs/` (lihat `/next16`)
2. Implementasi [X] di `src/lib/` (data/logika)
3. Sambungkan ke halaman / route handler
4. Tambahkan [Y] ke UI
5. Jalankan feedback loop: `npm run build`, `npm run lint`, coba di browser

## Kriteria Penerimaan
Kondisi yang bisa dicek. Manusia harus bisa memverifikasi tiap poin
dalam < 5 menit.
- [ ] kriteria 1
- [ ] kriteria 2

## Definition of Done
- [ ] Semua kriteria penerimaan lolos
- [ ] `npm run build` hijau (ini sekaligus type-check)
- [ ] `npm run lint` bersih
- [ ] Tidak ada kode debug / `console.log` tertinggal (lihat `/logging`)
- [ ] Tidak melanggar hard rule (`.claude/rules/project-context.md`)
- [ ] Ada sesuatu yang terlihat/bisa dicoba end-to-end di browser
```

> Project ini **belum punya test runner**. Jangan otomatis menambahkan tugas
> "tulis test". Kalau sebuah irisan menyentuh perhitungan uang atau transisi
> status transaksi dan memang layak dites, angkat sebagai pertanyaan terbuka —
> jangan memasang framework test tanpa diminta.

## Dependensi & Urutan Pengerjaan

Setelah semua file issue dibuat, tampilkan ringkasan ini:

```
Fase 1 (tanpa dependensi):
  Issue 01 — [nama]

Fase 2 (setelah Fase 1):
  Issue 02 — [nama]
  Issue 03 — [nama]  ← bisa paralel dengan 02

Fase 3 (setelah Fase 2):
  Issue 04 — [nama]
```

## Aturan

- Ukuran minimal irisan: yang bisa diselesaikan dev fokus dalam setengah hari.
- Ukuran maksimal irisan: yang bisa diselesaikan dev fokus dalam 2 hari.
- Kalau satu irisan terlalu besar, **pecah** — jangan digabung demi mengurangi
  jumlah issue.
- Issue pertama **selalu** tracer bullet: irisan tipis yang menembus semua
  lapisan dan menghasilkan sesuatu yang terlihat.
- Beri label AFK atau Human-in-the-loop dengan jujur:
  - **AFK** = requirement jelas, tidak ada keputusan desain di tengah jalan
  - **Human** = pilihan ambigu, estetika UI, dependensi eksternal
- Untuk project ini, tandai **Human-in-the-loop** kalau issue menyentuh:
  data pribadi customer, penyimpanan dokumen, integrasi OCR, vendor GPS
  tracking, atau pemilihan library baru.
- Setelah file issue tersimpan, **jangan** mulai implementasi — tunggu
  instruksi user.
