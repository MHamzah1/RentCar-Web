import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESI } from "@/lib/auth";

/**
 * Proxy — di Next.js 16 ini pengganti nama "Middleware", fungsinya sama.
 * Lihat `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
 *
 * Ini hanya **pengecekan cepat** supaya halaman admin tidak sempat termuat
 * untuk yang belum login. Pengecekan sesungguhnya tetap dilakukan di tiap
 * halaman lewat `sesiAdmin()` — sesuai anjuran docs, Proxy tidak boleh jadi
 * satu-satunya lapisan otorisasi.
 */
export function proxy(request: NextRequest) {
  const punyaSesi = Boolean(request.cookies.get(COOKIE_SESI)?.value);
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    if (punyaSesi) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!punyaSesi) {
    const tujuan = new URL("/admin/login", request.url);
    tujuan.searchParams.set("next", pathname);
    return NextResponse.redirect(tujuan);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
