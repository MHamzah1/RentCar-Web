import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, UserPlus } from "lucide-react";
import { CustomerTabel } from "@/components/admin/customer-tabel";
import { PageHeader, tombolUtama } from "@/components/admin/ui";
import { daftarCustomer } from "@/lib/admin";
import { sesiAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Customer" };

export default async function CustomerPage() {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <PageHeader
        judul="Data Customer"
        deskripsi="Customer langganan tidak perlu diinput ulang — cari namanya, datanya langsung terpakai di transaksi berikutnya."
        aksi={
          <Link href="/admin/customer/baru" className={tombolUtama}>
            <UserPlus className="size-4" />
            Tambah customer
          </Link>
        }
      />

      <p className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        Halaman ini berisi data pribadi (NIK, dokumen, alamat, kontak darurat). Jangan dibagikan keluar dan
        jangan dibuka di layar yang terlihat customer lain.
      </p>

      <CustomerTabel customer={daftarCustomer} />
    </div>
  );
}
