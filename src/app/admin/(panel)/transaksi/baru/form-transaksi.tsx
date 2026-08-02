"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bike,
  CalendarDays,
  CarFront,
  CircleCheck,
  Info,
  Save,
  Search,
  UserPlus,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  BarisUang,
  Card,
  CardHeader,
  Label,
  Pill,
  inputDasar,
  tombolKedua,
  tombolUtama,
} from "@/components/admin/ui";
import { rupiah, tambahHari, tanggalPanjang } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface OpsiMobil {
  slug: string;
  nama: string;
  kategori: string;
  hargaPerHari: number;
  unitTersedia: number;
  /** Hanya dikirim untuk Super Admin. */
  modalPerHari?: number;
}

export interface OpsiCustomer {
  id: string;
  nama: string;
  noHp: string;
  langganan: boolean;
  jaminan: { id: string; label: string }[];
}

export function FormTransaksi({
  mobil,
  customer,
  slugAwal,
  hargaSopirPerHari,
  upahSopirPerHari,
  hariIni,
}: {
  mobil: OpsiMobil[];
  customer: OpsiCustomer[];
  slugAwal?: string;
  hargaSopirPerHari: number;
  upahSopirPerHari?: number;
  hariIni: string;
}) {
  const tersedia = mobil.filter((m) => m.unitTersedia > 0);
  const [slug, setSlug] = useState(slugAwal && tersedia.some((m) => m.slug === slugAwal) ? slugAwal : "");
  const [cariCust, setCariCust] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [jaminanId, setJaminanId] = useState("");
  const [jaminanBaru, setJaminanBaru] = useState(false);
  const [mulai, setMulai] = useState(hariIni);
  const [durasi, setDurasi] = useState(1);
  const [jam, setJam] = useState("08.00");
  const [pakaiSopir, setPakaiSopir] = useState(false);
  const [dp, setDp] = useState(0);
  const [tersimpan, setTersimpan] = useState(false);

  const mobilTerpilih = mobil.find((m) => m.slug === slug);
  const custTerpilih = customer.find((c) => c.id === customerId);

  const hasilCari = useMemo(() => {
    const k = cariCust.trim().toLowerCase();
    if (!k) return customer.slice(0, 5);
    return customer.filter((c) => `${c.nama} ${c.noHp}`.toLowerCase().includes(k)).slice(0, 6);
  }, [customer, cariCust]);

  const biayaSewa = (mobilTerpilih?.hargaPerHari ?? 0) * durasi;
  const biayaSopir = pakaiSopir ? hargaSopirPerHari * durasi : 0;
  const total = biayaSewa + biayaSopir;
  const sisa = Math.max(0, total - dp);
  const selesai = tambahHari(mulai, durasi);

  const modal =
    mobilTerpilih?.modalPerHari !== undefined
      ? (mobilTerpilih.modalPerHari + (pakaiSopir ? (upahSopirPerHari ?? 0) : 0)) * durasi
      : null;

  const siap = Boolean(slug && customerId && (jaminanId || jaminanBaru) && mulai && durasi > 0);

  return (
    <form
      className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-start"
      onSubmit={(e) => {
        e.preventDefault();
        setTersimpan(true);
      }}
    >
      <div className="space-y-4">
        {/* 1. Mobil */}
        <Card>
          <CardHeader judul="1. Mobil yang disewa" deskripsi="Hanya model dengan unit tersedia yang bisa dipilih." />
          <div className="space-y-4 p-5">
            <label className="block">
              <Label wajib>Pilih mobil</Label>
              <select value={slug} onChange={(e) => setSlug(e.target.value)} className={inputDasar} required>
                <option value="">— pilih mobil —</option>
                {tersedia.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.nama} — {rupiah(m.hargaPerHari)}/hari ({m.unitTersedia} unit)
                  </option>
                ))}
              </select>
            </label>

            {mobilTerpilih ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-mist p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-white text-primary">
                    <CarFront className="size-5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink">{mobilTerpilih.nama}</p>
                    <p className="text-xs text-body">{mobilTerpilih.kategori}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill nada="sukses">{mobilTerpilih.unitTersedia} unit tersedia</Pill>
                  <span className="text-[15px] font-extrabold text-ink">
                    {rupiah(mobilTerpilih.hargaPerHari)}
                    <span className="text-xs font-medium text-body">/hari</span>
                  </span>
                </div>
              </div>
            ) : null}

            {tersedia.length < mobil.length ? (
              <p className="text-xs text-body">
                {mobil.length - tersedia.length} model tidak muncul karena semua unitnya sedang terpakai.
              </p>
            ) : null}
          </div>
        </Card>

        {/* 2. Customer */}
        <Card>
          <CardHeader
            judul="2. Customer"
            deskripsi="Cari dulu — kalau sudah langganan, datanya langsung terpakai."
            aksi={
              <Link href="/admin/customer/baru" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                <UserPlus className="size-4" />
                Customer baru
              </Link>
            }
          />
          <div className="space-y-3 p-5">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-body" />
              <input
                type="search"
                value={cariCust}
                onChange={(e) => setCariCust(e.target.value)}
                placeholder="Ketik nama atau No. HP customer…"
                className={`${inputDasar} pl-10`}
              />
            </label>

            <ul className="space-y-2">
              {hasilCari.map((c) => {
                const dipilih = c.id === customerId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerId(c.id);
                        setJaminanId(c.jaminan[0]?.id ?? "");
                        setJaminanBaru(c.jaminan.length === 0);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition",
                        dipilih ? "border-primary bg-primary-soft/50" : "border-line hover:border-primary",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-lg",
                            dipilih ? "bg-primary text-white" : "bg-mist text-body",
                          )}
                        >
                          {dipilih ? <CircleCheck className="size-4" /> : <UserRound className="size-4" />}
                        </span>
                        <span>
                          <span className="block text-[13px] font-bold text-ink">{c.nama}</span>
                          <span className="block text-xs text-body">{c.noHp}</span>
                        </span>
                      </span>
                      {c.langganan ? <Pill nada="primary">Langganan</Pill> : <Pill>Baru</Pill>}
                    </button>
                  </li>
                );
              })}
              {hasilCari.length === 0 ? (
                <li className="rounded-xl bg-mist px-3.5 py-4 text-center text-[13px] text-body">
                  Tidak ketemu. Daftarkan dulu lewat <strong>Customer baru</strong>.
                </li>
              ) : null}
            </ul>
          </div>
        </Card>

        {/* 3. Jaminan */}
        <Card>
          <CardHeader
            judul="3. Jaminan"
            deskripsi="Pakai jaminan tersimpan, atau input baru kalau kendaraan yang dititipkan berbeda."
          />
          <div className="space-y-3 p-5">
            {!custTerpilih ? (
              <p className="rounded-xl bg-mist px-3.5 py-4 text-center text-[13px] text-body">
                Pilih customer dulu di langkah 2.
              </p>
            ) : (
              <>
                {custTerpilih.jaminan.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => {
                      setJaminanId(j.id);
                      setJaminanBaru(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition",
                      j.id === jaminanId && !jaminanBaru
                        ? "border-primary bg-primary-soft/50"
                        : "border-line hover:border-primary",
                    )}
                  >
                    <Bike className="size-4 shrink-0 text-primary" />
                    <span className="text-[13px] text-ink">{j.label}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setJaminanBaru(true);
                    setJaminanId("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition",
                    jaminanBaru ? "border-primary bg-primary-soft/50" : "border-line hover:border-primary",
                  )}
                >
                  <Bike className="size-4 shrink-0 text-body" />
                  <span className="text-[13px] font-semibold text-ink">Kendaraan lain (input baru)</span>
                </button>

                {jaminanBaru ? (
                  <div className="grid gap-3 rounded-xl bg-mist p-4 sm:grid-cols-3">
                    <label className="block">
                      <Label wajib>Kendaraan</Label>
                      <input required placeholder="Honda Vario 160" className={inputDasar} />
                    </label>
                    <label className="block">
                      <Label wajib>Plat</Label>
                      <input required placeholder="D 1234 XY" className={inputDasar} />
                    </label>
                    <label className="block">
                      <Label wajib>Atas nama</Label>
                      <input required placeholder="Nama pemilik" className={inputDasar} />
                    </label>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Card>

        {/* 4. Sewa */}
        <Card>
          <CardHeader judul="4. Detail sewa" deskripsi="Sesuai kesepakatan di WhatsApp." />
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <label className="block">
              <Label wajib>Tanggal mulai</Label>
              <input
                type="date"
                value={mulai}
                onChange={(e) => setMulai(e.target.value)}
                className={inputDasar}
                required
              />
            </label>
            <label className="block">
              <Label wajib>Durasi (hari)</Label>
              <input
                type="number"
                min={1}
                max={60}
                value={durasi}
                onChange={(e) => setDurasi(Math.max(1, Number(e.target.value) || 1))}
                className={inputDasar}
                required
              />
            </label>
            <label className="block">
              <Label wajib>Jam berangkat</Label>
              <select value={jam} onChange={(e) => setJam(e.target.value)} className={inputDasar}>
                {["05.00", "06.00", "07.00", "08.00", "09.00", "10.00", "13.00", "15.00", "18.00"].map((j) => (
                  <option key={j}>{j}</option>
                ))}
              </select>
            </label>

            <div className="sm:col-span-3">
              <Label>Layanan</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPakaiSopir(false)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition",
                    !pakaiSopir ? "border-primary bg-primary-soft/50" : "border-line hover:border-primary",
                  )}
                >
                  <span className="block text-[13px] font-bold text-ink">Lepas kunci</span>
                  <span className="block text-xs text-body">Customer menyetir sendiri. Tanpa biaya tambahan.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPakaiSopir(true)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition",
                    pakaiSopir ? "border-primary bg-primary-soft/50" : "border-line hover:border-primary",
                  )}
                >
                  <span className="block text-[13px] font-bold text-ink">Dengan sopir</span>
                  <span className="block text-xs text-body">
                    + {rupiah(hargaSopirPerHari)}/hari, berlaku untuk semua mobil.
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-mist p-3.5 sm:col-span-3">
              <p className="flex items-center gap-2 text-[13px] text-body">
                <CalendarDays className="size-4 text-primary" />
                Batas kembali: <strong className="text-ink">{tanggalPanjang(selesai)}</strong> jam {jam}
              </p>
            </div>
          </div>
        </Card>

        {/* 5. Pembayaran */}
        <Card>
          <CardHeader judul="5. Pembayaran awal" deskripsi="DP yang diterima saat booking dibuat." />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <label className="block">
              <Label>DP diterima</Label>
              <input
                type="number"
                min={0}
                step={50_000}
                value={dp}
                onChange={(e) => setDp(Math.max(0, Number(e.target.value) || 0))}
                className={inputDasar}
              />
            </label>
            <label className="block">
              <Label>Metode</Label>
              <select className={inputDasar}>
                <option>Transfer</option>
                <option>Tunai</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <Label>Catatan</Label>
              <textarea rows={2} placeholder="Contoh: tujuan Jogja, rombongan 6 orang" className={inputDasar} />
            </label>
          </div>
        </Card>
      </div>

      {/* Ringkasan */}
      <div className="space-y-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader judul="Ringkasan booking" />
          <div className="p-5">
            {!mobilTerpilih ? (
              <p className="py-6 text-center text-[13px] text-body">Pilih mobil untuk melihat rincian biaya.</p>
            ) : (
              <>
                <BarisUang
                  label={`Sewa ${durasi} hari × ${rupiah(mobilTerpilih.hargaPerHari)}`}
                  nilai={rupiah(biayaSewa)}
                />
                {pakaiSopir ? (
                  <BarisUang label={`Sopir ${durasi} hari × ${rupiah(hargaSopirPerHari)}`} nilai={rupiah(biayaSopir)} />
                ) : null}
                <BarisUang label="Total tagihan" nilai={rupiah(total)} tebal />
                <div className="mt-3 space-y-1 rounded-xl bg-mist p-3.5">
                  <BarisUang label="DP diterima" nilai={rupiah(dp)} nada="sukses" />
                  <BarisUang label="Sisa dibayar nanti" nilai={rupiah(sisa)} nada={sisa > 0 ? "bahaya" : "sukses"} />
                </div>

                {modal !== null ? (
                  <div className="mt-4 rounded-xl border border-line p-3.5">
                    <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                      <Wallet className="size-4 text-primary" />
                      Perkiraan (Super Admin)
                    </p>
                    <BarisUang label="Total modal" nilai={rupiah(modal)} />
                    <BarisUang label="Perkiraan laba" nilai={rupiah(total - modal)} nada="sukses" />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[13px] font-bold text-ink">Setelah disimpan</p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-body">
            <li>· Status menjadi <strong className="text-ink">Booking</strong></li>
            <li>· Unit tersedia untuk model ini berkurang 1</li>
            <li>· Saat berangkat, admin wajib mengunggah video kondisi unit</li>
          </ul>
        </Card>

        {tersimpan ? (
          <p className="flex items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-[13px] leading-relaxed text-blue-900">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              <strong>Tampilan demo — transaksi belum tersimpan.</strong> Perhitungan di ringkasan sudah memakai
              rumus yang sebenarnya; yang belum ada tinggal databasenya.
            </span>
          </p>
        ) : null}

        <div className="flex gap-2">
          <Link href="/admin/katalog" className={`${tombolKedua} flex-1`}>
            Batal
          </Link>
          <button type="submit" disabled={!siap} className={`${tombolUtama} flex-1`}>
            <Save className="size-4" />
            Simpan booking
          </button>
        </div>
        {!siap ? (
          <p className="text-center text-xs text-body">Lengkapi mobil, customer, dan jaminan dulu.</p>
        ) : null}
      </div>
    </form>
  );
}
