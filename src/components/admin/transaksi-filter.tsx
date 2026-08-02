"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { STATUS_LABEL, URUTAN_STATUS } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { Card, inputDasar, tombolKedua } from "./ui";

export function TransaksiFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const status = params.get("status") ?? "SEMUA";
  const [cari, setCari] = useState(params.get("cari") ?? "");
  const [mulai, setMulai] = useState(params.get("mulai") ?? "");
  const [selesai, setSelesai] = useState(params.get("selesai") ?? "");

  const terapkan = (ubahan: Record<string, string>) => {
    const baru = new URLSearchParams(params.toString());
    for (const [kunci, nilai] of Object.entries(ubahan)) {
      if (nilai) baru.set(kunci, nilai);
      else baru.delete(kunci);
    }
    router.push(`/admin/transaksi?${baru.toString()}`);
  };

  const reset = () => {
    setCari("");
    setMulai("");
    setSelesai("");
    router.push("/admin/transaksi");
  };

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap gap-2">
        {(["SEMUA", ...URUTAN_STATUS] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => terapkan({ status: s === "SEMUA" ? "" : s })}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              status === s ? "bg-primary text-white" : "bg-mist text-ink hover:bg-primary-soft",
            )}
          >
            {s === "SEMUA" ? "Semua" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          terapkan({ cari, mulai, selesai });
        }}
      >
        <label className="relative min-w-[15rem] flex-1">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Cari</span>
          <Search className="pointer-events-none absolute bottom-3 left-3.5 size-4 text-body" />
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Kode, mobil, atau nama customer…"
            className={`${inputDasar} pl-10`}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Mulai dari</span>
          <input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} className={inputDasar} />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Sampai</span>
          <input type="date" value={selesai} onChange={(e) => setSelesai(e.target.value)} className={inputDasar} />
        </label>

        <button type="submit" className={tombolKedua}>
          Terapkan
        </button>
        <button type="button" onClick={reset} className={tombolKedua}>
          <RotateCcw className="size-4" />
          Reset
        </button>
      </form>
    </Card>
  );
}
