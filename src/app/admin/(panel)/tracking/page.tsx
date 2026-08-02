import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Info, SatelliteDish } from "lucide-react";
import { PetaTracking } from "@/components/admin/peta-tracking";
import { Card, Kosong, PageHeader, Pill, tombolKedua } from "@/components/admin/ui";
import { unitDilacak, unitTanpaSinyal } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Tracking" };

export default async function TrackingPage() {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const unit = unitDilacak(admin.peran);
  const tanpaSinyal = unitTanpaSinyal(admin.peran);
  const telat = unit.filter((u) => u.status === "OVERTIME").length;

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Tracking Mobil"
        deskripsi="Posisi unit yang sedang di luar — sedang perjalanan, diperpanjang, atau lewat waktu."
        aksi={
          <>
            <Pill nada="primary">{unit.length} unit dilacak</Pill>
            {telat > 0 ? <Pill nada="bahaya">{telat} lewat waktu</Pill> : null}
          </>
        }
      />

      <p className="flex items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-[13px] leading-relaxed text-blue-900">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          <strong>Peta ini masih tampilan sementara.</strong> Vendor GPS tracker dan library peta belum
          diputuskan — begitu vendornya jelas, penanda di bawah tinggal disambungkan ke API-nya. Koordinat yang
          dipakai sekarang adalah data contoh. Lihat pertanyaan terbuka no. 1 di{" "}
          <code>docs/06-keputusan-teknis.md</code>.
        </span>
      </p>

      {unit.length === 0 ? (
        <Kosong
          judul="Tidak ada mobil di luar"
          pesan="Semua unit sedang di garasi. Penanda akan muncul begitu ada transaksi yang berjalan."
          aksi={
            <Link href="/admin/transaksi" className={tombolKedua}>
              Lihat transaksi
            </Link>
          }
        />
      ) : (
        <PetaTracking unit={unit} />
      )}

      {tanpaSinyal.length > 0 ? (
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
            <SatelliteDish className="size-4 text-amber-500" />
            {tanpaSinyal.length} unit di luar tanpa data posisi
          </p>
          <p className="mt-1 text-[13px] text-body">
            Unit ini sedang disewa tapi belum mengirim koordinat — kemungkinan trackernya belum terpasang.
          </p>
          <ul className="mt-3 space-y-1.5">
            {tanpaSinyal.map((u) => (
              <li key={u.kode} className="text-[13px] text-body">
                <Link href={`/admin/transaksi/${u.kode}`} className="font-semibold text-primary hover:underline">
                  {u.kode}
                </Link>{" "}
                — {u.namaMobil} ({u.namaCustomer})
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
