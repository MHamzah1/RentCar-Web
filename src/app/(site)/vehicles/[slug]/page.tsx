import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Fuel,
  Gauge,
  Settings2,
  Snowflake,
  Star,
  Users,
} from "lucide-react";
import { Gallery } from "@/components/gallery";
import { VehicleCard } from "@/components/car-cards";
import { CtaBanner } from "@/components/sections";
import { cars, getCar } from "@/lib/data";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return { title: "Vehicle not found" };
  return {
    title: `${car.name} — $${car.pricePerDay}/day`,
    description: car.description,
  };
}

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();

  const specItems = [
    { icon: Settings2, label: "Gear Box", value: car.specs.gearBox },
    { icon: Fuel, label: "Fuel", value: car.specs.fuel },
    { icon: DoorOpen, label: "Doors", value: String(car.specs.doors) },
    { icon: Snowflake, label: "Air Conditioner", value: car.specs.airConditioner },
    { icon: Users, label: "Seats", value: String(car.specs.seats) },
    { icon: Gauge, label: "Distance", value: car.specs.distance },
  ];

  const others = cars.filter((c) => c.slug !== car.slug).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <p className="text-sm text-body">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/vehicles" className="text-primary hover:underline">
            Vehicles
          </Link>{" "}
          / {car.name}
        </p>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* Left: title + gallery */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{car.name}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-body">
                  <Star className="size-4 fill-accent text-accent" />
                  <span className="font-semibold text-ink">{car.rating.toFixed(1)}</span>
                  ({car.reviewCount} reviews) · {car.category}
                </p>
              </div>
              <p className="text-3xl font-extrabold text-primary">
                ${car.pricePerDay}
                <span className="text-base font-medium text-body"> / day</span>
              </p>
            </div>

            <div className="mt-6">
              <Gallery images={car.gallery} alt={car.name} />
            </div>
          </div>

          {/* Right: specs + rent + equipment */}
          <div>
            <h2 className="text-xl font-bold text-ink">Technical Specification</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-mist p-4">
                  <Icon className="size-5 text-primary" />
                  <p className="mt-3 text-[13px] font-bold text-ink">{label}</p>
                  <p className="mt-0.5 text-[13px] text-body">{value}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-body">{car.description}</p>

            <Link
              href="/contact"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
            >
              Rent a car
              <ArrowRight className="size-4" />
            </Link>

            <h2 className="mt-10 text-xl font-bold text-ink">Car Equipment</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {car.equipment.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-body">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Other cars */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Other cars</h2>
          <Link
            href="/vehicles"
            className="flex items-center gap-2 text-[15px] font-bold text-ink transition-colors hover:text-primary"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <VehicleCard key={c.slug} car={c} />
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
