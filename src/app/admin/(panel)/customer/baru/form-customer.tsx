"use client";

import { useRef, useState } from "react";
import {
  Bike,
  Camera,
  CircleCheck,
  FileText,
  Info,
  Keyboard,
  MapPin,
  Save,
  ScanLine,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Card, CardHeader, Label, Pill, inputDasar, tombolKedua, tombolUtama } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/** Bentuk data hasil pembacaan KTP. Semua field tetap bisa dikoreksi admin. */
const KOSONG = {
  nik: "",
  namaLengkap: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  alamat: "",
  rtRw: "",
  kelurahan: "",
  kecamatan: "",
  agama: "",
  statusPerkawinan: "",
  pekerjaanKtp: "",
  kewarganegaraan: "WNI",
};

/**
 * Contoh hasil OCR. Di aplikasi sungguhan ini datang dari layanan pembaca KTP
 * (lihat `docs/06-keputusan-teknis.md`) — di sini hanya simulasi tampilan.
 */
const CONTOH_HASIL_SCAN: typeof KOSONG = {
  nik: "3273091509940009",
  namaLengkap: "Agus Firmansyah",
  tempatLahir: "Bandung",
  tanggalLahir: "1994-09-15",
  jenisKelamin: "Laki-laki",
  alamat: "Jl. Gatot Subroto No. 77",
  rtRw: "003/008",
  kelurahan: "Malabar",
  kecamatan: "Lengkong",
  agama: "Islam",
  statusPerkawinan: "Belum Kawin",
  pekerjaanKtp: "Karyawan Swasta",
  kewarganegaraan: "WNI",
};

type Tahap = "pilih" | "membaca" | "hasil" | "manual";

export function FormCustomer() {
  const [tahap, setTahap] = useState<Tahap>("pilih");
  const [ktp, setKtp] = useState(KOSONG);
  const [namaBerkas, setNamaBerkas] = useState<string | null>(null);
  const [tersimpan, setTersimpan] = useState(false);
  const inputBerkas = useRef<HTMLInputElement>(null);

  const ubah = (kunci: keyof typeof KOSONG) => (nilai: string) => setKtp((k) => ({ ...k, [kunci]: nilai }));

  const bacaKtp = (berkas: File) => {
    setNamaBerkas(berkas.name);
    setTahap("membaca");
    // Simulasi jeda pembacaan. Diganti panggilan ke layanan OCR nanti.
    window.setTimeout(() => {
      setKtp(CONTOH_HASIL_SCAN);
      setTahap("hasil");
    }, 1200);
  };

  const formTampil = tahap === "hasil" || tahap === "manual";

  return (
    <div className="space-y-4">
      {/* Langkah 1 — sumber data */}
      <Card>
        <CardHeader
          judul="1. Sumber data identitas"
          deskripsi="Scan KTP untuk mengisi otomatis, atau isi manual. Hasil scan tetap harus diperiksa admin."
        />
        <div className="p-5">
          {tahap === "pilih" || tahap === "membaca" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Scan */}
              <div
                className={cn(
                  "rounded-2xl border-2 border-dashed p-6 text-center transition",
                  tahap === "membaca" ? "border-primary bg-primary-soft/40" : "border-line hover:border-primary",
                )}
              >
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  {tahap === "membaca" ? (
                    <Sparkles className="size-6 animate-pulse" />
                  ) : (
                    <ScanLine className="size-6" />
                  )}
                </span>
                <p className="mt-3 text-[15px] font-bold text-ink">
                  {tahap === "membaca" ? "Membaca KTP…" : "Scan KTP lewat foto"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-body">
                  {tahap === "membaca"
                    ? namaBerkas
                    : "Ambil foto KTP atau pilih berkas. Sistem mengisi field, admin tinggal memeriksa."}
                </p>

                <input
                  ref={inputBerkas}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const berkas = e.target.files?.[0];
                    if (berkas) bacaKtp(berkas);
                  }}
                />
                <button
                  type="button"
                  disabled={tahap === "membaca"}
                  onClick={() => inputBerkas.current?.click()}
                  className={`${tombolUtama} mt-4 w-full`}
                >
                  <Upload className="size-4" />
                  {tahap === "membaca" ? "Memproses…" : "Pilih foto KTP"}
                </button>
              </div>

              {/* Manual */}
              <div className="rounded-2xl border-2 border-dashed border-line p-6 text-center transition hover:border-primary">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-mist text-body">
                  <Keyboard className="size-6" />
                </span>
                <p className="mt-3 text-[15px] font-bold text-ink">Isi manual</p>
                <p className="mt-1 text-xs leading-relaxed text-body">
                  Dipakai kalau foto kurang jelas atau customer keberatan difoto KTP-nya.
                </p>
                <button type="button" onClick={() => setTahap("manual")} className={`${tombolKedua} mt-4 w-full`}>
                  Isi form manual
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  {tahap === "hasil" ? <CircleCheck className="size-5" /> : <Keyboard className="size-5" />}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-ink">
                    {tahap === "hasil" ? "KTP berhasil dibaca" : "Pengisian manual"}
                  </p>
                  <p className="text-xs text-body">
                    {tahap === "hasil" ? namaBerkas : "Semua field diisi sendiri oleh admin."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTahap("pilih");
                  setKtp(KOSONG);
                  setNamaBerkas(null);
                  setTersimpan(false);
                }}
                className={tombolKedua}
              >
                <X className="size-4" />
                Ulangi
              </button>
            </div>
          )}
        </div>
      </Card>

      {formTampil ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTersimpan(true);
          }}
        >
          {tahap === "hasil" ? (
            <p className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
              <Info className="mt-0.5 size-4 shrink-0" />
              Ini hasil pembacaan otomatis dan belum tersimpan. <strong>Periksa setiap field</strong> — terutama
              NIK dan tanggal lahir — perbaiki yang salah, baru tekan simpan.
            </p>
          ) : null}

          {/* Identitas */}
          <Card>
            <CardHeader
              judul="2. Identitas sesuai KTP"
              aksi={tahap === "hasil" ? <Pill nada="sukses">Terisi dari scan</Pill> : undefined}
            />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Isian label="NIK" wajib nilai={ktp.nik} ubah={ubah("nik")} placeholder="16 digit" mono />
              <Isian label="Nama lengkap" wajib nilai={ktp.namaLengkap} ubah={ubah("namaLengkap")} />
              <Isian label="Tempat lahir" nilai={ktp.tempatLahir} ubah={ubah("tempatLahir")} />
              <Isian label="Tanggal lahir" tipe="date" nilai={ktp.tanggalLahir} ubah={ubah("tanggalLahir")} />
              <Pilihan
                label="Jenis kelamin"
                nilai={ktp.jenisKelamin}
                ubah={ubah("jenisKelamin")}
                opsi={["Laki-laki", "Perempuan"]}
              />
              <Isian label="Agama" nilai={ktp.agama} ubah={ubah("agama")} />
              <div className="sm:col-span-2">
                <Isian label="Alamat" wajib nilai={ktp.alamat} ubah={ubah("alamat")} />
              </div>
              <Isian label="RT/RW" nilai={ktp.rtRw} ubah={ubah("rtRw")} placeholder="000/000" />
              <Isian label="Kelurahan/Desa" nilai={ktp.kelurahan} ubah={ubah("kelurahan")} />
              <Isian label="Kecamatan" nilai={ktp.kecamatan} ubah={ubah("kecamatan")} />
              <Pilihan
                label="Status perkawinan"
                nilai={ktp.statusPerkawinan}
                ubah={ubah("statusPerkawinan")}
                opsi={["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"]}
              />
              <Isian label="Pekerjaan (sesuai KTP)" nilai={ktp.pekerjaanKtp} ubah={ubah("pekerjaanKtp")} />
              <Isian label="Kewarganegaraan" nilai={ktp.kewarganegaraan} ubah={ubah("kewarganegaraan")} />
            </div>
          </Card>

          {/* Kontak */}
          <Card>
            <CardHeader judul="3. Kontak & data tambahan" deskripsi="Ditanyakan admin saat serah terima." />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Isian label="No. HP (WhatsApp)" wajib tipe="tel" placeholder="0812-xxxx-xxxx" />
              <Isian label="Email aktif" tipe="email" placeholder="nama@email.com" />
              <Isian label="Instagram" placeholder="@username" />
              <Isian label="TikTok" placeholder="@username" />
              <Isian label="Nama kontak darurat" wajib />
              <Isian label="Hubungan" placeholder="Istri / Ayah / Kakak" />
              <Isian label="No. HP darurat" wajib tipe="tel" />
              <Pilihan label="Status rumah" opsi={["Milik sendiri", "Sewa", "Kos"]} />
              <div className="sm:col-span-2">
                <Isian label="Pekerjaan / usaha / kampus" placeholder="Contoh: Pemilik kafe di Jl. Riau" />
              </div>
            </div>
          </Card>

          {/* Lokasi & dokumen */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader judul="4. Lokasi rumah" />
              <div className="space-y-4 p-5">
                <Isian
                  label="Link lokasi Google Maps"
                  ikon={<MapPin className="size-4" />}
                  placeholder="https://maps.google.com/?q=..."
                />
                <UnggahBerkas
                  judul="Foto depan rumah"
                  keterangan="Diambil saat survei atau serah terima unit."
                  ikon={<Camera className="size-5" />}
                />
              </div>
            </Card>

            <Card>
              <CardHeader judul="5. Dokumen pendukung" deskripsi="Disimpan di storage privat, bukan folder publik." />
              <div className="space-y-3 p-5">
                {tahap === "hasil" ? (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
                    <FileText className="size-4 shrink-0 text-emerald-600" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-emerald-900">
                        Foto KTP otomatis tersimpan
                      </span>
                      <span className="block truncate text-xs text-emerald-700">{namaBerkas}</span>
                    </span>
                    <Pill nada="sukses">KTP</Pill>
                  </div>
                ) : (
                  <UnggahBerkas judul="Foto KTP" keterangan="Wajib." ikon={<FileText className="size-5" />} />
                )}
                <UnggahBerkas judul="Kartu Keluarga (KK)" ikon={<FileText className="size-5" />} />
                <UnggahBerkas judul="SIM A" ikon={<FileText className="size-5" />} />
                <UnggahBerkas judul="NPWP / dokumen lain" ikon={<FileText className="size-5" />} />
              </div>
            </Card>
          </div>

          {/* Jaminan */}
          <Card>
            <CardHeader
              judul="6. Jaminan yang dititipkan"
              deskripsi="Tersimpan di data customer supaya bisa dipakai lagi di transaksi berikutnya."
            />
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <Isian label="Kendaraan" ikon={<Bike className="size-4" />} placeholder="Honda Vario 160" />
              <Isian label="Nomor plat" placeholder="D 1234 XY" />
              <Isian label="Atas nama" placeholder="Boleh berbeda dari nama customer" />
            </div>
          </Card>

          {/* Simpan */}
          {tersimpan ? (
            <p className="flex items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-[13px] leading-relaxed text-blue-900">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong>Tampilan demo — data belum tersimpan.</strong> Penyimpanan menunggu database dan storage
                privat disiapkan; pilihan teknologinya ada di <code>docs/06-keputusan-teknis.md</code>. Alur,
                field, dan validasi di form ini sudah sesuai rencana.
              </span>
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setTahap("pilih")} className={tombolKedua}>
              Batal
            </button>
            <button type="submit" className={tombolUtama}>
              <Save className="size-4" />
              Simpan customer
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- pembantu */

function Isian({
  label,
  nilai,
  ubah,
  tipe = "text",
  placeholder,
  wajib = false,
  mono = false,
  ikon,
}: {
  label: string;
  nilai?: string;
  ubah?: (v: string) => void;
  tipe?: string;
  placeholder?: string;
  wajib?: boolean;
  mono?: boolean;
  ikon?: React.ReactNode;
}) {
  const terkendali = ubah !== undefined;
  return (
    <label className="block">
      <Label wajib={wajib}>{label}</Label>
      <span className="relative block">
        {ikon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-body">{ikon}</span>
        ) : null}
        <input
          type={tipe}
          placeholder={placeholder}
          required={wajib}
          className={cn(inputDasar, mono && "font-mono", Boolean(ikon) && "pl-10")}
          {...(terkendali ? { value: nilai ?? "", onChange: (e) => ubah(e.target.value) } : {})}
        />
      </span>
    </label>
  );
}

function Pilihan({
  label,
  nilai,
  ubah,
  opsi,
}: {
  label: string;
  nilai?: string;
  ubah?: (v: string) => void;
  opsi: string[];
}) {
  const terkendali = ubah !== undefined;
  return (
    <label className="block">
      <Label>{label}</Label>
      <select
        className={inputDasar}
        {...(terkendali ? { value: nilai ?? "", onChange: (e) => ubah(e.target.value) } : {})}
      >
        <option value="">— pilih —</option>
        {opsi.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function UnggahBerkas({
  judul,
  keterangan,
  ikon,
}: {
  judul: string;
  keterangan?: string;
  ikon: React.ReactNode;
}) {
  const [nama, setNama] = useState<string | null>(null);
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition hover:border-primary">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-mist text-body">{ikon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-ink">{judul}</span>
        <span className="block truncate text-xs text-body">{nama ?? keterangan ?? "Belum ada berkas"}</span>
      </span>
      {nama ? <Pill nada="sukses">Dipilih</Pill> : <Upload className="size-4 shrink-0 text-body" />}
      <input
        type="file"
        className="hidden"
        onChange={(e) => setNama(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}
