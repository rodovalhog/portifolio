import React from "react";
import { cn } from "../utils/cn";

export function Card({
  className,
  children,
  hoverable = false,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/90 bg-white/90 shadow-sm dark:shadow-none dark:border-zinc-800/80 dark:bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-200",
        hoverable &&
          "hover:border-zinc-300 hover:bg-white hover:shadow-md hover:shadow-zinc-200/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80 dark:hover:shadow-black/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
