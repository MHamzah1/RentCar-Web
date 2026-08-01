# 01 — Ruang Lingkup

## Yang Dibangun

Project ini terdiri dari **dua aplikasi dalam satu codebase**:

### A. Landing Page (publik)

Etalase online. Fungsinya menampilkan katalog mobil beserta harga jual per hari,
lalu mengarahkan calon customer ke WhatsApp admin untuk proses booking.

Landing page **tidak** memproses booking. Tidak ada form pemesanan yang
tersimpan ke database, tidak ada akun customer, tidak ada pembayaran online.

### B. Admin Internal (backoffice)

Aplikasi kerja harian admin rental. Semua transaksi diinput manual oleh admin
setelah kesepakatan terjadi di WhatsApp. Modulnya:

| No | Modul | Tujuan |
|---|---|---|
| 1 | Login Admin | Membatasi akses ke kebutuhan internal RentCar saja |
| 2 | Katalog Mobil & Pricing | Mendaftarkan mobil, harga jual, harga modal, jumlah unit |
| 3 | Transaksi | Mencatat booking sampai mobil selesai disewa |
| 4 | Customer | Menyimpan data penyewa, dokumen, lokasi, dan jaminan |
| 5 | Tracking Maps Car | Melihat posisi mobil di peta |
| 6 | Export Transaksi | Mengunduh rekap transaksi ke Excel per rentang tanggal |

## Batasan (Tidak Termasuk)

Hal-hal berikut **di luar lingkup** versi ini, supaya jelas sejak awal:

- Booking mandiri oleh customer lewat website
- Login / akun untuk customer
- Pembayaran online (payment gateway)
- Aplikasi mobile
- Notifikasi otomatis ke customer (WhatsApp blast, email, SMS)
- Multi-cabang / multi-perusahaan

Kalau nanti dibutuhkan, dicatat sebagai fase berikutnya — bukan diselipkan ke
lingkup sekarang.

## Kondisi Project Saat Ini

Yang **sudah ada** di repo (lihat [README.md](../README.md) di root):

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript strict
- Halaman publik: Home, Vehicles, Car Details, About, Contact, 404
- 12 mobil dummy di [src/lib/data.ts](../src/lib/data.ts), foto dari Unsplash
- Form booking & form kontak masih simulasi sisi klien, tanpa backend

Yang **belum ada** dan dibutuhkan untuk rencana ini:

- Database dan lapisan persistensi (semua data masih hardcode di satu file TS)
- Autentikasi admin
- Seluruh area `/admin`
- Harga dalam Rupiah (data dummy saat ini pakai USD)
- Tombol yang mengarah ke WhatsApp admin
- Konsep unit/stok mobil (data dummy tidak punya jumlah unit)

## Prinsip Kerja

1. **Sumber kebenaran ada di admin, bukan di landing page.** Landing page hanya
   membaca data yang dikelola dari modul Katalog Mobil.
2. **Admin yang menginput, bukan customer.** Semua transaksi lahir dari tangan
   admin setelah deal di WhatsApp.
3. **Data customer dipakai ulang.** Customer langganan tidak perlu diinput
   berkali-kali.
