"use client";

import Image from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/data";

/**
 * next/image wrapper with a guaranteed fallback so a removed Unsplash photo
 * never leaves a broken tile in the UI.
 */
export function CarImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      priority={priority}
      className={className ?? "object-cover"}
      onError={() => setCurrent(FALLBACK_IMAGE)}
    />
  );
}
