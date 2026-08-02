import type { Metadata } from "next";
import Link from "next/link";
import { CarFront, ShieldCheck } from "lucide-react";
import { FormLogin } from "./form-login";
import { akunDemo, PASSWORD_DEMO, labelPeran } from "@/lib/auth";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Kiri: form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-white">
              <CarFront className="size-5" strokeWidth={2.2} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-ink">
              Rent<span className="text-primary">Car</span>
            </span>
          </Link>

          <h1 className="mt-8 text-2xl font-bold tracking-tight text-ink">Masuk ke Admin Internal</h1>
          <p className="mt-1.5 text-sm text-body">
            Halaman ini hanya untuk staf RentCar. Customer memesan lewat WhatsApp.
          </p>

          <FormLogin next={next} />

          <div className="mt-8 rounded-2xl border border-line bg-mist p-4">
            <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
              <ShieldCheck className="size-4 text-primary" />
              Akun demo
            </p>
            <p className="mt-1 text-xs text-body">
              Password semua akun: <code className="rounded bg-white px-1.5 py-0.5 font-semibold">{PASSWORD_DEMO}</code>
            </p>
            <ul className="mt-3 space-y-1.5">
              {akunDemo.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-mono text-ink">{a.email}</span>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-semibold text-body">
                    {labelPeran(a.peran)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-snug text-body">
              Coba masuk sebagai keduanya — Super Admin melihat harga modal dan laba, Admin staf tidak.
            </p>
          </div>

          <Link href="/" className="mt-6 block text-center text-sm font-semibold text-primary hover:underline">
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>

      {/* Kanan: panel brand */}
      <div className="relative hidden overflow-hidden bg-[#1b1440] lg:block">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Admin Internal</p>
          <h2 className="mt-4 max-w-md text-4xl font-extrabold leading-tight text-white">
            Semua transaksi rental dalam satu tempat.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Katalog dan harga, data customer, jaminan, pembayaran, tracking unit, sampai rekap laba —
            semuanya diinput dan dipantau dari sini.
          </p>
          <ul className="mt-10 space-y-3">
            {[
              "Booking dibuat admin setelah deal di WhatsApp",
              "Video kondisi unit wajib sebelum mobil berangkat",
              "Status Lewat Waktu muncul otomatis, denda Rp 50.000/jam",
              "Rekap transaksi bisa di-export per rentang tanggal",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
