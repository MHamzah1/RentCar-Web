import { Quote } from "lucide-react";
import Image from "next/image";
import { ulasan } from "@/lib/data";

export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-extrabold text-ink sm:text-4xl">Kata penyewa kami</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-body">
        Sebagian besar penyewa kami kembali lagi — dan itu ukuran yang paling jujur.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ulasan.map((u) => (
          <figure
            key={u.nama}
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-mist"
          >
            <blockquote className="flex-1 px-7 pb-10 pt-8 text-center">
              <Quote className="mx-auto size-8 rotate-180 fill-primary text-primary" />
              <p className="mt-4 text-[15px] leading-relaxed text-ink">{u.kutipan}</p>
            </blockquote>
            <figcaption className="relative bg-primary px-7 pb-6 pt-12 text-center">
              <span className="absolute -top-9 left-1/2 size-[72px] -translate-x-1/2 overflow-hidden rounded-full border-4 border-white">
                <Image src={u.avatar} alt={u.nama} fill sizes="72px" className="object-cover" />
              </span>
              <p className="text-sm text-white/70">{u.kota}</p>
              <p className="text-base font-bold text-white">{u.nama}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
