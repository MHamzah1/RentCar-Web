# .claude — Konfigurasi Claude Code

Setup slash command dan aturan project untuk **RentCar** (landing page +
admin internal).

## Struktur

```
.claude/
├── commands/              # Slash commands
│   ├── next16.md          → /next16          Baca docs Next.js sebelum ngoding
│   ├── buat-fitur.md      → /buat-fitur      Bangun satu fitur end-to-end
│   ├── grill-me.md        → /grill-me        Wawancara fitur sampai jelas
│   ├── write-prd.md       → /write-prd       Tulis PRD dari hasil grill
│   ├── prd-to-issues.md   → /prd-to-issues   Pecah PRD jadi backlog
│   ├── revisi.md          → /revisi          Pendalaman revisi fitur existing
│   ├── revisi-kerjakan.md → /revisi-kerjakan Eksekusi dokumen revisi
│   ├── check-progress.md  → /check-progress  Audit progress vs docs
│   ├── check-issues.md    → /check-issues    Audit bug & penyimpangan
│   ├── audit-privasi.md   → /audit-privasi   Audit kebocoran data & harga modal
│   └── logging.md         → /logging         Konvensi log & audit console.log
└── rules/
    └── project-context.md # Stack, hard rules, larangan, cara verifikasi
```

## Alur Kerja yang Disarankan

**Fitur baru**

```
/grill-me  →  /write-prd  →  /prd-to-issues  →  /buat-fitur (per issue)
```

Untuk fitur kecil yang requirement-nya sudah jelas, langsung `/buat-fitur`.

**Revisi fitur yang sudah ada**

```
/revisi  →  /revisi-kerjakan
```

**Sebelum deploy**

```
/check-progress  →  /check-issues  →  /audit-privasi  →  /logging
```

## Slash Commands

| Command | Untuk apa |
|---|---|
| `/next16` | Buka dokumentasi Next.js 16 yang ter-bundle di `node_modules` sebelum menulis kode. **Wajib** menurut `AGENTS.md` |
| `/buat-fitur` | Bangun satu fitur dari nol sampai bisa dicoba di browser |
| `/grill-me` | Wawancara fitur baru sampai pemahaman sama, hasilnya ke `docs/grills/` |
| `/write-prd` | Ubah hasil grill jadi PRD di `docs/prds/` |
| `/prd-to-issues` | Pecah PRD jadi issue irisan vertikal di `docs/issues/` |
| `/revisi` | Pendalaman daftar revisi, hasilnya ke `docs/revisi/` |
| `/revisi-kerjakan` | Implementasi dari dokumen revisi yang sudah matang |
| `/check-progress` | Audit sejauh mana fitur jalan vs `docs/03` & `docs/04` |
| `/check-issues` | Audit bug, kebocoran, dan penyimpangan dari docs/rules |
| `/audit-privasi` | Audit khusus data pribadi customer & harga modal |
| `/logging` | Konvensi log dan audit `console.log` sebelum deploy |

## Rules

`rules/project-context.md` adalah **sumber kebenaran hard rules**: stack yang
dipakai, aturan yang tidak boleh dilanggar (harga modal, data pribadi, snapshot
harga, proteksi `/admin`), larangan, dan cara verifikasi sebelum lapor selesai.

Semua command merujuk ke file itu. Kalau ada aturan baru yang disepakati, tulis
di sana — jangan disebar ke tiap command.

## Docs Project

Rencana fitur ada di [`docs/`](../docs/README.md):

| Doc | Isi |
|---|---|
| `docs/01-ruang-lingkup.md` | Scope & batasan |
| `docs/02-alur-bisnis.md` | Alur end-to-end |
| `docs/03-modul-admin.md` | Spesifikasi 6 modul admin |
| `docs/04-landing-page.md` | Halaman publik |
| `docs/05-model-data.md` | Entitas & field |
| `docs/06-keputusan-teknis.md` | Pilihan teknologi + pertanyaan terbuka |

Folder yang dibuat command saat dipakai: `docs/grills/`, `docs/prds/`,
`docs/issues/`, `docs/revisi/`.
