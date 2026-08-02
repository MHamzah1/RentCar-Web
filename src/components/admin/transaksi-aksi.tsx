"use client";

import { useRef, useState } from "react";
import {
  Ban,
  CalendarPlus,
  CircleCheck,
  Clock,
  Info,
  PlayCircle,
  TriangleAlert,
  Upload,
  Video,
} from "lucide-react";
import { DENDA_PER_JAM, type StatusTampil } from "@/lib/admin";
import { rupiah, tanggalPanjang } from "@/lib/constants";
import { Card, CardHeader, Label, inputDasar, tombolBahaya, tombolKedua, tombolUtama } from "./ui";

interface Props {
  status: StatusTampil;
  jamTelat: number;
  denda: number;
  sisaTagihan: number;
  hargaPerHari: number;
  hargaSopirPerHari: number;
  pakaiSopir: boolean;
  endDate: string;
  videoSerahTerima: string | null;
  videoDiunggahPada: string | null;
}

export function TransaksiAksi(p: Props) {
  const [pesanDemo, setPesanDemo] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {p.status === "OVERTIME" ? <PanelOvertime {...p} onDemo={setPesanDemo} /> : null}
      {p.status === "BOOKING" ? <PanelBerangkat onDemo={setPesanDemo} /> : null}
      {p.status === "ON_TRIP" || p.status === "EXTENDED" ? (
        <PanelSelesai sisaTagihan={p.sisaTagihan} onDemo={setPesanDemo} />
      ) : null}

      {/* Video serah terima */}
      {p.videoSerahTerima ? (
        <Card>
          <CardHeader judul="Video kondisi awal unit" deskripsi="Bukti keadaan mobil saat diserahkan." />
          <div className="flex items-center gap-3 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Video className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink">{p.videoSerahTerima}</span>
              <span className="block text-xs text-body">Diunggah {p.videoDiunggahPada}</span>
            </span>
            <button type="button" onClick={() => setPesanDemo("pemutar")} className={tombolKedua}>
              Putar
            </button>
          </div>
        </Card>
      ) : null}

      {p.status === "BOOKING" ? <PanelBatal onDemo={setPesanDemo} /> : null}

      {pesanDemo ? (
        <p className="flex items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-[13px] leading-relaxed text-blue-900">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Tampilan demo — belum ada perubahan yang tersimpan.</strong> Aksi ini butuh database dan
            storage privat yang belum disiapkan (lihat <code>docs/06-keputusan-teknis.md</code>). Aturan alurnya
            sudah dipasang: status hanya boleh maju, dan tombol berangkat terkunci sampai video diunggah.
          </span>
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- panel */

function PanelBerangkat({ onDemo }: { onDemo: (v: string) => void }) {
  const [video, setVideo] = useState<string | null>(null);
  const berkas = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-primary/30">
      <CardHeader
        judul="Mulai perjalanan"
        deskripsi="Video kondisi awal unit wajib diunggah sebelum mobil boleh berangkat."
      />
      <div className="space-y-4 p-5">
        <div
          className={`rounded-2xl border-2 border-dashed p-5 text-center transition ${
            video ? "border-emerald-300 bg-emerald-50" : "border-line"
          }`}
        >
          <span
            className={`mx-auto grid size-12 place-items-center rounded-2xl ${
              video ? "bg-emerald-100 text-emerald-600" : "bg-mist text-body"
            }`}
          >
            {video ? <CircleCheck className="size-6" /> : <Video className="size-6" />}
          </span>
          <p className="mt-3 text-[15px] font-bold text-ink">
            {video ? "Video siap" : "Video kondisi awal unit"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-body">
            {video ?? "Rekam keliling mobil: bodi, ban, interior, dan kelengkapan. Jadi bukti kalau ada sengketa saat pengembalian."}
          </p>

          <input
            ref={berkas}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setVideo(e.target.files?.[0]?.name ?? null)}
          />
          <button type="button" onClick={() => berkas.current?.click()} className={`${tombolKedua} mt-4`}>
            <Upload className="size-4" />
            {video ? "Ganti video" : "Pilih / rekam video"}
          </button>
        </div>

        <button
          type="button"
          disabled={!video}
          onClick={() => onDemo("berangkat")}
          className={`${tombolUtama} w-full py-3`}
        >
          <PlayCircle className="size-4" />
          Mulai perjalanan
        </button>

        {!video ? (
          <p className="text-center text-xs text-body">
            Tombol terkunci sampai video diunggah — ini aturan, bukan sekadar tampilan.
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function PanelOvertime({
  jamTelat,
  denda,
  hargaPerHari,
  hargaSopirPerHari,
  pakaiSopir,
  endDate,
  onDemo,
}: Props & { onDemo: (v: string) => void }) {
  const [hari, setHari] = useState(1);
  const perHari = hargaPerHari + (pakaiSopir ? hargaSopirPerHari : 0);
  const tambahan = perHari * hari;

  const batasBaru = (() => {
    const [y, m, d] = endDate.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d + hari)).toISOString().slice(0, 10);
  })();

  return (
    <>
      <Card className="border-red-200 bg-red-50/60">
        <div className="flex items-start gap-3 p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
            <TriangleAlert className="size-5" />
          </span>
          <div>
            <p className="text-[15px] font-bold text-red-900">Mobil belum kembali</p>
            <p className="mt-1 text-[13px] leading-relaxed text-red-800">
              Sudah lewat <strong>{jamTelat} jam</strong> dari batas pengembalian. Denda berjalan{" "}
              {rupiah(DENDA_PER_JAM)}/jam — saat ini <strong>{rupiah(denda)}</strong> dan terus bertambah.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-700">
              <Clock className="size-3.5" />
              Status ini muncul otomatis, tidak perlu diklik admin.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader judul="Perpanjang sewa" deskripsi="Kalau customer minta tambah hari, catat di sini." />
        <div className="space-y-4 p-5">
          <label className="block">
            <Label>Tambah berapa hari?</Label>
            <input
              type="number"
              min={1}
              max={30}
              value={hari}
              onChange={(e) => setHari(Math.max(1, Number(e.target.value) || 1))}
              className={inputDasar}
            />
          </label>

          <dl className="rounded-xl bg-mist p-4 text-[13px]">
            <div className="flex justify-between py-1">
              <dt className="text-body">Batas kembali baru</dt>
              <dd className="font-semibold text-ink">{tanggalPanjang(batasBaru)}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-body">
                Tambahan biaya ({hari} hari × {rupiah(perHari)})
              </dt>
              <dd className="font-semibold text-ink">{rupiah(tambahan)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 mt-1">
              <dt className="font-semibold text-ink">Denda berjalan saat ini</dt>
              <dd className="font-bold text-red-600">{rupiah(denda)}</dd>
            </div>
          </dl>

          <button type="button" onClick={() => onDemo("perpanjang")} className={`${tombolUtama} w-full py-3`}>
            <CalendarPlus className="size-4" />
            Perpanjang {hari} hari — status jadi Diperpanjang
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader judul="Selesaikan sewa" deskripsi="Mobil sudah kembali. Denda ditagih bersama pelunasan." />
        <div className="p-5">
          <button type="button" onClick={() => onDemo("selesai")} className={`${tombolUtama} w-full py-3`}>
            <CircleCheck className="size-4" />
            Mobil kembali & lunasi
          </button>
        </div>
      </Card>
    </>
  );
}

function PanelSelesai({ sisaTagihan, onDemo }: { sisaTagihan: number; onDemo: (v: string) => void }) {
  return (
    <Card>
      <CardHeader judul="Selesaikan sewa" deskripsi="Tekan saat mobil sudah dikembalikan customer." />
      <div className="space-y-4 p-5">
        {sisaTagihan > 0 ? (
          <p className="rounded-xl bg-amber-50 px-3.5 py-3 text-[13px] text-amber-900">
            Sisa tagihan <strong>{rupiah(sisaTagihan)}</strong> perlu dilunasi saat pengembalian.
          </p>
        ) : (
          <p className="rounded-xl bg-emerald-50 px-3.5 py-3 text-[13px] text-emerald-800">
            Tagihan sudah lunas. Tinggal serah terima unit.
          </p>
        )}
        <button type="button" onClick={() => onDemo("selesai")} className={`${tombolUtama} w-full py-3`}>
          <CircleCheck className="size-4" />
          Mobil kembali & selesaikan
        </button>
      </div>
    </Card>
  );
}

function PanelBatal({ onDemo }: { onDemo: (v: string) => void }) {
  const [buka, setBuka] = useState(false);

  return (
    <Card className="border-red-100">
      <CardHeader judul="Batalkan booking" deskripsi="Hanya bisa selama mobil belum berangkat. Unit kembali ke stok." />
      <div className="space-y-3 p-5">
        {buka ? (
          <>
            <label className="block">
              <Label wajib>Alasan pembatalan</Label>
              <textarea
                rows={3}
                placeholder="Contoh: jadwal customer berubah"
                className={inputDasar}
              />
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setBuka(false)} className={`${tombolKedua} flex-1`}>
                Urungkan
              </button>
              <button type="button" onClick={() => onDemo("batal")} className={`${tombolBahaya} flex-1`}>
                <Ban className="size-4" />
                Konfirmasi batal
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setBuka(true)} className={`${tombolBahaya} w-full`}>
            <Ban className="size-4" />
            Batalkan booking ini
          </button>
        )}
      </div>
    </Card>
  );
}
