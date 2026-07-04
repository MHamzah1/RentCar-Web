import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CarImage } from "@/components/car-image";
import { CtaBanner } from "@/components/sections";
import { aboutHeroImage, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the RentCar team — bookings, partnerships and support.",
};

const info = [
  { icon: MapPin, label: "Address", value: site.address },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
  { icon: Clock, label: "Opening hours", value: site.hours },
];

export default function ContactPage() {
  return (
    <>
      {/* Heading */}
      <section className="mx-auto max-w-7xl px-4 pt-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Contact Us</h1>
        <p className="mt-3 text-sm text-body">
          <span className="text-primary">Home</span> / Contact Us
        </p>
      </section>

      {/* Form + image */}
      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <ContactForm />
        <div className="relative hidden min-h-[420px] overflow-hidden rounded-3xl lg:block">
          <CarImage src={aboutHeroImage} alt="RentCar office fleet" sizes="50vw" />
        </div>
      </section>

      {/* Info row */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {info.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-white">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm text-body">{label}</p>
                {href ? (
                  <a href={href} className="text-[15px] font-bold text-ink hover:text-primary">
                    {value}
                  </a>
                ) : (
                  <p className="text-[15px] font-bold text-ink">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
