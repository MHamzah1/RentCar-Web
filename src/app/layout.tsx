import type { Metadata } from "next";
import "@fontsource-variable/work-sans";
import "./globals.css";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: `${site.nama} — Sewa Mobil Bandung`,
    template: `%s | ${site.nama}`,
  },
  description: site.deskripsi,
};

/**
 * Root layout — hanya kerangka html/body.
 *
 * Navbar & Footer publik ada di `(site)/layout.tsx` supaya area `/admin`
 * tidak ikut memakainya.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
