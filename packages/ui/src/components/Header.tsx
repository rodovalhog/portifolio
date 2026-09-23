import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FontSizeController } from "./FontSizeController";
import { Terminal, Sparkles } from "lucide-react";

export function Header({
  locale,
  pathname = "",
}: {
  locale: SupportedLocale;
  pathname?: string;
}) {
  const t = getTranslations(locale);
  const cleanPath = pathname.split("?")[0].split("#")[0];

  const navLinks = [
    { href: `/${locale}/about`, label: t.navigation.about },
    { href: `/${locale}/experience`, label: t.navigation.experience },
    { href: `/${locale}/projects`, label: t.navigation.projects },
    { href: `/${locale}/skills`, label: t.navigation.skills },
    { href: `/${locale}/performance`, label: t.navigation.performance },
    { href: `/${locale}/resume`, label: t.navigation.resume },
    { href: `/${locale}/contact`, label: t.navigation.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a
            href={`/${locale}`}
            className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Terminal className="w-4 h-4" />
            </div>
            <span>guilherme.dev</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const resId = link.href.split("/").pop() || "home";
              const isActive = cleanPath === link.href || (link.href !== `/${locale}` && cleanPath.startsWith(`${link.href}/`));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  data-mcp-id={resId}
                  data-mcp-resource="navigation"
                  data-mcp-action="navigate"
                  data-mcp-target={link.href}
                  data-mcp-description={`Navegar para ${link.label}`}
                  className={`text-xs font-medium uppercase tracking-wider font-mono transition-colors ${
                    isActive ? "text-emerald-400 font-semibold" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <FontSizeController locale={locale} />
            <LanguageSwitcher currentLocale={locale} pathname={pathname} />

            <a
              href={`/${locale}/career`}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                cleanPath === `/${locale}/career`
                  ? "text-emerald-300 bg-emerald-950/80 border border-emerald-600 shadow-sm shadow-emerald-950/50"
                  : "text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.navigation.careerAI}</span>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
