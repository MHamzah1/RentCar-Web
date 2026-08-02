import { cookies } from "next/headers";
import { adminRecords, type AdminRecord } from "./db";

/**
 * Sesi admin — versi demo.
 *
 * BELUM AMAN UNTUK PRODUKSI: sesi hanya berisi ID admin di cookie, password
 * masih plaintext di bawah, dan belum ada database. Bentuk akhirnya (hash
 * password, sesi bertanda tangan) mengikuti
 * `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.
 *
 * Yang sudah benar sejak sekarang: pengecekan dilakukan **di server**, dan
 * peran ikut menentukan data apa yang boleh dikirim ke halaman.
 */

export const COOKIE_SESI = "rentcar_admin";

/** Password demo untuk semua akun. Diganti hash begitu ada database. */
export const PASSWORD_DEMO = "demo123";

/** Akun yang bisa dipakai mencoba aplikasi. */
export const akunDemo = adminRecords.filter((a) => a.aktif);

export async function sesiAdmin(): Promise<AdminRecord | null> {
  const toples = await cookies();
  const id = toples.get(COOKIE_SESI)?.value;
  if (!id) return null;
  return adminRecords.find((a) => a.id === id && a.aktif) ?? null;
}

export function cariAkun(email: string) {
  const bersih = email.trim().toLowerCase();
  return adminRecords.find((a) => a.email.toLowerCase() === bersih && a.aktif) ?? null;
}

export const labelPeran = (peran: AdminRecord["peran"]) =>
  peran === "SUPER_ADMIN" ? "Super Admin" : "Admin";
