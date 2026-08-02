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

### Dua peran

| Peran | Boleh melihat |
|---|---|
| **Super Admin (Owner)** | Semuanya, termasuk **harga modal, margin, dan laba** |
| **Admin (Staf)** | Semuanya **kecuali** harga modal, margin, dan laba |

Aturan penerapannya:

- Kolom modal/laba tidak sekadar disembunyikan di tampilan — untuk peran Staf,
  angka itu **tidak boleh ikut dikirim** ke halaman sama sekali.
- Berlaku di semua tempat: katalog, detail mobil, daftar & detail transaksi,
  dashboard, dan file hasil export.

### Catatan

- Belum ada pendaftaran mandiri — akun admin dibuat manual (seed / oleh Super
  Admin).

---

## 2. Katalog Mobil & Pricing

**Tujuan:** mendaftarkan mobil yang disewakan, sekaligus menjadi sumber data
yang tampil di landing page.

### Data yang diinput

| Field | Keterangan |
|---|---|
| Nama mobil | Contoh: Toyota Avanza 2022 |
| Kategori | MPV / SUV / Hatchback / Minibus |
| Foto | Satu foto utama + galeri, **diunggah admin** (bukan foto stok) |
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

Unit **tidak dibedakan per nomor plat** — yang dicatat hanya berapa banyak unit
yang dimiliki per model.

- Setiap mobil punya **jumlah unit total**.
- **Unit tersedia** = unit total − jumlah transaksi yang sedang menahan unit,
  yaitu berstatus *Booking*, *Sedang Perjalanan*, *Lewat Waktu*, atau
  *Diperpanjang*.
- Status **Selesai** dan **Batal** sama-sama mengembalikan unit ke stok.
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
Nama mobil, harga jual per hari, harga modal per hari (Super Admin saja), sisa
unit tersedia.

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
| Jam berangkat | Jam pengambilan — sekaligus patokan jam pengembalian |
| Layanan | **Lepas kunci** atau **Dengan sopir** (+Rp 500.000/hari, semua mobil) |
| DP diterima | Uang muka yang dibayar customer saat booking |
| Metode pembayaran | Tunai / Transfer |

**Dihitung otomatis**

- Tanggal selesai = tanggal mulai + durasi
- Biaya sewa = harga jual/hari × durasi
- Biaya sopir = Rp 500.000 × durasi (kalau dipilih)
- Denda = jam overtime × Rp 50.000
- **Total tagihan** = biaya sewa + biaya sopir + denda
- **Sisa tagihan** = total tagihan − total dibayar
- Total modal & laba — **hanya untuk Super Admin**

### 4.3 Status

```
                    ┌──────────────► BATAL (stok kembali)
                    │
BOOKING ────────────┴──► SEDANG PERJALANAN ──────────────► SELESAI
   (video wajib di sini)          │                            ▲
                                  ▼ (otomatis, lewat batas)    │
                             LEWAT WAKTU ──(+n hari)──► DIPERPANJANG
                                  │                            │
                                  └────────────────────────────┘
```

| Status | Kapan dipakai | Menahan unit? |
|---|---|---|
| **Booking** | Begitu transaksi disimpan, mobil belum berangkat | Ya |
| **Sedang Perjalanan** | Mobil sudah diambil customer | Ya |
| **Lewat Waktu** | Melewati batas pengembalian — **otomatis, tanpa diklik** | Ya |
| **Diperpanjang** | Sewa ditambah beberapa hari oleh admin | Ya |
| **Selesai** | Mobil kembali, tagihan diselesaikan | Tidak |
| **Batal** | Booking dibatalkan sebelum mobil berangkat | Tidak |

Aturan:

- Perpindahan status dilakukan admin, **kecuali Lewat Waktu** yang dihitung
  otomatis dari batas pengembalian.
- **Batal hanya boleh dari status Booking.**
- Status **Selesai** dan **Batal** sama-sama mengembalikan unit ke stok.

### 4.4 Video kondisi awal unit (wajib)

Saat admin menekan **Mulai Perjalanan**, sistem mewajibkan unggah **video
kondisi awal mobil** sebelum status berpindah.

- Tombol Mulai Perjalanan **tidak bisa diteruskan** tanpa video.
- Video jadi bukti kondisi unit saat diserahkan (baret, penyok, kelengkapan).
- Disimpan di storage privat seperti dokumen customer — **bukan** di `public/`.
- Video tampil di halaman detail transaksi untuk dicocokkan saat pengembalian.

### 4.5 Lewat waktu, denda, dan perpanjangan

Batas pengembalian = tanggal selesai pada **jam yang sama dengan jam berangkat**.

Begitu terlampaui:

1. Status otomatis menjadi **Lewat Waktu**.
2. Muncul **notifikasi di dalam aplikasi admin** (lonceng di topbar + daftar di
   dashboard). Tidak mengirim WhatsApp/email otomatis ke customer.
3. **Denda Rp 50.000 per jam** berjalan dan masuk ke total tagihan.

Dari status Lewat Waktu, admin punya dua aksi:

| Aksi | Hasil |
|---|---|
| **Perpanjang** | Isi tambahan berapa hari → durasi bertambah, status jadi **Diperpanjang**, biaya sewa ikut bertambah |
| **Selesaikan** | Catat pelunasan + denda → status **Selesai**, unit kembali ke stok |

### 4.6 Pembayaran

Tiap transaksi punya riwayat pembayaran, bukan satu angka tunggal:

| Jenis | Kapan dicatat |
|---|---|
| **DP** | Saat booking dibuat |
| **Pelunasan** | Saat mobil dikembalikan |
| **Denda** | Kalau ada overtime |

Status pembayaran dihitung dari total yang masuk: **Belum Bayar** → **DP** →
**Lunas**.

### 4.7 Halaman daftar transaksi

- Tabel transaksi dengan filter status dan rentang tanggal
- Kolom minimal: kode transaksi, mobil, customer, tanggal mulai, tanggal
  selesai, durasi, total tagihan, status pembayaran, status transaksi
- Baris berstatus **Lewat Waktu** ditandai mencolok
- Klik baris → halaman detail transaksi (data customer, jaminan, video serah
  terima, rincian tagihan, riwayat pembayaran)

---

## 5. Tracking Maps Car

**Tujuan:** admin bisa melacak keberadaan mobil yang sedang disewa dan
melihatnya di peta.

### Kebutuhan

- Halaman peta yang menampilkan posisi mobil yang sedang di luar — status
  **Sedang Perjalanan**, **Lewat Waktu**, atau **Diperpanjang**
- Marker per transaksi, klik marker → info mobil, customer, dan transaksi terkait
- Unit berstatus **Lewat Waktu** ditandai berbeda supaya langsung terlihat
- Posisi diperbarui berkala (bukan sekali muat saja)
- Bisa juga dibuka dari halaman detail transaksi untuk melacak satu mobil saja

Karena unit tidak dibedakan per plat, marker diikat ke **kode transaksi**, bukan
ke nomor polisi.

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

| Kolom | Sumber | Super Admin saja? |
|---|---|---|
| Kode transaksi | Transaksi | |
| Tanggal mulai / Tanggal selesai | Transaksi | |
| Durasi (hari) | Transaksi | |
| Nama mobil | Katalog | |
| Nama customer | Customer | |
| No. HP customer | Customer | |
| Layanan (lepas kunci / sopir) | Transaksi | |
| Harga jual per hari | Snapshot di transaksi | |
| Biaya sewa | Hitungan | |
| Biaya sopir | Hitungan | |
| Denda overtime | Hitungan | |
| **Total tagihan** | Hitungan | |
| Total dibayar / Sisa | Riwayat pembayaran | |
| Status pembayaran | Hitungan | |
| Status transaksi | Transaksi | |
| Harga modal per hari | Snapshot di transaksi | ✅ |
| Total modal | Hitungan | ✅ |
| Laba | Total tagihan − total modal | ✅ |

Baris terakhir berisi **total** untuk kolom uang.

> Kolom bertanda ✅ hanya ikut ter-export kalau yang login **Super Admin**.
> Untuk Admin staf, kolom itu tidak ada di file — bukan sekadar dikosongkan.
