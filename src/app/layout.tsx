import type { Metadata } from "next";
import "@fontsource-variable/work-sans";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Car Rental Made Simple`,
    template: `%s | ${site.name}`,
  },
  description:
    "RentCar — experience the road like never before. 540+ well-maintained cars, transparent pricing, unlimited mileage, and pickup wherever you need it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
