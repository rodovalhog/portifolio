"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@portfolio/ui";
import { SupportedLocale } from "@portfolio/domain";

export function AppHeader({ locale }: { locale: SupportedLocale }) {
  const pathname = usePathname();

  return <Header locale={locale} pathname={pathname || `/${locale}`} />;
}
