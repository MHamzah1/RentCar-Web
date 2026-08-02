"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CarFront, Menu, MessageCircle, Phone, X } from "lucide-react";
import { site } from "@/lib/data";
import { ADMIN_WA, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
        <CarFront className="size-5" strokeWidth={2.2} />
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
        Rent<span className="text-primary">Car</span>
      </span>
    </Link>
  );
}

const PESAN_NAV = "Halo Admin RentCar, saya mau tanya-tanya soal sewa mobil.";

export function Navbar() {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);

  const aktif = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-primary",
                aktif(item.href) ? "text-primary" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
              <Phone className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-body">Admin RentCar</p>
              <a href={`tel:${ADMIN_WA.tel}`} className="text-[15px] font-bold text-ink">
                {site.telepon}
              </a>
            </div>
          </div>
          <a
            href={waLink(PESAN_NAV)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label="Buka menu"
          onClick={() => setBuka((o) => !o)}
          className="grid size-11 place-items-center rounded-xl border border-line text-ink lg:hidden"
        >
          {buka ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {buka ? (
        <div className="border-t border-line bg-white px-4 pb-6 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setBuka(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-[15px] font-medium",
                  aktif(item.href) ? "bg-primary-soft text-primary" : "text-ink hover:bg-mist",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href={waLink(PESAN_NAV)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[15px] font-semibold text-white"
          >
            <MessageCircle className="size-[18px]" />
            Chat admin — {site.telepon}
          </a>
        </div>
      ) : null}
    </header>
  );
}
