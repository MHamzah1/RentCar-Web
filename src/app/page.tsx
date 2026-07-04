import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingCard } from "@/components/booking-card";
import { DealCard } from "@/components/car-cards";
import { CarImage } from "@/components/car-image";
import {
  AppDownload,
  Perks,
  StatsBand,
  WhyChooseUs,
} from "@/components/sections";
import { appScreens, heroImage, popularCars, site, whyChooseImage } from "@/lib/data";

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary">
        {/* subtle texture */}
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
          {/* Copy + hero car */}
          <div className="relative z-10 flex h-full flex-col">
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.12] text-white sm:text-5xl lg:text-[54px]">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">
              Premium cars, honest prices, and pickup wherever you need it. Choose from 540+
              vehicles and hit the road in minutes — no paperwork marathons.
            </p>
            <Link
              href="/vehicles"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-accent-dark"
            >
              View all cars
              <ArrowRight className="size-4" />
            </Link>

            {/* Hero car */}
            <div className="relative mt-10 h-52 w-full max-w-xl overflow-hidden rounded-3xl sm:h-64 lg:mt-auto lg:h-72">
              <CarImage
                src={heroImage}
                alt="Featured rental car"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
            </div>
          </div>

          {/* Booking card */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <BookingCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function PopularDeals() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-md text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Choose the car that suits you
        </h2>
        <Link
          href="/vehicles"
          className="flex items-center gap-2 text-[15px] font-bold text-ink transition-colors hover:text-primary"
        >
          View All
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {popularCars.map((car) => (
          <DealCard key={car.slug} car={car} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Perks />
      <PopularDeals />
      <WhyChooseUs image={whyChooseImage} />
      <StatsBand />
      <AppDownload screens={appScreens} />
    </>
  );
}
