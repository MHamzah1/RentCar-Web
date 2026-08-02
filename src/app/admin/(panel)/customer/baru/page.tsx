import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { sesiAdmin } from "@/lib/auth";
import { FormCustomer } from "./form-customer";

export const metadata: Metadata = { title: "Tambah Customer" };

export default async function CustomerBaruPage() {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <Link href="/admin/customer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Kembali ke daftar customer
      </Link>

      <PageHeader
        judul="Tambah Customer"
        deskripsi="Scan KTP untuk mengisi otomatis, atau isi manual. Hasil scan tidak pernah langsung tersimpan — admin memeriksa dulu."
      />

      <FormCustomer />
    </div>
  );
}
