import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supportedLocales = ["pt-BR", "en-US"];
const defaultLocale = "pt-BR";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with any supported locale
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale if accessing root or without locale
  const locale = defaultLocale;
  const targetUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);
  return NextResponse.redirect(targetUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    "/((?!api|_next/static|_next/image|favicon.ico|images|resumes|.*\\..*).*)",
  ],
};
