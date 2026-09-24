"use client";

import React, { useEffect, useState } from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({
  locale,
  className = "",
}: {
  locale: SupportedLocale;
  className?: string;
}) {
  const t = getTranslations(locale);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");

      const handleThemeChange = (e: Event) => {
        const custom = e as CustomEvent<{ theme?: "dark" | "light" }>;
        if (custom.detail?.theme) {
          setTheme(custom.detail.theme);
        }
      };

      window.addEventListener("portfolio:theme-changed", handleThemeChange);
      return () => {
        window.removeEventListener("portfolio:theme-changed", handleThemeChange);
      };
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (typeof window !== "undefined") {
      try {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          localStorage.setItem("portfolio_theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          localStorage.setItem("portfolio_theme", "light");
        }

        window.dispatchEvent(
          new CustomEvent("portfolio:theme-changed", {
            detail: { theme: nextTheme },
          })
        );
      } catch (e) {
        console.warn("Could not save theme preference:", e);
      }
    }
  };

  const isDark = theme === "dark";
  const titleText = isDark ? t.common.lightMode : t.common.darkMode;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      data-mcp-id="theme-toggle"
      data-mcp-resource="accessibility"
      data-mcp-action="toggle_theme"
      data-mcp-description={`Alternar tema: atualmente ${isDark ? "Modo Escuro" : "Modo Claro"}`}
      className={`inline-flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-colors border ${
        isDark
          ? "text-amber-400 bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700"
          : "text-amber-600 bg-zinc-100 hover:bg-zinc-200 border-zinc-200 hover:border-zinc-300"
      } ${className}`}
      title={titleText}
      aria-label={titleText}
    >
      {mounted ? (
        isDark ? (
          <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
        )
      ) : (
        <Sun className="w-4 h-4 opacity-50" />
      )}
    </button>
  );
}
