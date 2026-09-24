"use client";

import React, { useEffect, useState } from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { RotateCcw } from "lucide-react";

export type FontSizeLevel = "normal" | "lg" | "xl";

export function FontSizeController({
  locale,
}: {
  locale: SupportedLocale;
}) {
  const t = getTranslations(locale);
  const [level, setLevel] = useState<FontSizeLevel>("normal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("portfolio_font_size") as FontSizeLevel | null;
        if (saved === "lg" || saved === "xl") {
          setLevel(saved);
          document.documentElement.setAttribute("data-font-size", saved);
        } else {
          setLevel("normal");
          document.documentElement.removeAttribute("data-font-size");
        }
      } catch {
        // Fallback gracefully if localStorage is unavailable
      }

      const handleExternalChange = (e: Event) => {
        const custom = e as CustomEvent<{ fontSize?: FontSizeLevel }>;
        if (custom.detail?.fontSize) {
          setLevel(custom.detail.fontSize);
        }
      };

      window.addEventListener("portfolio:font-size-changed", handleExternalChange);
      return () => {
        window.removeEventListener("portfolio:font-size-changed", handleExternalChange);
      };
    }
  }, []);

  const applyFontSize = (newLevel: FontSizeLevel) => {
    setLevel(newLevel);
    if (typeof window !== "undefined") {
      try {
        if (newLevel === "normal") {
          document.documentElement.removeAttribute("data-font-size");
          localStorage.removeItem("portfolio_font_size");
        } else {
          document.documentElement.setAttribute("data-font-size", newLevel);
          localStorage.setItem("portfolio_font_size", newLevel);
        }

        window.dispatchEvent(
          new CustomEvent("portfolio:font-size-changed", {
            detail: { fontSize: newLevel },
          })
        );
      } catch {
        // Handle private browsing or restricted localStorage
      }
    }
  };

  const handleDecrease = () => {
    if (level === "xl") applyFontSize("lg");
    else if (level === "lg") applyFontSize("normal");
  };

  const handleIncrease = () => {
    if (level === "normal") applyFontSize("lg");
    else if (level === "lg") applyFontSize("xl");
  };

  const handleReset = () => {
    applyFontSize("normal");
  };

  return (
    <div
      role="group"
      aria-label={t.common.fontSize}
      data-mcp-id="font-size-controller"
      data-mcp-resource="accessibility"
      data-mcp-description="Ajuste de acessibilidade para aumentar ou restaurar tamanho da fonte"
      className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 p-0.5 text-xs font-mono select-none"
    >
      {/* Botão Diminuir Fonte (A-) */}
      <button
        type="button"
        onClick={handleDecrease}
        disabled={level === "normal"}
        title={t.common.decreaseFontSize}
        aria-label={t.common.decreaseFontSize}
        className="px-2 py-1 rounded text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
      >
        A-
      </button>

      {/* Botão de Status / Reset ao Normal (A, A+, A++) */}
      <button
        type="button"
        onClick={handleReset}
        title={level === "normal" ? `${t.common.fontSize}: 100%` : t.common.resetFontSize}
        aria-label={level === "normal" ? `${t.common.fontSize}: 100%` : t.common.resetFontSize}
        className={`px-2 py-1 rounded transition-all flex items-center gap-1 font-semibold ${
          level !== "normal"
            ? "text-emerald-700 bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-700/60 shadow-sm cursor-pointer"
            : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60 cursor-default"
        }`}
      >
        <span>{level === "normal" ? "A" : level === "lg" ? "A+" : "A++"}</span>
        {level !== "normal" && (
          <RotateCcw className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400/80 animate-in fade-in" />
        )}
      </button>

      {/* Botão Aumentar Fonte (A+) */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={level === "xl"}
        title={t.common.increaseFontSize}
        aria-label={t.common.increaseFontSize}
        className="px-2 py-1 rounded text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
      >
        A+
      </button>
    </div>
  );
}
