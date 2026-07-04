"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CarFront, Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
        <CarFront className="size-5" strokeWidth={2.2} />
      </span>
      <span
        className={cn(
          "text-xl font-extrabold tracking-tight",
          light ? "text-white" : "text-ink",
        )}
      >
        Rent<span className="text-primary">Car</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/vehicles") return pathname === "/vehicles";
    if (href.startsWith("/vehicles/")) return pathname.startsWith("/vehicles/");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-primary",
                isActive(item.href) ? "text-primary" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Phone */}
        <div className="hidden items-center gap-3 lg:flex">
          <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
            <Phone className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-xs text-body">Need help?</p>
            <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="text-[15px] font-bold text-ink">
              {site.phone}
            </a>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="grid size-11 place-items-center rounded-xl border border-line text-ink lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-line bg-white px-4 pb-6 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-[15px] font-medium",
                  isActive(item.href) ? "bg-primary-soft text-primary" : "text-ink hover:bg-mist",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-mist p-4">
            <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
              <Phone className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-body">Need help?</p>
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="text-[15px] font-bold text-ink">
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
