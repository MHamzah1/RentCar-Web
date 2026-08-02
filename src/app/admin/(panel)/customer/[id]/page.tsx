import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Bike,
  Briefcase,
  FileText,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  ScanLine,
  ShieldAlert,
} from "lucide-react";
import {
  Baris,
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
import { dokumenCustomer, getCustomer, transaksiCustomer } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { rupiah, tanggalPanjang, tanggalSingkat, waLink } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = getCustomer(id);
  return { title: c ? c.namaLengkap : "Customer tidak ditemukan" };
}

export default async function DetailCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const c = getCustomer(id);
  if (!c) notFound();

  const dokumen = dokumenCustomer(c.id);
  const riwayat = transaksiCustomer(c.id, admin.peran);

  return (
    <div className="space-y-6">
      <Link href="/admin/customer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Kembali ke daftar customer
      </Link>

      <PageHeader
        judul={c.namaLengkap}
        deskripsi={`${c.id} · terdaftar ${tanggalPanjang(c.terdaftarPada)}`}
        aksi={
          <>
            {c.langganan ? <Pill nada="primary">Customer langganan</Pill> : <Pill>Customer baru</Pill>}
            {c.diinputLewatScanKtp ? (
              <Pill nada="sukses">
                <ScanLine className="size-3.5" />
                Diinput lewat scan KTP
              </Pill>
            ) : (
              <Pill>Diinput manual</Pill>
            )}
            <a href={waLink(`Halo ${c.namaLengkap}, dari admin RentCar.`)} target="_blank" rel="noreferrer" className={tombolKedua}>
              <Phone className="size-4" />
              Chat WhatsApp
            </a>
          </>
        }
      />

      <p className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        Data di halaman ini bersifat pribadi. Jangan disalin keluar sistem, jangan dikirim lewat chat, dan
        tidak pernah tampil di landing page.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Identitas KTP */}
        <Card>
          <CardHeader judul="Identitas (sesuai KTP)" />
          <dl className="px-5 py-3">
            <Baris label="NIK">
              <span className="font-mono">{c.nik}</span>
            </Baris>
            <Baris label="Nama lengkap">{c.namaLengkap}</Baris>
            <Baris label="Tempat, tanggal lahir">
              {c.tempatLahir}, {tanggalPanjang(c.tanggalLahir)}
            </Baris>
            <Baris label="Jenis kelamin">{c.jenisKelamin}</Baris>
            <Baris label="Alamat">{c.alamat}</Baris>
            <Baris label="RT/RW">{c.rtRw}</Baris>
            <Baris label="Kelurahan / Kecamatan">
              {c.kelurahan} / {c.kecamatan}
            </Baris>
            <Baris label="Agama">{c.agama}</Baris>
            <Baris label="Status perkawinan">{c.statusPerkawinan}</Baris>
            <Baris label="Pekerjaan (KTP)">{c.pekerjaanKtp}</Baris>
            <Baris label="Kewarganegaraan">{c.kewarganegaraan}</Baris>
          </dl>
        </Card>

        {/* Kontak & tambahan */}
        <div className="space-y-4">
          <Card>
            <CardHeader judul="Kontak & data tambahan" />
            <dl className="px-5 py-3">
              <Baris label="No. HP (WhatsApp)">{c.noHpWa}</Baris>
              <Baris label="Email">{c.email}</Baris>
              <Baris label="Instagram">{c.instagram}</Baris>
              <Baris label="TikTok">{c.tiktok}</Baris>
              <Baris label="Kontak darurat">
                {c.daruratNama} ({c.daruratHubungan})
                <span className="block font-normal text-body">{c.daruratNoHp}</span>
              </Baris>
              <Baris label="Status rumah">{c.statusRumah}</Baris>
              <Baris label="Pekerjaan / usaha / kampus">{c.pekerjaanDetail}</Baris>
            </dl>
          </Card>

          <Card>
            <CardHeader judul="Lokasi rumah" />
            <div className="space-y-3 p-5">
              <a
                href={c.linkMaps}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition hover:border-primary"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <MapPin className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">Buka lokasi di Google Maps</span>
                  <span className="block truncate text-xs text-body">{c.linkMaps}</span>
                </span>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-mist text-body">
                  <Home className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">Foto depan rumah</span>
                  <span className="block truncate text-xs text-body">
                    {c.fotoRumah ?? "Belum diambil — minta saat serah terima berikutnya."}
                  </span>
                </span>
                {c.fotoRumah ? (
                  <span className="ml-auto shrink-0">
                    <Pill nada="sukses">Ada</Pill>
                  </span>
                ) : (
                  <span className="ml-auto shrink-0">
                    <Pill nada="peringatan">Belum ada</Pill>
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Dokumen */}
        <Card>
          <CardHeader judul="Dokumen" deskripsi={`${dokumen.length} berkas tersimpan di storage privat.`} />
          <ul className="divide-y divide-line">
            {dokumen.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <FileText className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-ink">{d.jenis}</span>
                    {d.sumber === "Scan KTP" ? <Pill nada="sukses">Otomatis dari scan</Pill> : null}
                  </span>
                  <span className="block truncate text-xs text-body">{d.namaFile}</span>
                </span>
                <span className="shrink-0 text-xs text-body">{tanggalSingkat(d.diunggahPada)}</span>
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-2 border-t border-line px-5 py-3 text-[11px] leading-snug text-body">
            <Lock className="mt-0.5 size-3.5 shrink-0" />
            Berkas tidak disimpan di folder publik. Di produksi, dibuka lewat tautan bertanda tangan yang
            kedaluwarsa.
          </p>
        </Card>

        {/* Jaminan */}
        <Card>
          <CardHeader
            judul="Jaminan yang dititipkan"
            deskripsi="Tersimpan supaya tidak perlu diinput ulang. Bisa diganti saat transaksi kalau kendaraannya beda."
          />
          <ul className="divide-y divide-line">
            {c.jaminan.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-body">Belum ada jaminan tercatat.</li>
            ) : (
              c.jaminan.map((j) => (
                <li key={j.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-mist text-body">
                    <Bike className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-ink">{j.kendaraan}</span>
                    <span className="block text-xs text-body">
                      {j.plat} · atas nama {j.atasNama}
                    </span>
                  </span>
                  {j.atasNama !== c.namaLengkap ? <Pill nada="peringatan">Nama berbeda</Pill> : null}
                </li>
              ))
            )}
          </ul>

          {c.catatan ? (
            <div className="border-t border-line px-5 py-4">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                <Briefcase className="size-4 text-primary" />
                Catatan admin
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-body">{c.catatan}</p>
            </div>
          ) : null}
        </Card>
      </div>

      {/* Riwayat transaksi */}
      <Card>
        <CardHeader
          judul="Riwayat transaksi"
          deskripsi={`${riwayat.length} transaksi · total sewa ${rupiah(c.totalBelanja)}`}
          aksi={
            <a
              href={`mailto:${c.email}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <Mail className="size-4" />
              Email
            </a>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Kode</Th>
              <Th>Mobil</Th>
              <Th>Periode</Th>
              <Th className="text-right">Tagihan</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {riwayat.length === 0 ? (
              <TabelKosong kolom={5} pesan="Customer ini belum pernah menyewa." />
            ) : (
              riwayat.map((t) => (
                <tr key={t.kode} className="hover:bg-mist">
                  <Td>
                    <Link href={`/admin/transaksi/${t.kode}`} className="font-mono text-xs font-semibold text-primary">
                      {t.kode}
                    </Link>
                  </Td>
                  <Td className="text-[13px]">{t.namaMobil}</Td>
                  <Td className="whitespace-nowrap text-[13px] text-body">
                    {tanggalSingkat(t.startDate)} – {tanggalSingkat(t.endDate)}
                  </Td>
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
