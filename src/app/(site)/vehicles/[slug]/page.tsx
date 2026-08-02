import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  DoorOpen,
  Fuel,
  Luggage,
  Settings2,
  Snowflake,
  UserRound,
  Users,
} from "lucide-react";
import { Gallery } from "@/components/gallery";
import { KartuMobil } from "@/components/car-cards";
import { CtaBanner, SyaratSewa } from "@/components/sections";
import { TombolWa, pesanMobil } from "@/components/tombol-wa";
import { cars, getCar, hargaSopirPerHari } from "@/lib/data";
import { rupiah } from "@/lib/constants";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mobil = getCar(slug);
  if (!mobil) return { title: "Mobil tidak ditemukan" };
  return {
    title: `Sewa ${mobil.nama} — ${rupiah(mobil.hargaPerHari)}/hari`,
    description: mobil.deskripsi,
  };
}

export default async function DetailMobilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mobil = getCar(slug);
  if (!mobil) notFound();

  const spesifikasi = [
    { ikon: Settings2, label: "Transmisi", nilai: mobil.spesifikasi.transmisi },
    { ikon: Fuel, label: "Bahan bakar", nilai: mobil.spesifikasi.bahanBakar },
    { ikon: Users, label: "Kapasitas", nilai: `${mobil.spesifikasi.kursi} kursi` },
    { ikon: DoorOpen, label: "Pintu", nilai: String(mobil.spesifikasi.pintu) },
    { ikon: Snowflake, label: "AC", nilai: mobil.spesifikasi.ac ? "Ya" : "Tidak" },
    { ikon: Luggage, label: "Bagasi", nilai: mobil.spesifikasi.bagasi },
  ];

  const lainnya = cars.filter((c) => c.slug !== mobil.slug).slice(0, 3);
  const tersedia = mobil.unitTersedia > 0;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <p className="text-sm text-body">
          <Link href="/" className="text-primary hover:underline">
            Beranda
          </Link>{" "}
          /{" "}
          <Link href="/vehicles" className="text-primary hover:underline">
            Armada Mobil
          </Link>{" "}
          / {mobil.nama}
        </p>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{mobil.nama}</h1>
                <p className="mt-1 text-sm text-body">
                  {mobil.kategori} · {mobil.tahun} · {mobil.merek}
                </p>
              </div>
              <p className="text-3xl font-extrabold text-primary">
                {rupiah(mobil.hargaPerHari)}
                <span className="text-base font-medium text-body"> / hari</span>
              </p>
            </div>

            <div className="mt-6">
              <Gallery images={mobil.galeri} alt={mobil.nama} />
            </div>
          </div>

          <div>
            <div
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 ${
                tersedia ? "bg-emerald-50" : "bg-zinc-100"
              }`}
            >
              <span className={`size-2.5 shrink-0 rounded-full ${tersedia ? "bg-emerald-500" : "bg-zinc-400"}`} />
              <p className={`text-sm font-semibold ${tersedia ? "text-emerald-800" : "text-zinc-600"}`}>
                {tersedia
                  ? `Tersedia — ${mobil.unitTersedia} dari ${mobil.totalUnit} unit siap jalan`
                  : "Semua unit sedang disewa. Chat admin untuk cek jadwal kosong berikutnya."}
              </p>
            </div>

            <h2 className="mt-8 text-xl font-bold text-ink">Spesifikasi</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {spesifikasi.map(({ ikon: Ikon, label, nilai }) => (
                <div key={label} className="rounded-2xl bg-mist p-4">
                  <Ikon className="size-5 text-primary" />
                  <p className="mt-3 text-[13px] font-bold text-ink">{label}</p>
                  <p className="mt-0.5 text-[13px] text-body">{nilai}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-body">{mobil.deskripsi}</p>

            <div className="mt-6 rounded-2xl border border-line p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-body">Lepas kunci</span>
                <span className="text-lg font-extrabold text-ink">
                  {rupiah(mobil.hargaPerHari)}
                  <span className="text-xs font-medium text-body"> /hari</span>
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-line pt-2">
                <span className="flex items-center gap-1.5 text-sm text-body">
                  <UserRound className="size-4 text-primary" />
                  Dengan sopir
                </span>
                <span className="text-lg font-extrabold text-ink">
                  {rupiah(mobil.hargaPerHari + hargaSopirPerHari)}
                  <span className="text-xs font-medium text-body"> /hari</span>
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-body">
                Harga sudah termasuk asuransi. Pembayaran diatur bersama admin — tidak ada transaksi di website
                ini.
              </p>
            </div>

            <TombolWa pesan={pesanMobil(mobil)} className="mt-5 w-full py-3.5">
              {tersedia ? "Booking via WhatsApp" : "Tanya jadwal kosong"}
            </TombolWa>

            <h2 className="mt-10 text-xl font-bold text-ink">Fasilitas</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {mobil.fasilitas.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-body">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SyaratSewa ringkas />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Mobil lainnya</h2>
          <Link
            href="/vehicles"
            className="flex items-center gap-2 text-[15px] font-bold text-ink transition-colors hover:text-primary"
          >
            Lihat semua
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lainnya.map((c) => (
            <KartuMobil key={c.slug} mobil={c} />
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
