# 03 — Modul Admin Internal

Seluruh modul berada di bawah route `/admin` dan hanya bisa diakses setelah
login.

---

## 1. Login Admin

**Tujuan:** membatasi akses aplikasi ke staf internal RentCar.

### Kebutuhan

- Halaman login dengan email/username + password
- Sesi login bertahan (session/cookie), ada tombol logout
- Semua route `/admin/*` diblokir untuk yang belum login dan diarahkan ke
  halaman login
- Password disimpan dalam bentuk hash, tidak pernah plaintext

### Catatan

- Untuk tahap awal cukup **satu peran: Admin**. Kalau nanti ada Owner (bisa
  lihat harga modal & laba) vs Staf (tidak), itu ditambahkan belakangan.
- Belum ada pendaftaran mandiri — akun admin dibuat manual (seed / oleh admin
  yang sudah ada).

---

## 2. Katalog Mobil & Pricing

**Tujuan:** mendaftarkan mobil yang disewakan, sekaligus menjadi sumber data
yang tampil di landing page.

### Data yang diinput

| Field | Keterangan |
|---|---|
| Nama mobil | Contoh: Toyota Avanza 2022 |
| Kategori | Sedan / SUV / MPV / Minivan / Pickup / dll. |
| Foto | Satu foto utama + galeri |
| Spesifikasi | Transmisi, bahan bakar, jumlah kursi, jumlah pintu, AC |
| Deskripsi | Teks bebas untuk landing page |
| **Harga jual per hari** | Harga ke customer — **ini yang tampil di landing page** |
| **Harga modal per hari** | Biaya sewa unit dari pemilik/vendor — **internal saja** |
| **Jumlah unit** | Berapa unit yang dimiliki untuk mobil ini |
| Status tampil | Apakah mobil ini muncul di landing page atau tidak |

### Aturan harga

- **Harga jual** adalah satu-satunya harga yang boleh keluar ke publik.
- **Harga modal** hanya terlihat di admin. Selisihnya (`harga jual − harga
  modal`) adalah margin per hari, dipakai untuk menghitung laba di rekap
  transaksi.
- Perubahan harga tidak boleh mengubah transaksi yang sudah terjadi — harga
  yang dipakai saat booking **dikunci (snapshot)** di record transaksi.

### Ketersediaan unit

- Setiap mobil punya **jumlah unit total**.
- **Unit tersedia** = unit total − jumlah transaksi berstatus *Booking* atau
  *Sedang Perjalanan* untuk mobil tersebut.
- Saat status transaksi menjadi **Selesai**, unit kembali tersedia.
- Kalau unit tersedia = 0, mobil ditandai **Tidak tersedia** dan admin tidak
  bisa membuat booking baru untuk mobil itu.

### Aksi di halaman katalog admin

- Tambah / ubah / hapus mobil
- Melihat jumlah unit tersedia per mobil
- **Tombol "Booking"** pada tiap mobil → membuka form Transaksi baru dengan
  data mobil terisi otomatis (ini adalah pintu masuk utama pembuatan transaksi)

---

## 3. Customer

**Tujuan:** menyimpan data penyewa satu kali, lalu dipakai ulang di transaksi
berikutnya.

### 3.1 Cara input

**Jalur A — Scan KTP via foto (utama)**
Admin memotret atau mengunggah foto KTP. Sistem membaca teks dari foto (OCR)
lalu mengisi field otomatis. Hasil pembacaan ditampilkan sebagai teks yang
**masih bisa dikoreksi admin** sebelum disimpan — OCR tidak pernah dianggap
100% benar.

Foto KTP yang dipakai untuk scan **otomatis tersimpan** ke daftar dokumen
customer, tidak perlu diunggah dua kali.

**Jalur B — Input manual (fallback)**
Kalau scan gagal, foto tidak jelas, atau admin memilih tidak memakai scan,
seluruh field diisi manual.

### 3.2 Data identitas (sesuai KTP)

NIK, nama lengkap, tempat & tanggal lahir, jenis kelamin, alamat (termasuk
RT/RW, kelurahan/desa, kecamatan), agama, status perkawinan, pekerjaan,
kewarganegaraan.

### 3.3 Data tambahan (wajib ditanyakan admin)

1. No. HP (WhatsApp)
2. Email aktif
3. Sosial media (Instagram / TikTok)
4. Nomor darurat — **siapa (nama + hubungan) dan nomornya**
5. Status rumah — milik sendiri / sewa / kos
6. Pekerjaan / usaha / kampus

### 3.4 Lokasi

1. **Link lokasi Google Maps** rumah customer
2. **Foto depan rumah**

### 3.5 Dokumen

Unggah berkas: **KTP, KK, SIM, NPWP**, dan dokumen pendukung lain. Satu
customer bisa punya banyak dokumen.

> Foto KTP dari proses scan di 3.1 otomatis masuk ke sini sebagai dokumen
> bertipe KTP.

### 3.6 Jaminan

Jaminan yang dititipkan customer, umumnya **motor**:

- Motor apa yang dititipkan (merek/tipe, dan idealnya nomor plat)
- **Atas nama siapa** (bisa berbeda dari nama customer)

Perilaku:

- Jaminan tersimpan di data customer, sehingga saat transaksi berikutnya
  langsung muncul sebagai pilihan.
- Kalau kendaraan yang dititipkan **berbeda** dari yang tersimpan, admin bisa
  menginput jaminan baru saat transaksi. Jaminan yang benar-benar dipakai
  dicatat di record transaksi tersebut.

### 3.7 Aksi di halaman customer

- Daftar customer dengan pencarian (nama, No. HP, NIK)
- Detail customer: identitas, kontak, lokasi, dokumen, jaminan, dan **riwayat
  transaksi**
- Tambah / ubah customer

> **Catatan privasi:** modul ini menyimpan data pribadi sensitif (NIK, KK,
> foto rumah). Akses hanya untuk admin yang sudah login, file dokumen tidak
> boleh bisa diakses lewat URL publik yang bisa ditebak.

---

## 4. Transaksi

**Tujuan:** mencatat proses booking mobil dari awal sampai mobil selesai
disewa.

### 4.1 Cara membuat transaksi

Transaksi **selalu dimulai dari Katalog Mobil internal**: admin memilih mobil →
klik **Booking** → pindah ke form transaksi dengan data mobil sudah terisi.

### 4.2 Isi form transaksi

**Bagian mobil (terisi otomatis, tidak diketik ulang)**
Nama mobil, unit yang dipakai, harga jual per hari, harga modal per hari.

**Bagian customer**
Cari customer yang sudah ada, atau buat baru (lihat modul Customer).

**Bagian jaminan**
Pilih jaminan tersimpan milik customer, atau input jaminan baru untuk transaksi
ini.

**Bagian sewa (diinput admin)**

| Field | Keterangan |
|---|---|
| Tanggal mulai sewa | Tanggal pengambilan mobil |
| Durasi (hari) | Lama sewa |
| Jam berangkat | Jam pengambilan |

**Dihitung otomatis**

- Tanggal selesai = tanggal mulai + durasi
- Total harga jual = harga jual/hari × durasi
- Total modal = harga modal/hari × durasi
- Laba = total harga jual − total modal

### 4.3 Status

```
Booking  →  Sedang Perjalanan  →  Selesai
```

| Status | Kapan dipakai |
|---|---|
| **Booking** | Begitu transaksi disimpan. Mobil sudah dipesan, belum berangkat |
| **Sedang Perjalanan** | Mobil sudah diambil customer |
| **Selesai** | Mobil sudah dikembalikan, sewa berakhir |

Aturan:

- Status berpindah maju satu arah, diubah manual oleh admin.
- Status **Booking** dan **Sedang Perjalanan** menahan satu unit mobil.
- Status **Selesai** mengembalikan unit ke stok tersedia.

### 4.4 Halaman daftar transaksi

- Tabel transaksi dengan filter status dan rentang tanggal
- Kolom minimal: kode transaksi, mobil, customer, tanggal mulai, tanggal
  selesai, durasi, total, status
- Klik baris → halaman detail transaksi (lengkap dengan data customer, jaminan,
  dan rincian harga)

---

## 5. Tracking Maps Car

**Tujuan:** admin bisa melacak keberadaan mobil yang sedang disewa dan
melihatnya di peta.

### Kebutuhan

- Halaman peta yang menampilkan posisi mobil-mobil yang sedang berstatus
  **Sedang Perjalanan**
- Marker per mobil, klik marker → info mobil, customer, dan transaksi terkait
- Posisi diperbarui berkala (bukan sekali muat saja)
- Bisa juga dibuka dari halaman detail transaksi untuk melacak satu mobil saja

### Sumber posisi

Modul ini butuh **dua hal terpisah**, jangan tertukar:

1. **Sumber data posisi** — dari mana koordinat mobil didapat. Umumnya dari GPS
   tracker yang terpasang di mobil, dan vendor tracker menyediakan API untuk
   mengambil koordinatnya.
2. **Peta untuk menampilkan** — library/API peta yang menggambar koordinat tadi.

Pilihan teknologi dan rekomendasinya dibahas di
[06 — Keputusan Teknis](06-keputusan-teknis.md#tracking-maps).

---

## 6. Export Transaksi (Excel)

**Tujuan:** melihat dan mengunduh rekap transaksi untuk periode tertentu —
sehari, sebulan, atau rentang bebas.

### Kebutuhan

- Filter **`startDate`** dan **`endDate`** yang bisa diatur bebas
- Pintasan cepat: Hari ini, Bulan ini, Bulan lalu
- Tombol export menghasilkan file **`.xlsx`** yang langsung terunduh
- Isi file mengikuti filter yang sedang aktif (termasuk filter status kalau
  dipakai)

### Kolom yang diekspor

| Kolom | Sumber |
|---|---|
| Kode transaksi | Transaksi |
| Tanggal mulai / Tanggal selesai | Transaksi |
| Durasi (hari) | Transaksi |
| Nama mobil | Katalog |
| Nama customer | Customer |
| No. HP customer | Customer |
| Harga jual per hari | Snapshot di transaksi |
| Total harga jual | Hitungan |
| Harga modal per hari | Snapshot di transaksi |
| Total modal | Hitungan |
| Laba | Total jual − total modal |
| Status | Transaksi |

Baris terakhir berisi **total** untuk kolom total jual, total modal, dan laba.

> Kolom modal & laba bersifat internal. Kalau nanti ada peran non-owner, kolom
> ini disembunyikan untuk peran tersebut.
