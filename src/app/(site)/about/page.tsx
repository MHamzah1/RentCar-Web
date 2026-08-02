import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CarImage } from "@/components/car-image";
import { BandStatistik, CtaBanner, SectionLabel, SyaratSewa } from "@/components/sections";
import { Reviews } from "@/components/reviews";
import { fotoCerita, fotoTentang, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "RentCar melayani sewa mobil di Bandung sejak 2018 — armada terawat, harga apa adanya, dan admin yang gampang dihubungi.",
};

const PILAR = [
  {
    judul: "Armada milik sendiri",
    isi: "Unit dirawat tim kami, bukan dicarikan dadakan dari pihak ketiga saat ada yang pesan.",
  },
  {
    judul: "Harga tanpa kejutan",
    isi: "Angka yang disebut admin di awal adalah angka yang dibayar. Tidak ada biaya administrasi tersembunyi.",
  },
  {
    judul: "Bisa antar-jemput",
    isi: "Unit diantar ke rumah, kantor, stasiun, atau bandara di area Bandung dan sekitarnya.",
  },
  {
    judul: "Fleksibel di tengah jalan",
    isi: "Butuh tambah hari? Chat admin, sewa diperpanjang tanpa harus balik ke garasi dulu.",
  },
];

const JANJI = [
  "Asuransi sudah termasuk di harga sewa",
  "Kondisi mobil direkam saat serah terima — aman untuk kedua pihak",
  "Bantuan lewat WhatsApp selama masa sewa",
  "Perpanjangan bisa diurus lewat chat",
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Tentang RentCar</h1>
        <p className="mt-3 text-sm text-body">
          <Link href="/" className="text-primary hover:underline">
            Beranda
          </Link>{" "}
          / Tentang Kami
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Rental mobil yang mengurus detailnya untuk Anda
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {PILAR.map((p) => (
            <div key={p.judul}>
              <h3 className="text-lg font-bold text-ink">{p.judul}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{p.isi}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-72 overflow-hidden rounded-[2rem] sm:h-[420px]">
          <CarImage src={fotoTentang} alt="Armada RentCar di jalan" sizes="100vw" priority />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionLabel>Cerita kami</SectionLabel>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Mulai dari tiga mobil dan satu nomor WhatsApp
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-body">
            {site.nama} berdiri di Bandung pada 2018 dengan tiga unit dan satu prinsip sederhana: penyewa harus
            tahu persis apa yang dia bayar. Sekarang armada kami sudah puluhan unit, tapi caranya masih sama —
            satu nomor admin, dijawab orang, bukan mesin.
          </p>
          <ul className="mt-6 space-y-3">
            {JANJI.map((j) => (
              <li key={j} className="flex items-start gap-3 text-sm text-ink">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                {j}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-80 overflow-hidden rounded-[2rem] lg:h-[440px]">
          <CarImage src={fotoCerita} alt="Perjalanan malam bersama RentCar" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
      </section>

      <BandStatistik />
      <SyaratSewa ringkas />
      <Reviews />
      <CtaBanner />
    </>
  );
}
