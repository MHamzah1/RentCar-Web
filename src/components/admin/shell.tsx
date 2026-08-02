"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Bell,
  CarFront,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import type { Notifikasi } from "@/lib/admin";
import { cn } from "@/lib/utils";

const MENU = [
  { label: "Dashboard", href: "/admin", ikon: LayoutDashboard },
  { label: "Katalog Mobil", href: "/admin/katalog", ikon: CarFront },
  { label: "Transaksi", href: "/admin/transaksi", ikon: ReceiptText },
  { label: "Customer", href: "/admin/customer", ikon: Users },
  { label: "Tracking", href: "/admin/tracking", ikon: MapPin },
  { label: "Laporan", href: "/admin/laporan", ikon: FileSpreadsheet },
];

interface Admin {
  nama: string;
  email: string;
  labelPeran: string;
  superAdmin: boolean;
}

export function AdminShell({
  admin,
  notifikasi,
  keluarAksi,
  children,
}: {
  admin: Admin;
  notifikasi: Notifikasi[];
  keluarAksi: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [notifTerbuka, setNotifTerbuka] = useState(false);

  const aktif = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const mendesak = notifikasi.filter((n) => n.mendesak).length;

  // Drawer & dropdown ditutup lewat klik tautan, bukan lewat efek pindah halaman.
  const tutupSemua = () => {
    setMenuTerbuka(false);
    setNotifTerbuka(false);
  };

  const daftarMenu = (
    <nav className="flex flex-col gap-1">
      {MENU.map(({ label, href, ikon: Ikon }) => (
        <Link
          key={href}
          href={href}
          onClick={tutupSemua}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
            aktif(href) ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
          )}
        >
          <Ikon className="size-[18px] shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );

  const isiSidebar = (
    <div className="flex h-full flex-col bg-[#1b1440] px-4 py-5">
      <Link href="/admin" className="mb-7 flex items-center gap-2.5 px-1">
        <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
          <CarFront className="size-5" strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-lg font-extrabold leading-none text-white">RentCar</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">Admin Internal</span>
        </span>
      </Link>

      {daftarMenu}

      <div className="mt-auto rounded-2xl bg-white/5 p-4">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-white">
          <ShieldCheck className="size-4 text-accent" />
          {admin.labelPeran}
        </p>
        <p className="mt-1 text-xs text-white/60">{admin.nama}</p>
        <p className="truncate text-xs text-white/40">{admin.email}</p>
        {!admin.superAdmin ? (
          <p className="mt-2 text-[11px] leading-snug text-white/50">
            Harga modal & laba hanya untuk Super Admin.
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f6fa]">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{isiSidebar}</aside>

      {/* Drawer mobile */}
      {menuTerbuka ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMenuTerbuka(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-y-0 left-0 w-72">
            <button
              type="button"
              aria-label="Tutup menu"
              onClick={() => setMenuTerbuka(false)}
              className="absolute right-3 top-4 z-10 grid size-9 place-items-center rounded-xl text-white/70 hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
            {isiSidebar}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Buka menu"
              onClick={() => setMenuTerbuka(true)}
              className="grid size-10 place-items-center rounded-xl border border-line text-ink lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <p className="hidden text-sm text-body sm:block">
              Selamat datang kembali, <span className="font-semibold text-ink">{admin.nama}</span>
            </p>

            <div className="ml-auto flex items-center gap-2">
              {/* Notifikasi */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifikasi"
                  onClick={() => setNotifTerbuka((o) => !o)}
                  className="relative grid size-10 place-items-center rounded-xl border border-line text-ink transition hover:border-primary hover:text-primary"
                >
                  <Bell className="size-5" />
                  {notifikasi.length > 0 ? (
                    <span
                      className={cn(
                        "absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-white",
                        mendesak > 0 ? "bg-red-500" : "bg-primary",
                      )}
                    >
                      {notifikasi.length}
                    </span>
                  ) : null}
                </button>

                {notifTerbuka ? (
                  <>
                    <button
                      type="button"
                      aria-label="Tutup notifikasi"
                      onClick={() => setNotifTerbuka(false)}
                      className="fixed inset-0 z-10 cursor-default"
                    />
                    <div className="absolute right-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(20,10,60,0.35)]">
                      <div className="border-b border-line px-4 py-3">
                        <p className="text-sm font-bold text-ink">Notifikasi</p>
                        <p className="text-xs text-body">Pengingat internal — tidak dikirim ke customer.</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifikasi.length === 0 ? (
                          <p className="px-4 py-8 text-center text-sm text-body">Tidak ada yang perlu ditindak.</p>
                        ) : (
                          notifikasi.map((n) => (
                            <Link
                              key={n.id}
                              href={n.href}
                              onClick={tutupSemua}
                              className="flex gap-3 border-b border-line/70 px-4 py-3 last:border-0 hover:bg-mist"
                            >
                              <span
                                className={cn(
                                  "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg",
                                  n.mendesak ? "bg-red-50 text-red-600" : "bg-primary-soft text-primary",
                                )}
                              >
                                {n.mendesak ? <TriangleAlert className="size-4" /> : <Bell className="size-4" />}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-ink">{n.judul}</span>
                                <span className="block text-xs text-body">{n.detail}</span>
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <form action={keluarAksi}>
                <button
                  type="submit"
                  className="flex h-10 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-ink transition hover:border-red-300 hover:text-red-600"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
