import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CarImage } from "@/components/car-image";
import { CtaBanner } from "@/components/sections";
import { fotoTentang, site } from "@/lib/data";
import { ADMIN_WA, waLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi admin RentCar Bandung lewat WhatsApp untuk tanya ketersediaan unit dan harga sewa.",
};

const INFO = [
  { ikon: MapPin, label: "Alamat garasi", nilai: site.alamat },
  { ikon: MessageCircle, label: "WhatsApp admin", nilai: site.telepon, href: waLink("Halo Admin RentCar,") },
  { ikon: Mail, label: "Email", nilai: site.email, href: `mailto:${site.email}` },
  { ikon: Clock, label: "Jam layanan", nilai: site.jamOperasional },
];

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Hubungi Kami</h1>
        <p className="mt-3 text-sm text-body">
          <Link href="/" className="text-primary hover:underline">
            Beranda
          </Link>{" "}
          / Kontak
        </p>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-body">
          Cara tercepat adalah lewat WhatsApp — biasanya dibalas dalam beberapa menit di jam layanan.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <ContactForm />
        <div className="relative hidden min-h-[420px] overflow-hidden rounded-3xl lg:block">
          <CarImage src={fotoTentang} alt="Garasi RentCar" sizes="50vw" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INFO.map(({ ikon: Ikon, label, nilai, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white">
                <Ikon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-body">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-[15px] font-bold text-ink hover:text-primary"
                  >
                    {nilai}
                  </a>
                ) : (
                  <p className="text-[15px] font-bold text-ink">{nilai}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-2xl bg-mist px-5 py-4 text-sm leading-relaxed text-body">
          Nomor admin: <strong className="text-ink">{ADMIN_WA.display}</strong>. Kami tidak pernah meminta
          transfer ke rekening selain yang disebutkan admin di chat resmi ini.
        </p>
      </section>

      <CtaBanner />
    </>
  );
}
