import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  DoorOpen,
  Eye,
  Fuel,
  Settings2,
  Snowflake,
  Users,
} from "lucide-react";
import { CarImage } from "@/components/car-image";
import {
  Baris,
  BarisUang,
  Card,
  CardHeader,
  PageHeader,
  Pill,
  StatusBadge,
  Table,
  TabelKosong,
  Td,
  Th,
  tombolKedua,
  tombolUtama,
} from "@/components/admin/ui";
import { daftarTransaksi, getMobil } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { rupiah, tanggalSingkat } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mobil = getMobil(slug, "ADMIN");
  return { title: mobil ? mobil.nama : "Mobil tidak ditemukan" };
}

export default async function DetailMobilPage({ params }: { params: Promise<{ slug: string }> }) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const { slug } = await params;
  const m = getMobil(slug, admin.peran);
  if (!m) notFound();

  const riwayat = daftarTransaksi(admin.peran).filter((t) => t.carSlug === slug);
  const spesifikasi = [
    { ikon: Settings2, label: "Transmisi", nilai: m.spesifikasi.transmisi },
    { ikon: Fuel, label: "Bahan bakar", nilai: m.spesifikasi.bahanBakar },
    { ikon: Users, label: "Kursi", nilai: `${m.spesifikasi.kursi} orang` },
    { ikon: DoorOpen, label: "Pintu", nilai: String(m.spesifikasi.pintu) },
    { ikon: Snowflake, label: "AC", nilai: m.spesifikasi.ac ? "Ya" : "Tidak" },
    { ikon: Users, label: "Bagasi", nilai: m.spesifikasi.bagasi },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/katalog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Kembali ke katalog
      </Link>

      <PageHeader
        judul={m.nama}
        deskripsi={`${m.merek} · ${m.tahun} · ${m.kategori}`}
        aksi={
          <>
            <Link href={`/vehicles/${m.slug}`} className={tombolKedua}>
              <Eye className="size-4" />
              Lihat di landing page
            </Link>
            {m.unitTersedia > 0 ? (
              <Link href={`/admin/transaksi/baru?mobil=${m.slug}`} className={tombolUtama}>
                <CalendarPlus className="size-4" />
                Booking mobil ini
              </Link>
            ) : (
              <span className={`${tombolUtama} cursor-not-allowed opacity-50`} aria-disabled>
                Unit habis
              </span>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Foto & spesifikasi */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative h-64 bg-mist sm:h-80">
              <CarImage src={m.foto} alt={m.nama} sizes="(max-width: 1024px) 100vw, 55vw" priority />
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {m.galeri.slice(1, 4).map((foto, i) => (
                <div key={foto} className="relative h-20 overflow-hidden rounded-xl bg-mist">
                  <CarImage src={foto} alt={`${m.nama} foto ${i + 2}`} sizes="20vw" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader judul="Spesifikasi" />
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
              {spesifikasi.map(({ ikon: Ikon, label, nilai }) => (
                <div key={label} className="rounded-xl bg-mist p-3.5">
                  <Ikon className="size-4 text-primary" />
                  <p className="mt-2 text-[12px] text-body">{label}</p>
                  <p className="text-[13px] font-bold text-ink">{nilai}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader judul="Deskripsi & fasilitas" deskripsi="Teks ini juga tampil di landing page." />
            <div className="p-5">
              <p className="text-sm leading-relaxed text-body">{m.deskripsi}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {m.fasilitas.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-body">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Pricing & unit */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              judul="Pricing"
              deskripsi={m.modal ? "Harga modal hanya terlihat oleh Super Admin." : undefined}
            />
            <div className="p-5">
              <BarisUang label="Harga jual / hari" nilai={rupiah(m.sellPricePerDay)} />
              {m.modal ? (
                <>
                  <BarisUang label="Harga modal / hari" nilai={rupiah(m.modal.costPricePerDay)} />
                  <BarisUang
                    label={`Margin (${m.modal.marginPersen}%)`}
                    nilai={rupiah(m.modal.marginPerHari)}
                    nada="sukses"
                    tebal
                  />
                </>
              ) : (
                <p className="mt-3 rounded-xl bg-mist px-3.5 py-3 text-xs leading-relaxed text-body">
                  Harga modal dan margin tidak ditampilkan untuk peran Admin staf.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader judul="Ketersediaan unit" deskripsi="Dihitung dari transaksi yang sedang berjalan." />
            <div className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-ink">{m.unitTersedia}</p>
                  <p className="text-xs text-body">dari {m.totalUnit} unit siap disewakan</p>
                </div>
                <Pill nada={m.unitTersedia > 0 ? "sukses" : "bahaya"}>
                  {m.unitTersedia > 0 ? "Tersedia" : "Habis"}
                </Pill>
              </div>
              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: m.totalUnit }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-full ${i < m.unitTersedia ? "bg-emerald-500" : "bg-line"}`}
                  />
                ))}
              </div>
              <dl className="mt-4">
                <Baris label="Sedang dipakai">{m.unitTerpakai} unit</Baris>
                <Baris label="Tayang di landing page">{m.isPublished ? "Ya" : "Tidak"}</Baris>
              </dl>
              <p className="mt-3 text-[11px] leading-snug text-body">
                Unit tidak dibedakan per plat — yang dicatat hanya jumlah per model.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Riwayat */}
      <Card>
        <CardHeader judul="Riwayat transaksi mobil ini" deskripsi={`${riwayat.length} transaksi tercatat.`} />
        <Table>
          <thead>
            <tr>
              <Th>Kode</Th>
              <Th>Customer</Th>
              <Th>Periode</Th>
              <Th>Durasi</Th>
              <Th className="text-right">Tagihan</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {riwayat.length === 0 ? (
              <TabelKosong kolom={6} pesan="Belum ada transaksi untuk mobil ini." />
            ) : (
              riwayat.map((t) => (
                <tr key={t.kode} className="hover:bg-mist">
                  <Td>
                    <Link href={`/admin/transaksi/${t.kode}`} className="font-mono text-xs font-semibold text-primary">
                      {t.kode}
                    </Link>
                  </Td>
                  <Td className="text-[13px]">{t.namaCustomer}</Td>
                  <Td className="whitespace-nowrap text-[13px] text-body">
                    {tanggalSingkat(t.startDate)} – {tanggalSingkat(t.endDate)}
                  </Td>
                  <Td className="text-[13px]">{t.durationDays} hari</Td>
                  <Td className="text-right text-[13px] font-semibold tabular-nums">{rupiah(t.totalTagihan)}</Td>
                  <Td>
                    <StatusBadge status={t.status} />
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
