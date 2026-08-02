import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CarFront,
  Clock,
  Plus,
  TrendingUp,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import {
  agendaHariIni,
  performaMobil,
  ringkasanDashboard,
  type AdminTransaksi,
} from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";
import { HARI_INI, namaHari, rupiah, rupiahRingkas, tanggalPanjang } from "@/lib/constants";
import {
  Bar,
  Card,
  CardHeader,
  PageHeader,
  Pill,
  StatCard,
  StatusBadge,
  tombolUtama,
} from "@/components/admin/ui";

export default async function DashboardPage() {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  const superAdmin = admin.peran === "SUPER_ADMIN";
  const r = ringkasanDashboard(admin.peran);
  const agenda = agendaHariIni(admin.peran);
  const performa = performaMobil(admin.peran).filter((p) => p.jumlahTransaksi > 0);
  const pendapatanTertinggi = Math.max(...performa.map((p) => p.pendapatan), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Dashboard"
        deskripsi={`${namaHari(HARI_INI)}, ${tanggalPanjang(HARI_INI)} — ringkasan operasional hari ini.`}
        aksi={
          <Link href="/admin/katalog" className={tombolUtama}>
            <Plus className="size-4" />
            Booking baru
          </Link>
        }
      />

      {/* Kartu ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Mobil sedang di luar"
          nilai={String(r.diLuar)}
          catatan={`${r.menungguBerangkat} lagi menunggu berangkat`}
          ikon={<CarFront className="size-[18px]" />}
          nada="primary"
          href="/admin/tracking"
        />
        <StatCard
          label="Lewat waktu"
          nilai={String(r.overtime)}
          catatan={r.overtime > 0 ? "Denda berjalan Rp 50.000/jam" : "Semua kembali tepat waktu"}
          ikon={<TriangleAlert className="size-[18px]" />}
          nada={r.overtime > 0 ? "bahaya" : "sukses"}
          href="/admin/transaksi?status=OVERTIME"
        />
        <StatCard
          label="Unit tersedia"
          nilai={`${r.unitTersedia} / ${r.totalUnit}`}
          catatan={`Utilisasi armada ${r.utilisasi}%`}
          ikon={<CarFront className="size-[18px]" />}
          href="/admin/katalog"
        />
        <StatCard
          label="Piutang berjalan"
          nilai={rupiahRingkas(r.piutang)}
          catatan="Sisa tagihan yang belum masuk"
          ikon={<Wallet className="size-[18px]" />}
          nada={r.piutang > 0 ? "bahaya" : "sukses"}
          href="/admin/transaksi"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Transaksi bulan ini"
          nilai={String(r.transaksiBulanIni)}
          catatan="Tidak termasuk yang dibatalkan"
          ikon={<CalendarDays className="size-[18px]" />}
        />
        <StatCard
          label="Nilai tagihan bulan ini"
          nilai={rupiahRingkas(r.pendapatanBulanIni)}
          catatan={`${rupiahRingkas(r.dibayarBulanIni)} sudah diterima`}
          ikon={<Wallet className="size-[18px]" />}
        />
        {superAdmin ? (
          <StatCard
            label="Laba bulan ini"
            nilai={rupiahRingkas(r.labaBulanIni ?? 0)}
            catatan={`Modal ${rupiahRingkas(r.modalBulanIni ?? 0)}`}
            ikon={<TrendingUp className="size-[18px]" />}
            nada="sukses"
          />
        ) : (
          <StatCard
            label="Laba bulan ini"
            nilai="—"
            catatan="Hanya untuk Super Admin"
            ikon={<TrendingUp className="size-[18px]" />}
          />
        )}
        <StatCard
          label="Customer terdaftar"
          nilai={String(r.totalCustomer)}
          catatan={`${r.customerLangganan} sudah langganan`}
          ikon={<Users className="size-[18px]" />}
          href="/admin/customer"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* Agenda hari ini */}
        <Card>
          <CardHeader judul="Agenda hari ini" deskripsi="Yang perlu diurus admin hari ini." />
          <div className="divide-y divide-line">
            <BlokAgenda
              judul="Lewat waktu"
              kosong="Tidak ada unit yang telat."
              daftar={agenda.terlambat}
              nada="bahaya"
            />
            <BlokAgenda
              judul="Berangkat hari ini"
              kosong="Tidak ada keberangkatan hari ini."
              daftar={agenda.berangkat}
              nada="peringatan"
            />
            <BlokAgenda
              judul="Kembali hari ini"
              kosong="Tidak ada pengembalian hari ini."
              daftar={agenda.kembali}
              nada="primary"
            />
          </div>
        </Card>

        {/* Performa mobil */}
        <Card>
          <CardHeader
            judul="Mobil paling menghasilkan"
            deskripsi={superAdmin ? "Nilai tagihan dan laba per model." : "Nilai tagihan per model."}
          />
          <ul className="space-y-4 px-5 py-4">
            {performa.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <div className="flex items-baseline justify-between gap-3">
                  <Link href={`/admin/katalog/${p.slug}`} className="text-[13px] font-semibold text-ink hover:text-primary">
                    {p.nama}
                  </Link>
                  <span className="shrink-0 text-[13px] font-bold tabular-nums text-ink">
                    {rupiahRingkas(p.pendapatan)}
                  </span>
                </div>
                <div className="mt-2">
                  <Bar nilai={p.pendapatan} maks={pendapatanTertinggi} />
                </div>
                <p className="mt-1.5 text-xs text-body">
                  {p.jumlahTransaksi}× sewa · {p.totalHari} hari
                  {superAdmin && p.laba !== null ? ` · laba ${rupiahRingkas(p.laba)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {!superAdmin ? (
        <p className="rounded-2xl border border-line bg-white px-5 py-4 text-sm text-body">
          Kamu masuk sebagai <strong className="text-ink">Admin staf</strong>. Harga modal, margin, dan laba
          tidak ditampilkan — angka itu hanya untuk Super Admin.
        </p>
      ) : null}
    </div>
  );
}

function BlokAgenda({
  judul,
  daftar,
  kosong,
  nada,
}: {
  judul: string;
  daftar: AdminTransaksi[];
  kosong: string;
  nada: "bahaya" | "peringatan" | "primary";
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2">
        <h3 className="text-[13px] font-bold text-ink">{judul}</h3>
        <Pill nada={daftar.length > 0 ? nada : "netral"}>{daftar.length}</Pill>
      </div>

      {daftar.length === 0 ? (
        <p className="mt-2 text-sm text-body">{kosong}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {daftar.map((t) => (
            <li key={t.kode}>
              <Link
                href={`/admin/transaksi/${t.kode}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-2.5 transition hover:border-primary hover:bg-mist"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">{t.namaMobil}</span>
                  <span className="block text-xs text-body">
                    {t.namaCustomer} · {t.kode}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {t.jamTelat > 0 ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                      <Clock className="size-3.5" />
                      {t.jamTelat} jam · {rupiah(t.denda)}
                    </span>
                  ) : (
                    <span className="text-xs text-body">jam {t.jamBerangkat}</span>
                  )}
                  <StatusBadge status={t.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
