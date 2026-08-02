import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/** Layout halaman publik: navbar + konten + footer. Area /admin tidak memakainya. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
