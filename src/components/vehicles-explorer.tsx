"use client";

import { useState } from "react";
import { CarFront } from "lucide-react";
import { cars, categories, type Category } from "@/lib/data";
import { VehicleCard } from "./car-cards";
import { cn } from "@/lib/utils";

export function VehiclesExplorer({ initialType }: { initialType?: string }) {
  const start = categories.includes(initialType as Category)
    ? (initialType as Category)
    : "All vehicles";
  const [active, setActive] = useState<Category>(start);

  const filtered =
    active === "All vehicles" ? cars : cars.filter((c) => c.category === active);

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-primary text-white shadow-[0_14px_30px_-12px_rgba(89,55,224,0.6)]"
                  : "bg-mist text-ink hover:bg-primary-soft",
              )}
            >
              {c !== "All vehicles" ? <CarFront className="size-4" /> : null}
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((car) => (
          <VehicleCard key={car.slug} car={car} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-body">
          No vehicles in this category yet — check back soon.
        </p>
      ) : null}
    </div>
  );
}
