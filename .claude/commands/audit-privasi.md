# Audit Privasi & Kebocoran Data

Audit khusus untuk dua hal yang paling berbahaya di project ini:
**data pribadi customer** dan **harga modal**.

## Kenapa command ini ada

Modul Customer menyimpan data yang kalau bocor bukan sekadar bug: NIK, KK, SIM,
NPWP, foto KTP, foto depan rumah, link lokasi rumah, dan nomor kontak darurat.
Di sisi lain, harga modal per hari adalah informasi bisnis yang tidak boleh
dilihat customer.

Keduanya ada di database yang sama dengan landing page publik, jadi jaraknya
cuma satu `props` yang salah.

## Kapan Dipakai

- Sebelum deploy
- Setelah menambah field baru ke Customer atau Car
- Setelah menyentuh halaman publik yang mengambil data dari database
- User bilang: audit privasi, cek kebocoran, aman tidak datanya

## 1. Harga modal

Yang boleh publik hanya `sellPricePerDay`. Yang **tidak boleh**:
`costPricePerDay`, `totalCost`, `profit`.

```bash
rg -n "costPrice|hargaModal|totalCost|profit" src/app src/components
```

Cek tiap temuan:

- Ada di route publik (`src/app/page.tsx`, `src/app/vehicles/**`, `about`, `contact`)? → **critical**
- Ikut terkirim sebagai props ke Client Component publik? → **critical**
  (data yang dikirim ke Client Component ikut masuk ke HTML/bundle — bisa dibaca
  siapa pun lewat view-source)
- Query publik yang `select *` dari tabel Car tanpa memilih kolom → **high**,
  gampang bocor tanpa sadar

**Pola aman:** query publik hanya memilih kolom yang memang publik, jangan
mengandalkan komponen untuk "tidak menampilkan" kolom sensitif.

## 2. Data pribadi customer

```bash
rg -n "nik|noKk|sim|npwp|emergency|housePhoto|mapsLink|birthDate" src/app src/components -i
```

Cek:

- Muncul di route publik mana pun → **critical**
- Terkirim ke Client Component yang tidak butuh → **high**
- Ikut di response API yang tidak dijaga sesi → **critical**
- Dipakai di `console.log` → **high** (lihat `/logging`)

## 3. Penyimpanan file dokumen

```bash
ls public/
rg -n "public/(uploads|documents|ktp)" src/
```

Aturan:

- Dokumen customer **tidak boleh** ada di `public/` — apa pun di situ bisa
  diakses siapa saja yang tahu/menebak URL-nya
- Nama file jangan bisa ditebak (`ktp-1.jpg`, `customer-2/ktp.jpg` = buruk)
- Akses lewat signed URL yang ada masa berlakunya, atau lewat route handler yang
  mengecek sesi admin dulu

## 4. Secret & environment variable

```bash
rg -n "NEXT_PUBLIC_" src/ .env* 2>/dev/null
```

Semua `NEXT_PUBLIC_*` **ikut ke browser**. Yang boleh: kunci peta yang memang
untuk client (dan sudah dibatasi domain di dashboard vendor). Yang **tidak
boleh**: connection string database, API key OCR, kredensial storage, secret
sesi.

Cek juga: file `.env*` masuk `.gitignore`? Ada secret yang terlanjur ter-commit?

```bash
git check-ignore -v .env .env.local 2>/dev/null
rg -n "(api[_-]?key|secret|password)\s*[:=]\s*['\"]" src/ -i
```

## 5. Proteksi route admin

- Setiap `src/app/admin/**/page.tsx` dan `src/app/api/**/route.ts` yang
  mengembalikan data internal harus mengecek sesi **di server**
- Menyembunyikan menu di client bukan proteksi
- Proxy (dulu Middleware) sebagai lapis pertama itu bagus, tapi jangan jadi
  satu-satunya — cek juga di halaman/handler-nya

## Output

```markdown
# Audit Privasi — RentCar

**Status:** [AMAN / ADA TEMUAN — n critical, n high]

## Critical
- **[judul]** — `path:line` — data apa yang bocor ke mana — cara fix

## High
- …

## Medium / catatan
- …

## Sudah benar
- [ringkas, biar jelas apa yang sudah dicek dan lolos]
```

## Aturan

- Chat only kecuali user minta file.
- Jangan mulai fix sebelum user minta — kecuali temuan critical, boleh langsung
  usulkan patch-nya di jawaban.
- Kalau ragu apakah sebuah field sensitif, perlakukan sebagai sensitif.
- Jangan menaruh contoh data pribadi asli di laporan — sebut nama field-nya saja.
