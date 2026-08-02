# Dokumentasi RentCar

Kumpulan dokumen perencanaan fitur untuk project **rentcar-web**. Isinya adalah
rencana fitur yang **akan diterapkan** — bukan dokumentasi dari yang sudah jadi.

## Daftar Isi

| Dokumen | Isi |
|---|---|
| [01 — Ruang Lingkup](01-ruang-lingkup.md) | Apa yang dibangun, batasan, kondisi project saat ini |
| [02 — Alur Bisnis](02-alur-bisnis.md) | Perjalanan end-to-end dari customer lihat website sampai mobil kembali |
| [03 — Modul Admin Internal](03-modul-admin.md) | Spesifikasi 6 modul admin secara detail |
| [04 — Landing Page](04-landing-page.md) | Perubahan yang dibutuhkan di halaman publik |
| [05 — Model Data](05-model-data.md) | Draft entitas & field untuk database |
| [06 — Keputusan Teknis](06-keputusan-teknis.md) | Pilihan teknologi, rekomendasi, dan hal yang belum diputuskan |

## Ringkasan Satu Paragraf

RentCar punya dua sisi. **Landing page** adalah etalase publik: customer melihat
katalog mobil dan harga sewa per hari, lalu menekan tombol booking yang
mengarahkan mereka ke WhatsApp admin (**081574865632**). Tidak ada booking
mandiri (self-service) di website — semua kesepakatan terjadi di WhatsApp.
**Admin internal** adalah backoffice tempat admin memasukkan hasil kesepakatan
itu ke sistem: memilih mobil dari katalog, mengisi/memilih data customer,
mencatat jaminan dan DP, lalu membuat transaksi. Saat mobil berangkat admin
wajib mengunggah video kondisi awal unit. Kalau lewat batas kembali, status
otomatis jadi Lewat Waktu, denda Rp 50.000/jam berjalan, dan admin bisa
memperpanjang sewa. Admin juga melacak posisi mobil di peta dan meng-export
rekap transaksi ke Excel berdasarkan rentang tanggal.

Ada dua peran: **Super Admin (Owner)** yang bisa melihat harga modal dan laba,
dan **Admin (Staf)** yang tidak.

## Enam Modul Admin

1. **Login Admin** — autentikasi untuk kebutuhan internal
2. **Katalog Mobil & Pricing** — data mobil, harga jual, harga modal, jumlah unit
3. **Transaksi** — proses booking sampai mobil selesai disewa
4. **Customer** — data penyewa, dokumen, lokasi, dan jaminan
5. **Tracking Maps Car** — pelacakan posisi mobil di peta
6. **Export Transaksi (Excel)** — rekap per rentang tanggal (harian/bulanan/bebas)

> Catatan revisi: dokumen ini dibuat 1 Agustus 2026 berdasarkan catatan fitur
> dari pemilik project. Setiap perubahan lingkup sebaiknya diperbarui di sini
> dulu sebelum masuk ke kode.
