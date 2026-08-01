# Next 16 — Cek Docs Sebelum Ngoding

Buka dokumentasi Next.js yang ter-bundle di project untuk topik tertentu,
sebelum menulis kode.

## Kenapa command ini ada

`AGENTS.md` project ini bilang:

> This version has breaking changes — APIs, conventions, and file structure may
> all differ from your training data. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing any code.

Artinya: **jangan menulis kode Next.js dari ingatan atau tutorial lama.**
Dokumentasi versi yang benar-benar terpasang ada di dalam `node_modules`.

## Kapan Dipakai

Sebelum menyentuh: routing, layout, data fetching, mutasi/form, caching,
autentikasi, route handler, proxy (dulu middleware), image, metadata, atau
apa pun yang bersinggungan dengan API Next.js.

## Cara

1. **Cari guide yang relevan** dulu — jangan langsung buka file acak:

```bash
ls node_modules/next/dist/docs/01-app/01-getting-started/
ls node_modules/next/dist/docs/01-app/02-guides/
rg -l "<kata kunci>" node_modules/next/dist/docs/
```

2. **Baca guide-nya**, lalu baca API reference terkait di
   `node_modules/next/dist/docs/01-app/03-api-reference/` kalau perlu detail
   signature.
3. Baru tulis kode.
4. Kalau ada perbedaan dengan kebiasaan lama, **sebutkan di jawaban** supaya
   user tahu (contoh: "Middleware sekarang bernama Proxy").

## Peta Cepat Topik → File

| Kebutuhan | File |
|---|---|
| Struktur folder & konvensi file | `01-app/01-getting-started/02-project-structure.md` |
| Layout & halaman | `01-app/01-getting-started/03-layouts-and-pages.md` |
| Server vs Client Component | `01-app/01-getting-started/05-server-and-client-components.md` |
| Ambil data | `01-app/01-getting-started/06-fetching-data.md` |
| Simpan/ubah data, Server Actions | `01-app/01-getting-started/07-mutating-data.md` |
| Caching | `01-app/01-getting-started/08-caching.md` |
| Revalidasi setelah data berubah | `01-app/01-getting-started/09-revalidating.md` |
| Error handling | `01-app/01-getting-started/10-error-handling.md` |
| Gambar & upload | `01-app/01-getting-started/12-images.md` |
| Metadata / SEO | `01-app/01-getting-started/14-metadata-and-og-images.md` |
| API endpoint (mis. export Excel) | `01-app/01-getting-started/15-route-handlers.md` |
| **Proxy — dulu Middleware** | `01-app/01-getting-started/16-proxy.md` |
| Login & proteksi route | `01-app/02-guides/authentication.md` |
| Form & validasi | `01-app/02-guides/forms.md` |
| Environment variable | `01-app/02-guides/environment-variables.md` |
| Backend di dalam Next | `01-app/02-guides/backend-for-frontend.md` |
| Keamanan data ke client | `01-app/02-guides/data-security.md` |

Semua path relatif terhadap `node_modules/next/dist/docs/`.

## Yang Sudah Diketahui Berubah

| Dulu | Sekarang (Next.js 16) |
|---|---|
| `middleware.ts` / "Middleware" | **Proxy** — fungsinya sama, namanya beda |

Kalau menemukan perubahan lain saat membaca docs, **tambahkan ke tabel ini**
supaya sesi berikutnya tidak mengulang riset yang sama.

## Aturan

- Jangan menjawab "ini sudah benar" soal API Next.js tanpa membuka docs-nya.
- Kutip path file docs yang kamu baca di jawaban, supaya bisa dicek user.
- Kalau docs bundled tidak membahas kasusnya, bilang apa adanya — jangan
  mengarang API.
