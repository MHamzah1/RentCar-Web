import { CalendarCheck, Car as CarIcon, MapPin, PhoneCall, ShieldCheck, Sparkles, Wallet, Headphones } from "lucide-react";
import Link from "next/link";
import { site, stats } from "@/lib/data";
import { StoreBadges } from "./footer";
import { CarImage } from "./car-image";
import { cn } from "@/lib/utils";

export function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={cn("mb-3 text-sm font-semibold uppercase tracking-[0.18em]", light ? "text-accent" : "text-accent")}>
      {children}
    </p>
  );
}

/* --------------------------------------------------- Perks (after hero) */

const perks = [
  {
    icon: CalendarCheck,
    title: "Availability",
    text: "Real-time fleet status — the car you see is the car you get, ready when you land.",
  },
  {
    icon: CarIcon,
    title: "Comfort",
    text: "Every vehicle is detailed, serviced, and delivered with a full tank and cold AC.",
  },
  {
    icon: Wallet,
    title: "Savings",
    text: "Transparent daily rates with zero hidden fees and free cancellation up to 24h.",
  },
];

export function Perks() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-8">
      {perks.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Icon className="size-7" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-body">{text}</p>
        </div>
      ))}
    </section>
  );
}

/* --------------------------------------------------------- Why choose us */

const reasons = [
  {
    icon: CarIcon,
    title: "Extensive fleet options",
    text: "From city hatchbacks to premium SUVs — 540+ well-maintained vehicles across five categories.",
  },
  {
    icon: Headphones,
    title: "Exceptional customer service",
    text: "Real humans on chat and phone, every day of the week, before, during, and after your trip.",
  },
  {
    icon: MapPin,
    title: "Convenient locations",
    text: "Pick up downtown, at the airport, or get the car delivered straight to your door.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability and safety",
    text: "Full insurance, 24/7 roadside assistance, and a rigorous 50-point inspection on every rental.",
  },
];

export function WhyChooseUs({ image }: { image: string }) {
  return (
    <section className="bg-mist">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative order-2 h-80 overflow-hidden rounded-[2rem] lg:order-1 lg:h-[460px]">
          <CarImage src={image} alt="RentCar premium fleet" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
        <div className="order-1 lg:order-2">
          <SectionLabel>Why choose us</SectionLabel>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Unmatched quality and service for your needs
          </h2>
          <ul className="mt-8 space-y-6">
            {reasons.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-body">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Stats */

export function StatsBand() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Facts in numbers</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">
            The trust of thousands of drivers, earned one clean, reliable rental at a time.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-white p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-accent text-white">
                <Sparkles className="size-6" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-ink">{s.value}</p>
                <p className="text-sm text-body">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- App download */

export function AppDownload({ screens }: { screens: string[] }) {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionLabel>Download our app</SectionLabel>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Take {site.name} with you, everywhere you drive
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-body">
            Book in seconds, extend your rental on the go, unlock the car with your phone, and reach
            roadside support with a single tap.
          </p>
          <StoreBadges className="mt-7" />
        </div>

        <div className="relative flex justify-center gap-6 lg:justify-end">
          {screens.map((src, i) => (
            <div
              key={src}
              className={cn(
                "relative h-[380px] w-[190px] overflow-hidden rounded-[2.2rem] border-[6px] border-ink bg-ink shadow-[0_35px_70px_-30px_rgba(20,10,60,0.45)]",
                i === 1 && "mt-14 hidden sm:block",
              )}
            >
              <CarImage src={src} alt={`${site.name} app screen ${i + 1}`} sizes="200px" />
              <span className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- CTA banner */

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-primary px-8 py-12 sm:flex-row sm:items-center lg:px-14">
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Looking for a car? Call us now
          </h2>
          <a
            href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
            className="mt-3 inline-flex items-center gap-2 text-lg font-bold text-white/90 hover:text-white"
          >
            <PhoneCall className="size-5 text-accent" />
            {site.phone}
          </a>
        </div>
        <Link
          href="/vehicles"
          className="rounded-xl bg-accent px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-accent-dark"
        >
          Book a rental
        </Link>
      </div>
    </section>
  );
}
