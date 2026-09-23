import React from "react";
import { cn } from "../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "neutral" | "success" | "warning" | "accent";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
    neutral: "bg-zinc-900 text-zinc-400 border-zinc-800",
    success: "bg-emerald-950/40 text-emerald-300 border-emerald-800/50",
    warning: "bg-amber-950/40 text-amber-300 border-amber-800/50",
    accent: "bg-indigo-950/50 text-indigo-300 border-indigo-700/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
