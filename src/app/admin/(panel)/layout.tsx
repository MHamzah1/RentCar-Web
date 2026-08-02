import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { notifikasiAdmin } from "@/lib/admin";
import { labelPeran, sesiAdmin } from "@/lib/auth";
import { keluar } from "../actions";

/**
 * Kerangka panel admin.
 *
 * Sesi dicek di server di sini — Proxy hanya lapisan cepat di depan, bukan
 * satu-satunya penjaga.
 */
export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await sesiAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell
      admin={{
        nama: admin.nama,
        email: admin.email,
        labelPeran: labelPeran(admin.peran),
        superAdmin: admin.peran === "SUPER_ADMIN",
      }}
      notifikasi={notifikasiAdmin(admin.peran)}
      keluarAksi={keluar}
    >
      {children}
    </AdminShell>
  );
}
