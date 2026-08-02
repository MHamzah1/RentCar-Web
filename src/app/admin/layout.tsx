import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Internal | RentCar",
    template: "%s — Admin RentCar",
  },
  description: "Panel internal RentCar: katalog, transaksi, customer, tracking, dan laporan.",
  robots: { index: false, follow: false },
};

/** Pembungkus tipis. Kerangka sidebar/topbar ada di `(panel)/layout.tsx`. */
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
