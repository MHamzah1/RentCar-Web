# 04 — Landing Page

## Peran Landing Page

Landing page adalah **etalase**, bukan sistem pemesanan. Tugasnya hanya dua:

1. Menampilkan mobil yang tersedia beserta harga sewa per hari
2. Mengarahkan calon customer ke WhatsApp admin

**Proses booking seluruhnya lewat WhatsApp.** Tidak ada form pemesanan yang
tersimpan, tidak ada akun customer, tidak ada pembayaran.

## Alur Booking via WhatsApp

1. Customer melihat produk (mobil) di landing page
2. Customer menekan tombol booking pada mobil tersebut
3. Website membuka WhatsApp dengan pesan yang sudah terisi berisi info mobil
4. Percakapan diarahkan ke nomor admin: **081574865632**
5. Setelah deal, admin yang menginput ke sistem (lihat
   [02 — Alur Bisnis](02-alur-bisnis.md))

### Format tautan WhatsApp

```
https://wa.me/6281574865632?text=<pesan yang sudah di-URL-encode>
```

Nomor ditulis format internasional: `0815...` → `62815...` (tanpa `+`, tanpa
`0` di depan).

Contoh pesan:

> Halo Admin RentCar, saya tertarik menyewa **Toyota Avanza 2022**
> (Rp 350.000/hari). Apakah masih tersedia?

Tombol booking ini dipasang di:

- Kartu mobil di halaman katalog (`/vehicles`)
- Halaman detail mobil (`/vehicles/[slug]`)
- Kartu mobil populer di halaman Home

## Perubahan dari Kondisi Sekarang

Landing page sudah jadi, tetapi masih memakai data dummy dan asumsi yang tidak
sesuai dengan rencana ini. Yang perlu disesuaikan:

| Kondisi sekarang | Perlu menjadi |
|---|---|
| Data mobil hardcode di [src/lib/data.ts](../src/lib/data.ts) | Dibaca dari database yang dikelola modul Katalog Mobil |
| Harga dalam USD (`$89`) | Rupiah, format `Rp 350.000` per hari |
| Form "Book your car" mengarah ke `/vehicles` | Tombol booking mengarah ke WhatsApp admin |
| Form kontak hanya simulasi sukses | Diarahkan ke WhatsApp, atau tersimpan sebagai pesan masuk di admin |
| Tidak ada info ketersediaan | Menampilkan status tersedia / tidak (dari unit tersedia) |
| Nomor telepon dummy `+62 812-3456-789` | Nomor admin asli **081574865632** |
| Foto dari Unsplash | Foto mobil asli yang diunggah lewat admin |

## Yang Tampil & Tidak Tampil

| Data | Tampil di publik? |
|---|---|
| Nama mobil, foto, spesifikasi, deskripsi | Ya |
| **Harga jual per hari** | Ya |
| **Harga modal per hari** | **Tidak — internal saja** |
| Status tersedia / tidak tersedia | Ya |
| Jumlah unit persisnya | Opsional, boleh cukup "Tersedia / Tidak tersedia" |
| Data customer, dokumen, jaminan | **Tidak, tidak pernah** |
