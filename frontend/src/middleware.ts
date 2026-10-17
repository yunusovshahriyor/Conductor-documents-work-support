import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocale, matchLocale } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/|icons/|sw\\.js|manifest\\.webmanifest|offline\\.html|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
