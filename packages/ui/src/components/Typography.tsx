import React from "react";
import { cn } from "../utils/cn";

export function Heading({
  as: Component = "h2",
  className,
  children,
  ...props
}: {
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const styles = {
    h1: "text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-100",
    h2: "text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100",
    h3: "text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100",
    h4: "text-lg font-medium text-zinc-800 dark:text-zinc-200",
  };

  return (
    <Component className={cn(styles[Component], className)} {...props}>
      {children}
    </Component>
  );
}

export function Text({
  className,
  variant = "body",
  children,
  ...props
}: {
  variant?: "lead" | "body" | "muted" | "caption" | "code";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const styles = {
    lead: "text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed",
    body: "text-base text-zinc-700 dark:text-zinc-300 leading-relaxed",
    muted: "text-sm text-zinc-500 dark:text-zinc-400 leading-normal",
    caption: "text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-mono",
    code: "text-sm font-mono text-emerald-600 dark:text-emerald-400 bg-zinc-100 dark:bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800",
  };

  return (
    <p className={cn(styles[variant], className)} {...props}>
      {children}
    </p>
  );
}
