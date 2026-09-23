"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => {
        window.print();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}
