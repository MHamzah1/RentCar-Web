"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, CarFront, MapPin } from "lucide-react";
import { categories } from "@/lib/data";

const locations = ["Jakarta — Sudirman", "Jakarta — Airport (CGK)", "Bandung", "Surabaya", "Bali — Denpasar"];

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-mist px-3.5 py-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-white";

export function BookingCard() {
  const router = useRouter();
  const [type, setType] = useState<string>("All vehicles");
  const [pickup, setPickup] = useState(locations[0]);
  const [dropoff, setDropoff] = useState(locations[0]);
  const [start, setStart] = useState("2026-07-10");
  const [end, setEnd] = useState("2026-07-13");

  const submit = () => {
    const params = new URLSearchParams({ type, pickup, dropoff, start, end });
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_60px_-20px_rgba(20,10,60,0.35)] sm:p-7">
      <h3 className="mb-5 text-xl font-bold text-ink">Book your car</h3>
      <div className="space-y-4">
        <Field label="Car type" icon={<CarFront className="size-4" />}>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Place of rental" icon={<MapPin className="size-4" />}>
          <select value={pickup} onChange={(e) => setPickup(e.target.value)} className={inputCls}>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>

        <Field label="Place of return" icon={<MapPin className="size-4" />}>
          <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className={inputCls}>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Rental date" icon={<Calendar className="size-4" />}>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Return date" icon={<Calendar className="size-4" />}>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={inputCls} />
          </Field>
        </div>

        <button
          type="button"
          onClick={submit}
          className="w-full rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
        >
          Book now
        </button>
      </div>
    </div>
  );
}
