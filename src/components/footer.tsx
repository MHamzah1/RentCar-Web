import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandApple, BrandFacebook, BrandGooglePlay, BrandInstagram, BrandX, BrandYoutube } from "./icons";
import { cars, site } from "@/lib/data";
import { Logo } from "./navbar";
import { cn } from "@/lib/utils";

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a
        href="#"
        className="flex items-center gap-2.5 rounded-xl bg-ink px-4 py-2.5 text-white transition-opacity hover:opacity-85"
      >
        <BrandApple className="size-6" />
        <span className="leading-tight">
          <span className="block text-[10px] text-white/70">Download on the</span>
          <span className="block text-sm font-semibold">App Store</span>
        </span>
      </a>
      <a
        href="#"
        className="flex items-center gap-2.5 rounded-xl bg-ink px-4 py-2.5 text-white transition-opacity hover:opacity-85"
      >
        <BrandGooglePlay className="size-5" />
        <span className="leading-tight">
          <span className="block text-[10px] text-white/70">Get it on</span>
          <span className="block text-sm font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}

const socials = [
  { icon: BrandFacebook, label: "Facebook" },
  { icon: BrandInstagram, label: "Instagram" },
  { icon: BrandX, label: "X (Twitter)" },
  { icon: BrandYoutube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand + contact */}
        <div className="space-y-5">
          <Logo />
          <ul className="space-y-3 text-sm text-body">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${site.email}`} className="hover:text-primary">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 text-base font-bold text-ink">Quick Links</h4>
          <ul className="space-y-3 text-sm text-body">
            {site.nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Vehicles */}
        <div>
          <h4 className="mb-4 text-base font-bold text-ink">Our Vehicles</h4>
          <ul className="space-y-3 text-sm text-body">
            {cars.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/vehicles/${c.slug}`} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* App */}
        <div>
          <h4 className="mb-4 text-base font-bold text-ink">Download The App</h4>
          <p className="mb-4 text-sm text-body">
            Book, extend, and unlock your rental straight from your phone.
          </p>
          <StoreBadges />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-body">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-line text-body transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
