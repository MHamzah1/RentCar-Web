import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BookingCard } from "@/components/booking-card";
import { KartuUnggulan } from "@/components/car-cards";
import { CarImage } from "@/components/car-image";
import {
  AlasanMemilih,
  BandStatistik,
  CaraSewa,
  CtaBanner,
  Keunggulan,
  SyaratSewa,
} from "@/components/sections";
import { Reviews } from "@/components/reviews";
import { fotoCerita, fotoHero, hargaTermurah, mobilPopuler, site } from "@/lib/data";
import { rupiah } from "@/lib/constants";

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35) 0 2px, transparent 3px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0 2px, transparent 3px)",
            backgroundSize: "90px 90px, 130px 130px",
          }}
        />

        <div className="relative grid items-start gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.15fr_auto] lg:gap-14 lg:px-14 lg:py-16">
          <div className="relative z-10 flex h-full flex-col">
            <p className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold text-white">
              <MapPin className="size-4 text-accent" />
              Melayani Bandung & sekitarnya
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.12] text-white sm:text-5xl lg:text-[54px]">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">
              Armada terawat mulai dari {rupiah(hargaTermurah)} per hari. Pesan lewat WhatsApp, unit bisa
              diantar ke lokasi Anda.
            </p>
            <Link
              href="/vehicles"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-accent-dark"
            >
              Lihat semua mobil
              <ArrowRight className="size-4" />
            </Link>

            <div className="relative mt-10 h-52 w-full max-w-xl overflow-hidden rounded-3xl sm:h-64 lg:mt-auto lg:h-72">
              <CarImage
                src={fotoHero}
                alt="Armada RentCar"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
            </div>
          </div>

          <div className="relative z-10 flex justify-center lg:justify-end">
            <BookingCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function MobilPopuler() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="max-w-md text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Paling sering disewa
          </h2>
          <p className="mt-2 text-[15px] text-body">Status ketersediaan diperbarui dari data sewa berjalan.</p>
        </div>
        <Link
          href="/vehicles"
          className="flex items-center gap-2 text-[15px] font-bold text-ink transition-colors hover:text-primary"
        >
          Lihat semua
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {mobilPopuler.map((mobil) => (
          <KartuUnggulan key={mobil.slug} mobil={mobil} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Keunggulan />
      <MobilPopuler />
      <CaraSewa />
      <AlasanMemilih foto={fotoCerita} />
      <BandStatistik />
      <SyaratSewa />
      <Reviews />
      <CtaBanner />
    </>
  );
}
