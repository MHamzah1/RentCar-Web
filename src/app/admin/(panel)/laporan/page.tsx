import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileSpreadsheet, Info } from "lucide-react";
import {
  BayarBadge,
  Card,
  CardHeader,
  Label,
  PageHeader,
  StatusBadge,
  Table,
  TabelKosong,
  Td,
  Th,
  inputDasar,
  tombolKedua,
  tombolUtama,
} from "@/components/admin/ui";
import { STATUS_LABEL, URUTAN_STATUS, filterTransaksi, rekapTransaksi, type StatusTampil } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { HARI_INI, namaBulan, rupiah, rupiahRingkas, tambahHari, tanggalSingkat } from "@/lib/constants";

export const metadata: Metadata = { title: "Laporan" };

const awalBulanIni = `${HARI_INI.slice(0, 7)}-01`;
const bulanLalu = tambahHari(awalBulanIni, -1);
const awalBulanLalu = `${bulanLalu.slice(0, 7)}-01`;

const PINTASAN = [
  { label: "Hari ini", mulai: HARI_INI, selesai: HARI_INI },
  { label: "7 hari terakhir", mulai: tambahHari(HARI_INI, -6), selesai: HARI_INI },
  { label: namaBulan(HARI_INI.slice(0, 7)), mulai: awalBulanIni, selesai: HARI_INI },
  { label: namaBulan(bulanLalu.slice(0, 7)), mulai: awalBulanLalu, selesai: bulanLalu },
];

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ mulai?: string; selesai?: string; status?: string }>;
}) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const q = await searchParams;
  const mulai = q.mulai ?? awalBulanIni;
  const selesai = q.selesai ?? HARI_INI;
  const status = (q.status as StatusTampil | "SEMUA" | undefined) ?? "SEMUA";
  const superAdmin = admin.peran === "SUPER_ADMIN";

  const daftar = filterTransaksi(admin.peran, { mulai, selesai, status });
  const rekap = rekapTransaksi(daftar);

  const paramUnduh = new URLSearchParams({ mulai, selesai });
  if (status !== "SEMUA") paramUnduh.set("status", status);

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Laporan & Export"
        deskripsi="Rekap transaksi per rentang tanggal. Atur periodenya, lihat pratinjaunya, lalu unduh."
      />

      {/* Filter periode */}
      <Card>
        <CardHeader judul="Periode" deskripsi="Difilter berdasarkan tanggal mulai sewa." />
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            {PINTASAN.map((p) => {
              const aktif = p.mulai === mulai && p.selesai === selesai;
              return (
                <Link
                  key={p.label}
                  href={`/admin/laporan?mulai=${p.mulai}&selesai=${p.selesai}${status !== "SEMUA" ? `&status=${status}` : ""}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    aktif ? "bg-primary text-white" : "bg-mist text-ink hover:bg-primary-soft"
                  }`}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>

          {/* Form GET biasa — tidak butuh JavaScript sama sekali. */}
          <form method="get" className="flex flex-wrap items-end gap-3">
            <label className="block">
              <Label>Dari tanggal</Label>
              <input type="date" name="mulai" defaultValue={mulai} className={inputDasar} />
            </label>
            <label className="block">
              <Label>Sampai tanggal</Label>
              <input type="date" name="selesai" defaultValue={selesai} className={inputDasar} />
            </label>
            <label className="block">
              <Label>Status</Label>
              <select name="status" defaultValue={status} className={inputDasar}>
                <option value="SEMUA">Semua status</option>
                {URUTAN_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={tombolKedua}>
              Terapkan
            </button>
            <a href={`/api/admin/laporan?${paramUnduh.toString()}`} className={tombolUtama}>
              <Download className="size-4" />
              Unduh rekap
            </a>
          </form>
        </div>
      </Card>

      {/* Ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Ringkas label="Jumlah transaksi" nilai={String(rekap.jumlah)} catatan={`${rekap.totalHari} hari sewa`} />
        <Ringkas label="Total tagihan" nilai={rupiahRingkas(rekap.totalTagihan)} catatan={rupiah(rekap.totalTagihan)} />
        <Ringkas
          label="Sudah dibayar"
          nilai={rupiahRingkas(rekap.totalDibayar)}
          catatan={`Sisa ${rupiah(rekap.totalTagihan - rekap.totalDibayar)}`}
        />
        {superAdmin ? (
          <Ringkas label="Laba" nilai={rupiahRingkas(rekap.profit)} catatan={`Modal ${rupiahRingkas(rekap.totalCost)}`} nada="sukses" />
        ) : (
          <Ringkas label="Denda terkumpul" nilai={rupiahRingkas(rekap.totalDenda)} catatan="Dari keterlambatan" />
        )}
      </div>

      <p className="flex items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-[13px] leading-relaxed text-blue-900">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          {superAdmin ? (
            <>
              Berkas unduhan ikut memuat kolom <strong>harga modal, total modal, dan laba</strong> karena kamu
              Super Admin.
            </>
          ) : (
            <>
              Berkas unduhan <strong>tidak memuat kolom modal dan laba</strong> — kolomnya memang tidak dibuat
              untuk peran Admin staf, bukan sekadar dikosongkan.
            </>
          )}{" "}
          Formatnya CSV (langsung terbuka di Excel). Versi <code>.xlsx</code> dengan format Rupiah menyusul saat
          backend disiapkan.
        </span>
      </p>

      {/* Pratinjau */}
      <Card>
        <CardHeader
          judul="Pratinjau isi berkas"
          deskripsi={`${tanggalSingkat(mulai)} – ${tanggalSingkat(selesai)} · ${daftar.length} baris`}
          aksi={
            <a href={`/api/admin/laporan?${paramUnduh.toString()}`} className={tombolKedua}>
              <FileSpreadsheet className="size-4" />
              Unduh
            </a>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Kode</Th>
              <Th>Periode</Th>
              <Th>Mobil</Th>
              <Th>Customer</Th>
              <Th>Layanan</Th>
              <Th className="text-right">Tagihan</Th>
              <Th className="text-right">Dibayar</Th>
              {superAdmin ? <Th className="text-right">Laba</Th> : null}
              <Th>Bayar</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {daftar.length === 0 ? (
              <TabelKosong kolom={superAdmin ? 10 : 9} pesan="Tidak ada transaksi pada periode ini." />
            ) : (
              daftar.map((t) => (
                <tr key={t.kode} className="hover:bg-mist">
                  <Td>
                    <Link href={`/admin/transaksi/${t.kode}`} className="font-mono text-xs font-semibold text-primary">
                      {t.kode}
                    </Link>
                  </Td>
                  <Td className="whitespace-nowrap text-[13px] text-body">
                    {tanggalSingkat(t.startDate)} – {tanggalSingkat(t.endDate)}
                  </Td>
                  <Td className="text-[13px]">{t.namaMobil}</Td>
                  <Td className="text-[13px]">{t.namaCustomer}</Td>
                  <Td className="text-[13px] text-body">{t.pakaiSopir ? "Dengan sopir" : "Lepas kunci"}</Td>
                  <Td className="text-right text-[13px] font-semibold tabular-nums">{rupiah(t.totalTagihan)}</Td>
                  <Td className="text-right text-[13px] tabular-nums text-body">{rupiah(t.totalDibayar)}</Td>
                  {superAdmin ? (
                    <Td className="text-right text-[13px] font-semibold tabular-nums text-emerald-600">
                      {rupiah(t.modal?.profit ?? 0)}
                    </Td>
                  ) : null}
                  <Td>
                    <BayarBadge status={t.statusBayar} />
                  </Td>
                  <Td>
                    <StatusBadge status={t.status} />
                  </Td>
                </tr>
              ))
            )}
          </tbody>
          {daftar.length > 0 ? (
            <tfoot>
              <tr className="bg-mist font-bold">
                <Td className="text-[13px]">TOTAL</Td>
                <Td className="text-[13px] text-body">{rekap.totalHari} hari</Td>
                <Td />
                <Td />
                <Td />
                <Td className="text-right text-[13px] tabular-nums">{rupiah(rekap.totalTagihan)}</Td>
                <Td className="text-right text-[13px] tabular-nums">{rupiah(rekap.totalDibayar)}</Td>
                {superAdmin ? (
                  <Td className="text-right text-[13px] tabular-nums text-emerald-600">{rupiah(rekap.profit)}</Td>
                ) : null}
                <Td />
                <Td />
              </tr>
            </tfoot>
          ) : null}
        </Table>
      </Card>
    </div>
  );
}

function Ringkas({
  label,
  nilai,
  catatan,
  nada = "netral",
}: {
  label: string;
  nilai: string;
  catatan?: string;
  nada?: "netral" | "sukses";
}) {
  return (
    <Card className="p-5">
      <p className="text-[13px] text-body">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold ${nada === "sukses" ? "text-emerald-600" : "text-ink"}`}>
        {nilai}
      </p>
      {catatan ? <p className="mt-1 text-xs text-body">{catatan}</p> : null}
    </Card>
  );
}
