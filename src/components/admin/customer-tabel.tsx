"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import type { AdminCustomer } from "@/lib/admin";
import { rupiah, tanggalSingkat } from "@/lib/constants";
import { Card, Pill, Table, TabelKosong, Td, Th, inputDasar } from "./ui";

export function CustomerTabel({ customer }: { customer: AdminCustomer[] }) {
  const [kunci, setKunci] = useState("");

  const hasil = useMemo(() => {
    const k = kunci.trim().toLowerCase();
    if (!k) return customer;
    return customer.filter((c) => `${c.namaLengkap} ${c.noHpWa} ${c.nik} ${c.email}`.toLowerCase().includes(k));
  }, [customer, kunci]);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <label className="relative min-w-[16rem] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-body" />
          <input
            type="search"
            value={kunci}
            onChange={(e) => setKunci(e.target.value)}
            placeholder="Cari nama, No. HP, NIK, atau email…"
            className={`${inputDasar} pl-10`}
          />
        </label>
        <p className="text-sm text-body">
          <strong className="text-ink">{hasil.length}</strong> customer
        </p>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Nama</Th>
            <Th>Kontak</Th>
            <Th>Jaminan</Th>
            <Th className="text-center">Transaksi</Th>
            <Th className="text-right">Total sewa</Th>
            <Th>Terakhir</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {hasil.length === 0 ? (
            <TabelKosong kolom={7} pesan="Tidak ada customer yang cocok dengan pencarian." />
          ) : (
            hasil.map((c) => (
              <tr key={c.id} className="hover:bg-mist">
                <Td>
                  <Link href={`/admin/customer/${c.id}`} className="block">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-ink">{c.namaLengkap}</span>
                      {c.langganan ? <Pill nada="primary">Langganan</Pill> : null}
                    </span>
                    <span className="text-xs text-body">{c.id}</span>
                  </Link>
                </Td>
                <Td>
                  <span className="block text-[13px] text-ink">{c.noHpWa}</span>
                  <span className="block text-xs text-body">{c.kecamatan}</span>
                </Td>
                <Td className="text-[13px] text-body">
                  {c.jaminan.length > 0 ? c.jaminan[0].kendaraan : "—"}
                  {c.jaminan.length > 1 ? ` +${c.jaminan.length - 1}` : ""}
                </Td>
                <Td className="text-center text-[13px] font-semibold">{c.jumlahTransaksi}</Td>
                <Td className="text-right text-[13px] font-semibold tabular-nums">{rupiah(c.totalBelanja)}</Td>
                <Td className="whitespace-nowrap text-[13px] text-body">
                  {c.transaksiTerakhir ? tanggalSingkat(c.transaksiTerakhir) : "—"}
                </Td>
                <Td className="text-right">
                  <Link href={`/admin/customer/${c.id}`} className="inline-flex text-primary">
                    <ChevronRight className="size-4" />
                  </Link>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
}
