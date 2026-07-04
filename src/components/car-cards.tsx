import Link from "next/link";
import { ArrowRight, Fuel, Settings2, Snowflake, Star, Users, DoorOpen } from "lucide-react";
import type { Car } from "@/lib/data";
import { CarImage } from "./car-image";

/** Homepage "popular rental deals" card — rating + 2-column spec list. */
export function DealCard({ car }: { car: Car }) {
  const specs = [
    { icon: Users, label: `${car.specs.seats} Passengers` },
    { icon: Settings2, label: car.specs.gearBox },
    { icon: Snowflake, label: "Air Conditioning" },
    { icon: DoorOpen, label: `${car.specs.doors} Doors` },
  ];

  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(20,10,60,0.25)]">
      <div className="relative h-40 overflow-hidden rounded-2xl bg-mist">
        <CarImage src={car.image} alt={car.name} sizes="(max-width: 768px) 100vw, 25vw" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <h3 className="text-[17px] font-bold text-ink">{car.name}</h3>
        <span className="flex items-center gap-1 text-sm font-semibold text-ink">
          <Star className="size-4 fill-accent text-accent" />
          {car.rating.toFixed(1)}
          <span className="font-normal text-body">({car.reviewCount})</span>
        </span>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5">
        {specs.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-[13px] text-body">
            <Icon className="size-4 text-primary" />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <div>
          <p className="text-xs text-body">Price</p>
          <p className="text-lg font-extrabold text-ink">
            ${car.pricePerDay}
            <span className="text-sm font-medium text-body"> /day</span>
          </p>
        </div>
        <Link
          href={`/vehicles/${car.slug}`}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Rent now
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/** Vehicles page card — name/category + price, icon strip, See Details. */
export function VehicleCard({ car }: { car: Car }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(20,10,60,0.25)]">
      <div className="relative h-44 overflow-hidden rounded-2xl bg-mist">
        <CarImage src={car.image} alt={car.name} sizes="(max-width: 768px) 100vw, 33vw" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-bold text-ink">{car.name}</h3>
          <p className="text-sm text-body">{car.category}</p>
        </div>
        <p className="text-right text-lg font-extrabold text-primary">
          ${car.pricePerDay}
          <span className="block text-xs font-medium text-body">per day</span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-5 border-t border-line pt-4 text-[13px] text-body">
        <span className="flex items-center gap-1.5">
          <Settings2 className="size-4 text-primary" />
          {car.specs.gearBox}
        </span>
        <span className="flex items-center gap-1.5">
          <Fuel className="size-4 text-primary" />
          {car.specs.fuel}
        </span>
        <span className="flex items-center gap-1.5">
          <Snowflake className="size-4 text-primary" />
          AC
        </span>
      </div>

      <Link
        href={`/vehicles/${car.slug}`}
        className="mt-5 block rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        See Details
      </Link>
    </div>
  );
}
