"use client";

import React, { useEffect, useState } from "react";
import { SupportedLocale } from "@portfolio/domain";
import { Globe } from "lucide-react";

export function LanguageSwitcher({
  currentLocale,
  pathname,
}: {
  currentLocale: SupportedLocale;
  pathname?: string;
}) {
  const targetLocale: SupportedLocale = currentLocale === "pt-BR" ? "en-US" : "pt-BR";
  const targetLabel = currentLocale === "pt-BR" ? "EN" : "PT";

  const computeTargetPath = (path: string) => {
    // If path starts with /pt-BR or /en-US (e.g. /pt-BR/experience -> /en-US/experience)
    if (/^\/(pt-BR|en-US)(\/|$|\?|#)/.test(path)) {
      return path.replace(/^\/(pt-BR|en-US)/, `/${targetLocale}`);
    }
    // If path starts with targetLocale already
    if (path.startsWith(`/${targetLocale}`)) {
      return path;
    }
    // If path does not start with any locale (e.g. /experience)
    return `/${targetLocale}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Base state using passed pathname or fallback to /{currentLocale}
  const [targetUrl, setTargetUrl] = useState(() => {
    return computeTargetPath(pathname || `/${currentLocale}`);
  });

  // Keep target URL synchronized with browser window location (including query params and hash)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const livePath = window.location.pathname + window.location.search + window.location.hash;
      setTargetUrl(computeTargetPath(livePath));
    }
  }, [pathname, currentLocale, targetLocale]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined") {
      const livePath = window.location.pathname + window.location.search + window.location.hash;
      const destination = computeTargetPath(livePath);
      // Hard navigation ensures full Next.js locale re-render and clean state
      window.location.href = destination;
      e.preventDefault();
    }
  };

  return (
    <a
      href={targetUrl}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors cursor-pointer"
      title={currentLocale === "pt-BR" ? "Switch to English" : "Mudar para Português"}
    >
      <Globe className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
      <span>{targetLabel}</span>
    </a>
  );
}
