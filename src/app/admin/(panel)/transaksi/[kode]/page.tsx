import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  Bike,
  CalendarDays,
  Clock,
  MessageCircle,
  UserRound,
  Wallet,
} from "lucide-react";
import { CarImage } from "@/components/car-image";
import { TransaksiAksi } from "@/components/admin/transaksi-aksi";
import {
  Baris,
  BarisUang,
  BayarBadge,
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
} from "@/components/admin/ui";
import { getTransaksi } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { rupiah, tanggalPanjang, tanggalSingkat, waLink } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ kode: string }> }): Promise<Metadata> {
  const { kode } = await params;
  return { title: kode };
}

export default async function DetailTransaksiPage({ params }: { params: Promise<{ kode: string }> }) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const { kode } = await params;
  const t = getTransaksi(kode, admin.peran);
  if (!t) notFound();

  const pesanWa = `Halo ${t.namaCustomer}, dari admin RentCar soal sewa ${t.namaMobil} (${t.kode}).`;

  return (
    <div className="space-y-6">
      <Link href="/admin/transaksi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Kembali ke daftar transaksi
      </Link>

      <PageHeader
        judul={t.kode}
        deskripsi={`Dibuat ${tanggalPanjang(t.dibuatPada)} oleh ${t.namaAdmin}`}
        aksi={
          <>
            <StatusBadge status={t.status} />
            <BayarBadge status={t.statusBayar} />
            <a href={waLink(pesanWa)} target="_blank" rel="noreferrer" className={tombolKedua}>
              <MessageCircle className="size-4" />
              Chat customer
            </a>
          </>
        }
      />

      {t.status === "CANCELLED" ? (
        <p className="flex items-start gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-700">
          <Ban className="mt-0.5 size-4 shrink-0" />
          <span>
            Transaksi dibatalkan pada {t.dibatalkanPada ? tanggalPanjang(t.dibatalkanPada) : "-"}. Unit sudah
            kembali ke stok.
            {t.alasanBatal ? <> Alasan: {t.alasanBatal}</> : null}
          </span>
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Kolom kiri */}
        <div className="space-y-4">
          {/* Mobil & sewa */}
          <Card>
            <CardHeader judul="Mobil & periode sewa" />
            <div className="flex flex-wrap gap-5 p-5">
              <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl bg-mist">
                <CarImage src={t.fotoMobil} alt={t.namaMobil} sizes="180px" />
              </div>
              <div className="min-w-[16rem] flex-1">
                <Link href={`/admin/katalog/${t.carSlug}`} className="text-[15px] font-bold text-ink hover:text-primary">
                  {t.namaMobil}
                </Link>
                <p className="text-xs text-body">{t.kategoriMobil}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill nada={t.pakaiSopir ? "primary" : "netral"}>
                    <UserRound className="size-3" />
                    {t.pakaiSopir ? "Dengan sopir" : "Lepas kunci"}
                  </Pill>
                  {t.hariTambahan > 0 ? <Pill nada="primary">Diperpanjang {t.hariTambahan} hari</Pill> : null}
                </div>
                <dl className="mt-3">
                  <Baris label="Mulai sewa">
                    {tanggalPanjang(t.startDate)} · jam {t.jamBerangkat}
                  </Baris>
                  <Baris label="Durasi">{t.durationDays} hari</Baris>
                  <Baris label="Batas kembali">
                    {tanggalPanjang(t.endDate)} · jam {t.jamBerangkat}
                  </Baris>
                  {t.jamTelat > 0 ? (
                    <Baris label="Keterlambatan">
                      <span className="text-red-600">{t.jamTelat} jam</span>
                    </Baris>
                  ) : null}
                </dl>
              </div>
            </div>
          </Card>

          {/* Customer & jaminan */}
          <Card>
            <CardHeader
              judul="Customer & jaminan"
              aksi={
                <Link
                  href={`/admin/customer/${t.customerId}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Lihat profil
                </Link>
              }
            />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                  <UserRound className="size-4 text-primary" />
                  Penyewa
                </p>
                <p className="mt-2 text-[15px] font-bold text-ink">{t.namaCustomer}</p>
                <p className="text-[13px] text-body">{t.noHpCustomer}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                  <Bike className="size-4 text-primary" />
                  Jaminan dititipkan
                </p>
                <p className="mt-2 text-[13px] text-ink">{t.jaminanRingkas}</p>
              </div>
            </div>
            {t.catatan ? (
              <p className="border-t border-line px-5 py-3.5 text-[13px] leading-relaxed text-body">
                <strong className="text-ink">Catatan: </strong>
                {t.catatan}
              </p>
            ) : null}
          </Card>

          {/* Pembayaran */}
          <Card>
            <CardHeader
              judul="Riwayat pembayaran"
              deskripsi={`${t.pembayaran.length} pembayaran tercatat.`}
              aksi={<BayarBadge status={t.statusBayar} />}
            />
            <Table>
              <thead>
                <tr>
                  <Th>Jenis</Th>
                  <Th>Tanggal</Th>
                  <Th>Metode</Th>
                  <Th className="text-right">Jumlah</Th>
                </tr>
              </thead>
              <tbody>
                {t.pembayaran.length === 0 ? (
                  <TabelKosong kolom={4} pesan="Belum ada pembayaran masuk untuk transaksi ini." />
                ) : (
                  t.pembayaran.map((p) => (
                    <tr key={p.id}>
                      <Td>
                        <Pill nada={p.jenis === "Denda" ? "bahaya" : p.jenis === "DP" ? "peringatan" : "sukses"}>
                          {p.jenis}
                        </Pill>
                      </Td>
                      <Td className="text-[13px] text-body">{tanggalSingkat(p.dibayarPada)}</Td>
                      <Td className="text-[13px]">{p.metode}</Td>
                      <Td className="text-right text-[13px] font-semibold tabular-nums">{rupiah(p.jumlah)}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </div>

        {/* Kolom kanan */}
        <div className="space-y-4">
          {/* Rincian tagihan */}
          <Card>
            <CardHeader judul="Rincian tagihan" />
            <div className="p-5">
              <BarisUang
                label={`Sewa ${t.durationDays} hari × ${rupiah(t.sellPricePerDay)}`}
                nilai={rupiah(t.biayaSewa)}
              />
              {t.pakaiSopir ? (
                <BarisUang
                  label={`Sopir ${t.durationDays} hari × ${rupiah(t.hargaSopirPerHari)}`}
                  nilai={rupiah(t.biayaSopir)}
                />
              ) : null}
              {t.denda > 0 ? (
                <BarisUang
                  label={t.jamTelat > 0 ? `Denda ${t.jamTelat} jam` : "Denda keterlambatan"}
                  nilai={rupiah(t.denda)}
                  nada="bahaya"
                />
              ) : null}
              <BarisUang label="Total tagihan" nilai={rupiah(t.totalTagihan)} tebal />
              <div className="mt-3 space-y-1 rounded-xl bg-mist p-3.5">
                <BarisUang label="Sudah dibayar" nilai={rupiah(t.totalDibayar)} nada="sukses" />
                <BarisUang
                  label="Sisa tagihan"
                  nilai={rupiah(t.sisaTagihan)}
                  nada={t.sisaTagihan > 0 ? "bahaya" : "sukses"}
                />
              </div>

              {t.modal ? (
                <div className="mt-4 rounded-xl border border-line p-3.5">
                  <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                    <Wallet className="size-4 text-primary" />
                    Hanya Super Admin
                  </p>
                  <div className="mt-1">
                    <BarisUang label={`Modal mobil × ${t.durationDays} hari`} nilai={rupiah(t.modal.costPricePerDay * t.durationDays)} />
                    {t.pakaiSopir ? (
                      <BarisUang
                        label={`Upah sopir × ${t.durationDays} hari`}
                        nilai={rupiah(t.modal.upahSopirPerHari * t.durationDays)}
                      />
                    ) : null}
                    <BarisUang label="Total modal" nilai={rupiah(t.modal.totalCost)} />
                    <BarisUang
                      label={`Laba (${t.modal.marginPersen}%)`}
                      nilai={rupiah(t.modal.profit)}
                      nada="sukses"
                      tebal
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-mist px-3.5 py-3 text-xs leading-relaxed text-body">
                  Modal dan laba tidak ditampilkan untuk peran Admin staf.
                </p>
              )}
            </div>
          </Card>

          {/* Aksi status */}
          {t.status === "DONE" ? (
            <Card>
              <div className="flex items-start gap-3 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CalendarDays className="size-5" />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-ink">Transaksi selesai</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-body">
                    Mobil sudah kembali dan unit tersedia lagi di katalog.
                    {t.denda > 0 ? ` Denda ${rupiah(t.denda)} sudah ditagih.` : ""}
                  </p>
                </div>
              </div>
            </Card>
          ) : t.status === "CANCELLED" ? (
            <Card>
              <div className="flex items-start gap-3 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-500">
                  <Ban className="size-5" />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-ink">Booking dibatalkan</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-body">
                    Tidak ada aksi lanjutan. Aturan DP hangus atau dikembalikan belum diputuskan — lihat
                    pertanyaan terbuka di docs.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <TransaksiAksi
              status={t.status}
              jamTelat={t.jamTelat}
              denda={t.denda}
              sisaTagihan={t.sisaTagihan}
              hargaPerHari={t.sellPricePerDay}
              hargaSopirPerHari={t.hargaSopirPerHari}
              pakaiSopir={t.pakaiSopir}
              endDate={t.endDate}
              videoSerahTerima={t.videoSerahTerima}
              videoDiunggahPada={t.videoDiunggahPada}
            />
          )}

          {/* Linimasa status */}
          <Card>
            <CardHeader judul="Alur status" />
            <ol className="space-y-3 p-5">
              {[
                { label: "Booking dibuat", aktif: true, catatan: tanggalSingkat(t.dibuatPada) },
                {
                  label: "Berangkat (video wajib)",
                  aktif: t.videoSerahTerima !== null,
                  catatan: t.videoDiunggahPada ?? "Belum berangkat",
                },
                {
                  label: "Lewat waktu",
                  aktif: t.jamTelat > 0,
                  catatan: t.jamTelat > 0 ? `${t.jamTelat} jam · ${rupiah(t.denda)}` : "Tidak terjadi",
                },
                {
                  label: "Selesai",
                  aktif: t.statusTersimpan === "DONE",
                  catatan: t.statusTersimpan === "DONE" ? "Unit kembali ke stok" : "Belum",
                },
              ].map((l) => (
                <li key={l.label} className="flex gap-3">
                  <span
                    className={`mt-1 size-2.5 shrink-0 rounded-full ${l.aktif ? "bg-primary" : "bg-line"}`}
                  />
                  <span className="min-w-0">
                    <span className={`block text-[13px] font-semibold ${l.aktif ? "text-ink" : "text-body"}`}>
                      {l.label}
                    </span>
                    <span className="block text-xs text-body">{l.catatan}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="flex items-start gap-2 border-t border-line px-5 py-3 text-[11px] leading-snug text-body">
              <Clock className="mt-0.5 size-3.5 shrink-0" />
              Status Lewat Waktu dihitung otomatis dari batas kembali — tidak ada tombol untuk mengaktifkannya.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
