"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESI, PASSWORD_DEMO, cariAkun } from "@/lib/auth";

export interface HasilLogin {
  pesan: string;
}

export async function masuk(_sebelumnya: HasilLogin, formData: FormData): Promise<HasilLogin> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const tujuan = String(formData.get("next") ?? "/admin");

  if (!email || !password) return { pesan: "Email dan password wajib diisi." };

  const akun = cariAkun(email);
  if (!akun || password !== PASSWORD_DEMO) {
    return { pesan: "Email atau password salah." };
  }

  const toples = await cookies();
  toples.set(COOKIE_SESI, akun.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(tujuan.startsWith("/admin") && tujuan !== "/admin/login" ? tujuan : "/admin");
}

export async function keluar() {
  const toples = await cookies();
  toples.delete(COOKIE_SESI);
  redirect("/admin/login");
}
