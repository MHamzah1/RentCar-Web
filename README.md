# RentCar — Website Rental Mobil (Next.js App Router + Tailwind CSS)

Website rental mobil dengan branding **RentCar**, dibangun mengikuti design Figma *Car Rental Figma Template (Community)* — tema ungu **#5937E0** dengan aksen oranye **#FF9E0C**. Seluruh data bersifat **dummy** dan foto dimuat dari **Unsplash**.

---

## Halaman & Fitur (sesuai flow Figma)

| Halaman | Isi |
|---|---|
| **Home** (`/`) | Hero panel ungu + kartu **"Book your car"** (car type, lokasi ambil/kembali, tanggal → mengarah ke /vehicles), 3 keunggulan (Availability/Comfort/Savings), **"Choose the car that suits you"** (kartu deal dengan rating + spesifikasi), Why Choose Us, band ungu **"Facts in numbers"** (540+/20k+/25+/20m+), section **Download App** dengan mockup ponsel |
| **Vehicles** (`/vehicles`) | Judul "Select a vehicle group", **filter kategori pill** (All/Sedan/Cabriolet/Pickup/SUV/Minivan) yang berfungsi, grid 12 mobil, banner CTA ungu |
| **Car Details** (`/vehicles/[slug]`) | Breadcrumb, **galeri foto dengan thumbnail** (bisa diklik), harga per hari, rating, **Technical Specification** (Gear Box/Fuel/Doors/AC/Seats/Distance), tombol Rent a car, **Car Equipment** checklist, "Other cars" |
| **About Us** (`/about`) | Judul + breadcrumb, "Where every drive feels extraordinary" (4 pilar), foto lebar, "Unlock unforgettable memories on the road" + checklist, statistik, **Reviews from our customers** (3 kartu testimoni), Download App |
| **Contact Us** (`/contact`) | Judul + breadcrumb, **form kontak berfungsi** (dengan status sukses), 4 kartu info (Address/Email/Phone/Opening hours) |
| **404** | Halaman not-found bergaya |

Ekstra: navbar sticky dengan status link aktif + menu mobile (hamburger), footer 4 kolom + sosial media, favicon RentCar, gambar dengan **fallback otomatis** bila foto Unsplash tidak tersedia, metadata SEO per halaman, dan 12 halaman detail mobil di-prerender statis (SSG).

---

## Teknologi

| Paket | Kegunaan |
|---|---|
| **Next.js 16** (App Router) + React 19 | Framework utama, Server Components + SSG |
| **Tailwind CSS v4** | Styling (design token via `@theme` di `globals.css`) |
| **TypeScript** (strict) | Type safety |
| **lucide-react** | Ikon UI (ikon brand dibuat inline di `src/components/icons.tsx`) |
| **@fontsource-variable/work-sans** | Font Work Sans di-bundle lokal (build tidak perlu fetch ke Google Fonts) |
| **next/image** | Optimasi gambar Unsplash (remotePatterns di `next.config.ts`) |

---

## Struktur Proyek

```
rentcar-web/
├── next.config.ts            # izin gambar images.unsplash.com
├── src/
│   ├── app/
│   │   ├── layout.tsx        # font, metadata, Navbar + Footer
│   │   ├── page.tsx          # Homepage
│   │   ├── vehicles/page.tsx            # daftar + filter kategori
│   │   ├── vehicles/[slug]/page.tsx     # detail mobil (SSG 12 halaman)
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── not-found.tsx
│   │   ├── globals.css       # token warna & font (Tailwind v4 @theme)
│   │   └── favicon.ico / icon.png
│   ├── components/           # navbar, footer, booking-card, car-cards,
│   │   ...                   # sections, gallery, vehicles-explorer,
│   │                         # contact-form, reviews, car-image, icons
│   └── lib/
│       ├── data.ts           # data dummy (12 mobil, review, statistik, dsb.)
│       └── utils.ts
└── package.json
```

---

## Cara Menjalankan

> Prasyarat: **Node.js 20+** (disarankan 20 LTS atau lebih baru) dan npm.

```bash
# 1. Masuk ke folder proyek
cd rentcar-web

# 2. Install dependency
npm install

# 3. Mode development
npm run dev
# buka http://localhost:3000
```

### Build produksi

```bash
npm run build   # build + type-check + prerender 20 halaman
npm run start   # jalankan server produksi di port 3000
```

Proyek ini sudah diverifikasi: `npm run build` lolos tanpa error dan seluruh route diuji mengembalikan status 200.

### Deploy

Siap deploy ke **Vercel** (import repo → otomatis terdeteksi Next.js), atau platform Node.js apa pun dengan `npm run build && npm run start`.

---

## Catatan Implementasi

- **Foto dari Unsplash** (butuh internet). Komponen `CarImage` punya fallback otomatis jika sebuah foto dihapus dari Unsplash.
- **Data dummy** ada di `src/lib/data.ts` — ganti daftar mobil, harga, kontak, dan teks di satu file ini.
- Form booking & form kontak berjalan di sisi klien (simulasi, tanpa backend) — form booking meneruskan pilihan ke halaman `/vehicles`, form kontak menampilkan status sukses.
- Logo brand mobil pihak ketiga tidak dipakai; identitas visual memakai logo **RentCar** sendiri agar bebas masalah merek dagang.

Selamat mencoba!
