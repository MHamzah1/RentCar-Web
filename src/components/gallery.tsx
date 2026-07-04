"use client";

import { useState } from "react";
import { CarImage } from "./car-image";
import { cn } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative h-72 overflow-hidden rounded-[2rem] bg-mist sm:h-[420px]">
        <CarImage
          src={images[active]}
          alt={alt}
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
        />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Photo ${i + 1}`}
            className={cn(
              "relative h-20 overflow-hidden rounded-xl border-2 transition sm:h-24",
              i === active ? "border-primary" : "border-transparent opacity-80 hover:opacity-100",
            )}
          >
            <CarImage src={src} alt={`${alt} photo ${i + 1}`} sizes="150px" />
          </button>
        ))}
      </div>
    </div>
  );
}
