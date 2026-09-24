"use client";

import React, { useState, useEffect } from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FontSizeController } from "./FontSizeController";
import { ThemeToggle } from "./ThemeToggle";
import { Terminal, Sparkles, Menu, X, ArrowRight, Command } from "lucide-react";

export function Header({
  locale,
  pathname = "",
}: {
  locale: SupportedLocale;
  pathname?: string;
}) {
  const t = getTranslations(locale);
  const cleanPath = pathname.split("?")[0].split("#")[0];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/cases`, label: t.navigation.cases },
    { href: `/${locale}/about`, label: t.navigation.about },
    { href: `/${locale}/experience`, label: t.navigation.experience },
    { href: `/${locale}/skills`, label: t.navigation.skills },
    { href: `/${locale}/contact`, label: t.navigation.contact },
  ];

  // Close mobile menu on Escape key and prevent body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [cleanPath]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-200">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a
              href={`/${locale}`}
              className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <Terminal className="w-4 h-4" />
              </div>
              <span>Guilherme.R</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const resId = link.href.split("/").pop() || "home";
                const isActive =
                  cleanPath === link.href ||
                  (link.href !== `/${locale}` && cleanPath.startsWith(`${link.href}/`));
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    data-mcp-id={resId}
                    data-mcp-resource="navigation"
                    data-mcp-action="navigate"
                    data-mcp-target={link.href}
                    data-mcp-description={`Navegar para ${link.label}`}
                    className={`text-xs font-medium uppercase tracking-wider font-mono transition-colors ${isActive
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Header Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
                <FontSizeController locale={locale} />
                <LanguageSwitcher currentLocale={locale} pathname={pathname} />
                <ThemeToggle locale={locale} />
              </div>

              {/* Command Palette Trigger */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 transition-colors shadow-2xs"
                title={locale === "pt-BR" ? "Abrir Paleta de Comandos (⌘K)" : "Open Command Palette (⌘K)"}
                aria-label="Command Palette"
              >
                <Command className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">⌘K</span>
              </button>

              {/* Recruiter Job Matcher Trigger */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-job-matcher"))}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 dark:border-emerald-800/50 transition-colors shadow-2xs"
                title={locale === "pt-BR" ? "Testar compatibilidade com sua vaga de emprego" : "Test candidate fit with your job description"}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{locale === "pt-BR" ? "Match de Vaga" : "Match Job"}</span>
              </button>

              {/* Mobile Controls & Hamburger */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <ThemeToggle locale={locale} />
              </div>

              <button
                type="button"
                id="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
                aria-label={isMobileMenuOpen ? t.common.closeMenu : t.common.openMenu}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                ) : (
                  <Menu className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer & Backdrop */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 top-16 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div
            id="mobile-navigation-menu"
            className="fixed inset-x-0 top-16 z-50 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 py-5 space-y-4">
              {/* Navigation Links with accessible touch targets (min 44px) */}
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    cleanPath === link.href ||
                    (link.href !== `/${locale}` && cleanPath.startsWith(`${link.href}/`));
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                        ? "bg-emerald-50 text-emerald-800 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                        : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900"
                        }`}
                    >
                      <span className="font-mono">{link.label}</span>
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Mobile Actions: Match Vaga & Career AI */}
              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("open-job-matcher"));
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 shadow-xs transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{locale === "pt-BR" ? "Testar Match com Minha Vaga (IA)" : "Test Job Match with AI"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("open-command-palette"));
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors"
                >
                  <Command className="w-3.5 h-3.5" />
                  <span>{locale === "pt-BR" ? "Buscar ou Comandos (⌘K)" : "Search or Commands (⌘K)"}</span>
                </button>
              </div>

              {/* Mobile Preferences Bar: Language, Theme, Font Size */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ThemeToggle locale={locale} />
                  <LanguageSwitcher currentLocale={locale} pathname={pathname} />
                </div>
                <FontSizeController locale={locale} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
