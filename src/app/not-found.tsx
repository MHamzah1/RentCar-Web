import Link from "next/link";
import { CarFront } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <span className="grid size-20 place-items-center rounded-3xl bg-primary-soft text-primary">
        <CarFront className="size-9" />
      </span>
      <h1 className="mt-6 text-4xl font-extrabold text-ink">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-[15px] text-body">
        Alamat yang Anda tuju tidak ada. Kembali ke beranda dan pilih jalur lain.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
        >
          Kembali ke beranda
        </Link>
        <Link
          href="/vehicles"
          className="rounded-xl border border-line px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:border-primary hover:text-primary"
        >
          Lihat armada
        </Link>
      </div>
    </section>
  );
}
