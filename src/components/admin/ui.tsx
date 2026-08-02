import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { STATUS_LABEL, LABEL_BAYAR, type StatusBayar, type StatusTampil } from "@/lib/admin";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ page header */

export function PageHeader({
  judul,
  deskripsi,
  aksi,
}: {
  judul: string;
  deskripsi?: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{judul}</h1>
        {deskripsi ? <p className="mt-1 max-w-2xl text-sm text-body">{deskripsi}</p> : null}
      </div>
      {aksi ? <div className="flex flex-wrap items-center gap-2">{aksi}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ kartu */

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-line bg-white", className)} {...props} />;
}

export function CardHeader({
  judul,
  deskripsi,
  aksi,
}: {
  judul: string;
  deskripsi?: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        <h2 className="text-[15px] font-bold text-ink">{judul}</h2>
        {deskripsi ? <p className="mt-0.5 text-xs text-body">{deskripsi}</p> : null}
      </div>
      {aksi}
    </div>
  );
}

export function StatCard({
  label,
  nilai,
  catatan,
  ikon,
  nada = "netral",
  href,
}: {
  label: string;
  nilai: string;
  catatan?: string;
  ikon?: ReactNode;
  nada?: "netral" | "primary" | "bahaya" | "sukses";
  href?: string;
}) {
  const warna = {
    netral: "bg-mist text-body",
    primary: "bg-primary-soft text-primary",
    bahaya: "bg-red-50 text-red-600",
    sukses: "bg-emerald-50 text-emerald-600",
  }[nada];

  const isi = (
    <Card className="h-full p-5 transition hover:border-primary/40 hover:shadow-[0_18px_40px_-28px_rgba(20,10,60,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-body">{label}</p>
        {ikon ? <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", warna)}>{ikon}</span> : null}
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{nilai}</p>
      {catatan ? <p className="mt-1 text-xs text-body">{catatan}</p> : null}
    </Card>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {isi}
    </Link>
  ) : (
    isi
  );
}

/* ------------------------------------------------------------------ badge */

const GAYA_STATUS: Record<StatusTampil, string> = {
  BOOKING: "bg-amber-50 text-amber-700 ring-amber-200",
  ON_TRIP: "bg-blue-50 text-blue-700 ring-blue-200",
  OVERTIME: "bg-red-50 text-red-700 ring-red-200",
  EXTENDED: "bg-violet-50 text-violet-700 ring-violet-200",
  DONE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export function StatusBadge({ status, className }: { status: StatusTampil; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        GAYA_STATUS[status],
        className,
      )}
    >
      {status === "OVERTIME" ? <span className="size-1.5 animate-pulse rounded-full bg-red-500" /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}

const GAYA_BAYAR: Record<StatusBayar, string> = {
  BELUM_BAYAR: "bg-red-50 text-red-700 ring-red-200",
  DP: "bg-amber-50 text-amber-700 ring-amber-200",
  LUNAS: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function BayarBadge({ status }: { status: StatusBayar }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        GAYA_BAYAR[status],
      )}
    >
      {LABEL_BAYAR[status]}
    </span>
  );
}

export function Pill({
  children,
  nada = "netral",
}: {
  children: ReactNode;
  nada?: "netral" | "primary" | "sukses" | "bahaya" | "peringatan";
}) {
  const warna = {
    netral: "bg-mist text-body ring-line",
    primary: "bg-primary-soft text-primary ring-primary/20",
    sukses: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    bahaya: "bg-red-50 text-red-700 ring-red-200",
    peringatan: "bg-amber-50 text-amber-700 ring-amber-200",
  }[nada];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        warna,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ tabel */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-line bg-mist px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-body",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-b border-line px-4 py-3 align-middle text-ink", className)}>{children}</td>;
}

export function TabelKosong({ kolom, pesan }: { kolom: number; pesan: string }) {
  return (
    <tr>
      <td colSpan={kolom} className="px-4 py-14 text-center text-sm text-body">
        {pesan}
      </td>
    </tr>
  );
}

/* --------------------------------------------------------------- detail */

export function Baris({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line/70 py-2.5 last:border-0">
      <dt className="text-[13px] text-body">{label}</dt>
      <dd className="text-right text-[13px] font-semibold text-ink">{children}</dd>
    </div>
  );
}

export function BarisUang({
  label,
  nilai,
  nada = "netral",
  tebal = false,
}: {
  label: string;
  nilai: string;
  nada?: "netral" | "bahaya" | "sukses";
  tebal?: boolean;
}) {
  const warna = { netral: "text-ink", bahaya: "text-red-600", sukses: "text-emerald-600" }[nada];
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 py-2",
        tebal && "border-t border-line pt-3 text-base",
      )}
    >
      <span className={cn("text-[13px] text-body", tebal && "font-semibold text-ink")}>{label}</span>
      <span className={cn("font-bold tabular-nums", warna, tebal ? "text-lg" : "text-[13px]")}>{nilai}</span>
    </div>
  );
}

/* -------------------------------------------------------------- pembantu */

export function Kosong({ judul, pesan, aksi }: { judul: string; pesan: string; aksi?: ReactNode }) {
  return (
    <Card className="grid place-items-center px-6 py-16 text-center">
      <p className="text-[15px] font-bold text-ink">{judul}</p>
      <p className="mt-1 max-w-md text-sm text-body">{pesan}</p>
      {aksi ? <div className="mt-5">{aksi}</div> : null}
    </Card>
  );
}

export function Bar({ nilai, maks, nada = "primary" }: { nilai: number; maks: number; nada?: "primary" | "bahaya" }) {
  const persen = maks > 0 ? Math.round((nilai / maks) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
      <div
        className={cn("h-full rounded-full", nada === "primary" ? "bg-primary" : "bg-red-500")}
        style={{ width: `${Math.min(100, persen)}%` }}
      />
    </div>
  );
}

export const tombolUtama =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50";

export const tombolKedua =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

export const tombolBahaya =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50";

export const inputDasar =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-body/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function Label({ children, wajib = false }: { children: ReactNode; wajib?: boolean }) {
  return (
    <span className="mb-1.5 block text-[13px] font-semibold text-ink">
      {children}
      {wajib ? <span className="ml-0.5 text-red-500">*</span> : null}
    </span>
  );
}
