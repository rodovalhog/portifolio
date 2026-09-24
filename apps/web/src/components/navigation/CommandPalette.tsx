"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  User,
  Briefcase,
  Code2,
  Mail,
  Sparkles,
  Gauge,
  FileText,
  Download,
  Moon,
  Sun,
  Copy,
  Check,
  ArrowRight,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { useAI } from "@/context/AIContext";

interface CommandItem {
  id: string;
  category: "navigation" | "actions" | "ai";
  label: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  onSelect: () => void;
}

export const CommandPalette: React.FC<{
  locale: "pt-BR" | "en-US";
  onOpenJobMatcher: () => void;
}> = ({ locale, onOpenJobMatcher }) => {
  const router = useRouter();
  const { toggleChat, sendMessage } = useAI();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPt = locale === "pt-BR";

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("portfolio_theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio_theme", "dark");
    }
    setIsOpen(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("rodovalhogdeveloper@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => {
      setCopiedEmail(false);
      setIsOpen(false);
    }, 1200);
  };

  const downloadPdf = (lang: "pt" | "en") => {
    const a = document.createElement("a");
    a.href = `/resumes/guilherme-rodovalho-cv-${lang}.pdf`;
    a.download = `guilherme-rodovalho-cv-${lang}.pdf`;
    a.click();
    setIsOpen(false);
  };

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-home",
      category: "navigation",
      label: isPt ? "Início" : "Home",
      description: isPt ? "Visão geral e destaques de engenharia" : "Overview and engineering highlights",
      icon: Home,
      onSelect: () => {
        router.push(`/${locale}`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-cases",
      category: "navigation",
      label: isPt ? "Cases de Sucesso (Estudos de Caso)" : "Engineering Case Studies",
      description: isPt ? "Diagnósticos profundos, métricas reais e evidências" : "Deep-dive diagnostics, real metrics & evidence",
      icon: Briefcase,
      onSelect: () => {
        router.push(`/${locale}/cases`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-experience",
      category: "navigation",
      label: isPt ? "Trajetória (Experiência)" : "Career Experience",
      description: isPt ? "Histórico profissional e impacto técnico" : "Professional timeline and technical impact",
      icon: Briefcase,
      onSelect: () => {
        router.push(`/${locale}/experience`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-about",
      category: "navigation",
      label: isPt ? "Sobre Mim" : "About Me",
      description: isPt ? "Filosofia de liderança e valores de engenharia" : "Leadership philosophy & core values",
      icon: User,
      onSelect: () => {
        router.push(`/${locale}/about`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-skills",
      category: "navigation",
      label: isPt ? "DNA Técnico & Habilidades" : "Technical DNA & Skills",
      description: isPt ? "Maestria em React, Next.js, Node.js e IA" : "Mastery in React, Next.js, Node.js & AI",
      icon: Code2,
      onSelect: () => {
        router.push(`/${locale}/skills`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-resume",
      category: "navigation",
      label: isPt ? "Currículo Formatado" : "Formatted Resume",
      description: isPt ? "Visualização para recrutadores e impressão" : "Recruiter view & print-ready layout",
      icon: FileText,
      onSelect: () => {
        router.push(`/${locale}/resume`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-performance",
      category: "navigation",
      label: isPt ? "Observatório de Performance" : "Performance Observatory",
      description: isPt ? "Telemetria Core Web Vitals ao vivo" : "Live browser Core Web Vitals telemetry",
      icon: Gauge,
      onSelect: () => {
        router.push(`/${locale}/performance`);
        setIsOpen(false);
      },
    },
    {
      id: "nav-contact",
      category: "navigation",
      label: isPt ? "Contato & Conversas" : "Contact & Discussions",
      description: isPt ? "Enviar mensagem direta por e-mail" : "Send direct message or email",
      icon: Mail,
      onSelect: () => {
        router.push(`/${locale}/contact`);
        setIsOpen(false);
      },
    },

    // AI Tools
    {
      id: "ai-job-matcher",
      category: "ai",
      label: isPt ? "Match da Minha Vaga (IA Recrutador)" : "Recruiter Job Matcher (AI)",
      description: isPt ? "Cole a descrição da sua vaga e veja o fit" : "Paste your job description to see match fit",
      icon: Sparkles,
      shortcut: "AI",
      onSelect: () => {
        setIsOpen(false);
        onOpenJobMatcher();
      },
    },
    {
      id: "ai-chat",
      category: "ai",
      label: isPt ? "Conversar com a IA do Guilherme" : "Chat with Guilherme's AI Assistant",
      description: isPt ? "Pergunte sobre arquitetura, projetos e fit" : "Ask questions about architecture & fit",
      icon: Sparkles,
      onSelect: () => {
        setIsOpen(false);
        toggleChat();
      },
    },

    // Actions
    {
      id: "act-download-pt",
      category: "actions",
      label: isPt ? "Baixar Currículo PDF (Português)" : "Download Resume PDF (Portuguese)",
      description: isPt ? "Versão oficial em PDF em pt-BR" : "Official PDF resume in pt-BR",
      icon: Download,
      onSelect: () => downloadPdf("pt"),
    },
    {
      id: "act-download-en",
      category: "actions",
      label: isPt ? "Baixar Currículo PDF (Inglês)" : "Download Resume PDF (English)",
      description: isPt ? "Versão oficial em PDF em en-US" : "Official PDF resume in en-US",
      icon: Download,
      onSelect: () => downloadPdf("en"),
    },
    {
      id: "act-copy-email",
      category: "actions",
      label: isPt ? "Copiar E-mail Profissional" : "Copy Professional Email",
      description: "rodovalhogdeveloper@gmail.com",
      icon: copiedEmail ? Check : Copy,
      onSelect: copyEmail,
    },
    {
      id: "act-toggle-theme",
      category: "actions",
      label: isPt ? "Alternar Modo Claro / Escuro" : "Toggle Light / Dark Mode",
      description: isPt ? "Mudar paleta visual do site" : "Switch site color theme",
      icon: Moon,
      onSelect: toggleTheme,
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].onSelect();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isPt
                ? "Digite um comando ou busque uma página (ex: Trajetória, PDF, IA)..."
                : "Type a command or search (e.g. Experience, PDF, AI)..."
            }
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              {isPt ? "Nenhum resultado encontrado." : "No results found."}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => item.onSelect()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ {isPt ? "Navegar" : "Navigate"}</span>
            <span>↵ {isPt ? "Selecionar" : "Select"}</span>
          </div>
          <span>Guilherme Rodovalho Platform</span>
        </div>
      </div>
    </div>
  );
};
