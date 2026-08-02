import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight, Clock, Plus, UserRound } from "lucide-react";
import { TransaksiFilter } from "@/components/admin/transaksi-filter";
import {
  BayarBadge,
  Card,
  PageHeader,
  Pill,
  StatusBadge,
  Table,
  TabelKosong,
  Td,
  Th,
  tombolUtama,
} from "@/components/admin/ui";
import { filterTransaksi, rekapTransaksi, type StatusTampil } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { rupiah, rupiahRingkas, tanggalSingkat } from "@/lib/constants";

export const metadata: Metadata = { title: "Transaksi" };

export default async function TransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; cari?: string; mulai?: string; selesai?: string }>;
}) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const q = await searchParams;
  const daftar = filterTransaksi(admin.peran, {
    status: (q.status as StatusTampil | "SEMUA" | undefined) ?? "SEMUA",
    cari: q.cari,
    mulai: q.mulai,
    selesai: q.selesai,
  });
  const rekap = rekapTransaksi(daftar);
  const superAdmin = admin.peran === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Transaksi"
        deskripsi="Semua booking yang diinput admin. Transaksi baru dimulai dari katalog mobil."
        aksi={
          <Link href="/admin/katalog" className={tombolUtama}>
            <Plus className="size-4" />
            Booking baru
          </Link>
        }
      />

      <Suspense fallback={<Card className="h-40 animate-pulse bg-mist" />}>
        <TransaksiFilter />
      </Suspense>

      {/* Ringkasan hasil filter */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RingkasKecil label="Transaksi" nilai={String(rekap.jumlah)} />
        <RingkasKecil label="Total tagihan" nilai={rupiahRingkas(rekap.totalTagihan)} />
        <RingkasKecil label="Sudah dibayar" nilai={rupiahRingkas(rekap.totalDibayar)} />
        {superAdmin ? (
          <RingkasKecil label="Laba" nilai={rupiahRingkas(rekap.profit)} nada="sukses" />
        ) : (
          <RingkasKecil label="Denda terkumpul" nilai={rupiahRingkas(rekap.totalDenda)} />
        )}
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Kode & mobil</Th>
              <Th>Customer</Th>
              <Th>Periode</Th>
              <Th className="text-right">Tagihan</Th>
              <Th>Bayar</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {daftar.length === 0 ? (
              <TabelKosong kolom={7} pesan="Tidak ada transaksi yang cocok dengan filter." />
            ) : (
              daftar.map((t) => (
                <tr key={t.kode} className={t.status === "OVERTIME" ? "bg-red-50/50" : "hover:bg-mist"}>
                  <Td>
                    <Link href={`/admin/transaksi/${t.kode}`} className="block">
                      <span className="block font-mono text-xs font-semibold text-primary">{t.kode}</span>
                      <span className="block text-[13px] font-bold text-ink">{t.namaMobil}</span>
                      {t.pakaiSopir ? (
                        <span className="mt-1 inline-flex">
                          <Pill nada="primary">
                            <UserRound className="size-3" />
                            Dengan sopir
                          </Pill>
                        </span>
                      ) : null}
                    </Link>
                  </Td>
                  <Td>
                    <span className="block text-[13px] text-ink">{t.namaCustomer}</span>
                    <span className="block text-xs text-body">{t.noHpCustomer}</span>
                  </Td>
                  <Td className="whitespace-nowrap">
                    <span className="block text-[13px] text-ink">
                      {tanggalSingkat(t.startDate)} – {tanggalSingkat(t.endDate)}
                    </span>
                    <span className="block text-xs text-body">
                      {t.durationDays} hari
                      {t.hariTambahan > 0 ? ` (+${t.hariTambahan} perpanjangan)` : ""}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap text-right">
                    <span className="block text-[13px] font-bold tabular-nums text-ink">
                      {rupiah(t.totalTagihan)}
                    </span>
                    {t.sisaTagihan > 0 ? (
                      <span className="block text-xs font-semibold text-red-600">
                        sisa {rupiah(t.sisaTagihan)}
                      </span>
                    ) : null}
                  </Td>
                  <Td>
                    <BayarBadge status={t.statusBayar} />
                  </Td>
                  <Td>
                    <StatusBadge status={t.status} />
                    {t.jamTelat > 0 ? (
                      <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                        <Clock className="size-3" />
                        {t.jamTelat} jam
                      </span>
                    ) : null}
                  </Td>
                  <Td className="text-right">
                    <Link href={`/admin/transaksi/${t.kode}`} className="inline-flex text-primary">
                      <ChevronRight className="size-4" />
                    </Link>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

function RingkasKecil({
  label,
  nilai,
  nada = "netral",
}: {
  label: string;
  nilai: string;
  nada?: "netral" | "sukses";
}) {
  return (
    <Card className="px-4 py-3.5">
      <p className="text-xs text-body">{label}</p>
      <p className={`mt-1 text-xl font-extrabold ${nada === "sukses" ? "text-emerald-600" : "text-ink"}`}>
        {nilai}
      </p>
    </Card>
  );
}
