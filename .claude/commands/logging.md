# Logging

Konvensi log untuk project Next.js ini. Belum ada library logger — aturannya
sengaja sederhana, yang penting **tidak ada data pribadi yang bocor ke log**.

## Kapan Dipakai

Menyentuh: logging, `console.log`, debug trace, error handling, atau audit log
sebelum deploy.

## Pohon Keputusan (30 detik)

1. **Debug sementara saat development** → boleh `console.log`, tapi **wajib**
   diberi penanda `// DEV-LOG` dan dihapus sebelum selesai.
2. **Error yang perlu terlihat di server** → `console.error` dengan format
   terstruktur (lihat di bawah).
3. **Error yang ditampilkan ke user** → lempar/tangani lewat error boundary
   Next.js (`error.tsx`), jangan tampilkan stack trace ke user.
4. **Jejak bisnis penting** (siapa membuat/mengubah transaksi) → simpan ke
   database sebagai kolom (`createdByAdminId`, `updatedAt`), bukan ke stdout.
5. **Script seed/migrasi** → `console.log` bebas, itu CLI.

## Wajib patuh

**Jangan pernah masuk ke log:**

- NIK, nomor KK, nomor SIM, NPWP
- Isi/URL dokumen customer, foto KTP, foto rumah
- Nomor HP dan nomor darurat lengkap
- Password, hash password, token sesi, API key (maps, OCR, storage)
- Koordinat lokasi rumah customer

Log **ID**, bukan data. `{ customerId: 12 }` — bukan `{ nik, fullName, phone }`.

**Jangan tinggalkan `console.log` di kode yang di-commit** selain error
terstruktur. Debug log dihapus, bukan dikomentari.

## Format error terstruktur

```typescript
console.error("transaction.create_failed", {
  operation: "transaction.create",
  customerId,
  carId,
  cause: err instanceof Error ? err.message : String(err),
});
```

Penamaan `operation`: `domain.action` huruf kecil.
Contoh: `transaction.create_failed`, `auth.login_invalid_password`,
`ktp.ocr_failed`, `export.excel_generate_failed`, `tracking.fetch_position_failed`.

## Alur Kerja: audit log sebelum deploy

```bash
rg -n "console\.(log|debug)" src/ --glob "!**/*.test.*"
rg -n "DEV-LOG" src/
rg -n "console\.(log|error|warn).*\b(nik|password|token|phone|ktp)\b" src/ -i
```

Klasifikasi temuan:

| Temuan | Aksi |
|---|---|
| Debug trace / `DEV-LOG` | Hapus |
| Error operasional | Ubah jadi `console.error` terstruktur |
| Log berisi data pribadi | **Hapus atau ganti jadi ID** — prioritas tertinggi |
| Di script seed/migrasi | Biarkan |

## Di Luar Scope

Jangan mengusulkan atau memasang Winston / Pino / Sentry / Datadog kecuali user
minta. Kalau nanti benar-benar butuh logger terstruktur, itu keputusan yang
dicatat dulu di `docs/06-keputusan-teknis.md`.

## Setelah mengubah kode

Jalankan `npm run build` dan `npm run lint`.
