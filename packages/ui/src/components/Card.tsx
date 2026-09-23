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
        "rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-200",
        hoverable &&
          "hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
