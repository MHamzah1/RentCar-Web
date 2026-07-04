import type { Metadata } from "next";
import { CarImage } from "@/components/car-image";
import { AppDownload, SectionLabel, StatsBand } from "@/components/sections";
import { Reviews } from "@/components/reviews";
import { CtaBanner } from "@/components/sections";
import { CheckCircle2 } from "lucide-react";
import { aboutHeroImage, aboutStoryImage, appScreens, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RentCar has kept drivers moving for 25+ years with a 540-car fleet, honest pricing and human support.",
};

const pillars = [
  {
    title: "Variety of brands",
    text: "Tesla, BMW, Porsche, Jeep and more — one account, every kind of drive.",
  },
  {
    title: "Awesome support",
    text: "Talk to a real person in minutes, seven days a week, in-app or by phone.",
  },
  {
    title: "Maximum freedom",
    text: "Unlimited mileage and flexible pickup points, including airport delivery.",
  },
  {
    title: "Flexibility on the go",
    text: "Extend, shorten, or swap your rental from the app — no counter visits.",
  },
];

const promises = [
  "Full insurance included on every booking",
  "Free cancellation up to 24 hours before pickup",
  "24/7 roadside assistance across the country",
  "No hidden fees — the checkout price is the final price",
];

export default function AboutPage() {
  return (
    <>
      {/* Heading + breadcrumb */}
      <section className="mx-auto max-w-7xl px-4 pt-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">About Us</h1>
        <p className="mt-3 text-sm text-body">
          <span className="text-primary">Home</span> / About Us
        </p>
      </section>

      {/* Intro pillars */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Where every drive feels extraordinary
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title}>
              <h3 className="text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wide image */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-72 overflow-hidden rounded-[2rem] sm:h-[420px]">
          <CarImage src={aboutHeroImage} alt="RentCar on the road" sizes="100vw" priority />
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionLabel>Our story</SectionLabel>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Unlock unforgettable memories on the road
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-body">
            {site.name} started with three cars and one idea: renting a vehicle should feel as
            good as driving it. Twenty-five years later we keep thousands of drivers moving every
            month — and we still treat every handover like the first one.
          </p>
          <ul className="mt-6 space-y-3">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-ink">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-80 overflow-hidden rounded-[2rem] lg:h-[440px]">
          <CarImage src={aboutStoryImage} alt="Night drive with RentCar" sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
      </section>

      <StatsBand />
      <Reviews />
      <AppDownload screens={appScreens} />
      <CtaBanner />
    </>
  );
}
