import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { Container } from "./Container";
import { Github, Linkedin, Mail, GitFork } from "lucide-react";

export function Footer({
  locale,
  links,
}: {
  locale: SupportedLocale;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
}) {
  const t = getTranslations(locale);

  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950 py-12 text-zinc-500 transition-colors">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-300">
              Guilherme Rodovalho
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              {t.common.builtWith}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 dark:border-zinc-900 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 dark:border-zinc-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${links.email}`}
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 dark:border-zinc-900 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/rodovalhog/portifolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-600 hover:text-zinc-900 bg-zinc-100 border border-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 transition-colors"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>v1.0 (Modular Monolith)</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-zinc-900/80 text-center text-xs text-zinc-500 dark:text-zinc-600 font-mono">
          © {new Date().getFullYear()} Guilherme Rodovalho. {t.common.allRightsReserved}
        </div>
      </Container>
    </footer>
  );
}
