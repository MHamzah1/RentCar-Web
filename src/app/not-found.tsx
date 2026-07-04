import Link from "next/link";
import { CarFront } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <span className="grid size-20 place-items-center rounded-3xl bg-primary-soft text-primary">
        <CarFront className="size-9" />
      </span>
      <h1 className="mt-6 text-4xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-3 max-w-md text-[15px] text-body">
        The road you took does not exist. Head back and pick another route.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-primary-dark"
      >
        Back to home
      </Link>
    </section>
  );
}
