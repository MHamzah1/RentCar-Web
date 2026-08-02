import Link from "next/link";
import {
  BadgeCheck,
  CarFront,
  Headphones,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { keunggulan, site, statistik } from "@/lib/data";
import { ADMIN_WA } from "@/lib/constants";
import { CarImage } from "./car-image";
import { TombolWa, pesanUmum } from "./tombol-wa";
import { cn } from "@/lib/utils";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{children}</p>;
}

/* ------------------------------------------------------------ keunggulan */

const IKON_KEUNGGULAN = [Wallet, CarFront, MessageCircle];

export function Keunggulan() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-8">
      {keunggulan.map((k, i) => {
        const Ikon = IKON_KEUNGGULAN[i] ?? Wallet;
        return (
          <div key={k.judul} className="flex flex-col items-center text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Ikon className="size-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-ink">{k.judul}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-body">{k.isi}</p>
          </div>
        );
      })}
    </section>
  );
}

/* --------------------------------------------------------- cara menyewa */

const LANGKAH = [
  {
    nomor: "1",
    judul: "Pilih mobil di website",
    isi: "Lihat armada beserta harga sewa per hari. Yang tampil hanya unit yang benar-benar kami punya.",
  },
  {
    nomor: "2",
    judul: "Klik tombol WhatsApp",
    isi: "Pesan sudah terisi nama mobil dan harganya. Tinggal sebutkan tanggal berangkat dan pulang.",
  },
  {
    nomor: "3",
    judul: "Serah terima unit",
    isi: "Setelah sepakat, admin menyiapkan berkas dan jaminan. Mobil diantar atau diambil di garasi.",
  },
];

export function CaraSewa() {
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Cara menyewa</SectionLabel>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Tiga langkah, semuanya lewat WhatsApp
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-body">
            Tidak ada formulir panjang dan tidak ada pembayaran online. Semua diurus admin lewat chat.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {LANGKAH.map((l) => (
            <li key={l.nomor} className="relative rounded-3xl border border-line bg-white p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-lg font-extrabold text-white">
                {l.nomor}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{l.judul}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{l.isi}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- alasan memilih */

const ALASAN = [
  {
    ikon: CarFront,
    judul: "Armada lengkap dan terawat",
    isi: "Dari city car sampai Hiace untuk rombongan. Servis rutin dan pengecekan sebelum setiap keberangkatan.",
  },
  {
    ikon: Wallet,
    judul: "Harga apa adanya",
    isi: "Harga per hari sudah termasuk asuransi. Tidak ada biaya kejutan saat serah terima.",
  },
  {
    ikon: Headphones,
    judul: "Admin gampang dihubungi",
    isi: "Satu nomor WhatsApp untuk tanya unit, atur jadwal, dan perpanjang sewa di tengah jalan.",
  },
  {
    ikon: ShieldCheck,
    judul: "Prosedur jelas",
    isi: "Berkas dan jaminan dicatat rapi, kondisi mobil direkam saat serah terima — aman untuk kedua pihak.",
  },
];

export function AlasanMemilih({ foto }: { foto: string }) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative order-2 h-80 overflow-hidden rounded-[2rem] lg:order-1 lg:h-[460px]">
          <CarImage src={foto} alt="Armada RentCar" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
        <div className="order-1 lg:order-2">
          <SectionLabel>Kenapa RentCar</SectionLabel>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Sewa mobil tanpa drama, dari orang yang gampang dihubungi
          </h2>
          <ul className="mt-8 space-y-6">
            {ALASAN.map(({ ikon: Ikon, judul, isi }) => (
              <li key={judul} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Ikon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{judul}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{isi}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- angka */

export function BandStatistik() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">RentCar dalam angka</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">
            Dipercaya keluarga, rombongan kantor, dan pelaku usaha di Bandung sejak 2018.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {statistik.map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-white p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-accent text-white">
                <Sparkles className="size-6" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-ink">{s.nilai}</p>
                <p className="text-sm text-body">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- jaminan */

const SYARAT = [
  "KTP asli penyewa",
  "SIM A yang masih berlaku",
  "Kartu Keluarga atau dokumen pendukung",
  "Jaminan kendaraan (umumnya motor) beserta STNK",
  "Titik lokasi rumah dan nomor kontak darurat",
];

export function SyaratSewa({ ringkas = false }: { ringkas?: boolean }) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", ringkas ? "py-12" : "py-20")}>
      <div className="grid gap-10 rounded-[2rem] border border-line bg-mist px-7 py-10 lg:grid-cols-[1fr_1.1fr] lg:px-12">
        <div>
          <SectionLabel>Syarat sewa</SectionLabel>
          <h2 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            Siapkan berkas ini sebelum hari keberangkatan
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-body">
            Berkas diperiksa admin saat serah terima. Semua dokumen disimpan aman dan hanya dipakai untuk
            keperluan sewa.
          </p>
          <TombolWa pesan={pesanUmum} gaya="kedua" className="mt-6">
            Tanya syarat lengkap
          </TombolWa>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {SYARAT.map((s) => (
            <li key={s} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-ink">
              <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- CTA penutup */

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-primary px-8 py-12 sm:flex-row sm:items-center lg:px-14">
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Butuh mobil untuk minggu ini?
          </h2>
          <p className="mt-2 text-[15px] text-white/80">
            Chat admin, sebutkan tanggalnya, biar kami cek unit yang kosong.
          </p>
          <a
            href={`tel:${ADMIN_WA.tel}`}
            className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-white/90 hover:text-white"
          >
            <PhoneCall className="size-5 text-accent" />
            {site.telepon}
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          <TombolWa pesan={pesanUmum} gaya="aksen">
            Chat admin sekarang
          </TombolWa>
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-white/10"
          >
            Lihat armada
          </Link>
        </div>
      </div>
    </section>
  );
}
