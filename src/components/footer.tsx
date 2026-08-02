import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandFacebook, BrandInstagram, BrandX, BrandYoutube } from "./icons";
import { cars, site } from "@/lib/data";
import { ADMIN_WA, waLink } from "@/lib/constants";
import { Logo } from "./navbar";

const sosial = [
  { ikon: BrandInstagram, label: "Instagram" },
  { ikon: BrandFacebook, label: "Facebook" },
  { ikon: BrandX, label: "X (Twitter)" },
  { ikon: BrandYoutube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-5">
          <Logo />
          <p className="text-sm leading-relaxed text-body">{site.deskripsi}</p>
          <ul className="space-y-3 text-sm text-body">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{site.alamat}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${ADMIN_WA.tel}`} className="hover:text-primary">
                {site.telepon}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${site.email}`} className="hover:text-primary">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-primary" />
              {site.jamOperasional}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-base font-bold text-ink">Halaman</h4>
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

        <div>
          <h4 className="mb-4 text-base font-bold text-ink">Mobil populer</h4>
          <ul className="space-y-3 text-sm text-body">
            {cars.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/vehicles/${c.slug}`} className="transition-colors hover:text-primary">
                  {c.nama}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-base font-bold text-ink">Pesan lewat WhatsApp</h4>
          <p className="mb-4 text-sm leading-relaxed text-body">
            Semua pemesanan diproses admin lewat chat. Tidak ada pembayaran atau formulir pemesanan di website
            ini.
          </p>
          <a
            href={waLink("Halo Admin RentCar, saya mau tanya-tanya soal sewa mobil.")}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <MessageCircle className="size-4" />
            Chat {site.telepon}
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-body">
            © {new Date().getFullYear()} {site.nama}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-3">
            {sosial.map(({ ikon: Ikon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-line text-body transition-colors hover:border-primary hover:text-primary"
              >
                <Ikon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
