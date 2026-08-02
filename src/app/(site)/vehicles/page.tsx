import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections";
import { VehiclesExplorer } from "@/components/vehicles-explorer";

export const metadata: Metadata = {
  title: "Vehicles",
  description:
    "Browse the RentCar fleet — sedans, cabriolets, pickups, SUVs and minivans with transparent daily pricing.",
};

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-extrabold text-ink sm:text-5xl">
          Select a vehicle group
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-body">
          Every car is inspected, insured, and delivered with a full tank. Pick a category to
          narrow things down.
        </p>
        <div className="mt-12">
          <VehiclesExplorer initialType={type} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
