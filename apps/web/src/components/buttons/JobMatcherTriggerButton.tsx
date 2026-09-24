"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function JobMatcherTriggerButton({
  locale,
  variant = "hero",
  className,
}: {
  locale: "pt-BR" | "en-US";
  variant?: "hero" | "banner" | "compact";
  className?: string;
}) {
  const isPt = locale === "pt-BR";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("open-job-matcher"))}
        className={
          className ||
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/80 dark:border-emerald-800/60 transition-all shadow-xs"
        }
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{isPt ? "Testar Match de Vaga" : "Test Job Match"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-job-matcher"))}
      className={
        className ||
        "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl h-12 px-5 text-sm gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
      }
    >
      <Sparkles className="w-4 h-4 text-emerald-200" />
      <span>{isPt ? "Match com Minha Vaga (IA)" : "Match My Job (AI)"}</span>
    </button>
  );
}
