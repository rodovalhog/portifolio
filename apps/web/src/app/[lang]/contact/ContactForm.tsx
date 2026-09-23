"use client";

import React, { useState } from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { Button } from "@portfolio/ui";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm({ locale }: { locale: SupportedLocale }) {
  const t = getTranslations(locale);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = (formData.get("subject") as string) || "";
    const message = formData.get("message") as string;
    const honeypot = (formData.get("website_hp") as string) || "";

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage(
        locale === "pt-BR"
          ? "Por favor, preencha todos os campos obrigatórios."
          : "Please fill out all required fields."
      );
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website_hp: honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            (locale === "pt-BR"
              ? "Erro ao enviar mensagem via Resend. Tente novamente."
              : "Failed to send message via Resend. Please try again.")
        );
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : locale === "pt-BR"
          ? "Erro inesperado ao enviar mensagem."
          : "Unexpected error sending message."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center space-y-3">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <div className="text-base font-semibold text-emerald-200">
          {t.contact.successMessage}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot hidden input */}
      <input
        type="text"
        name="website_hp"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {status === "error" && (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/50 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage || t.contact.errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
          {t.contact.nameLabel} *
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm transition-colors"
          placeholder={locale === "pt-BR" ? "Seu nome ou empresa" : "Your name or company"}
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
          {t.contact.emailLabel} *
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm transition-colors"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
          {t.contact.subjectLabel}
        </label>
        <input
          type="text"
          name="subject"
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm transition-colors"
          placeholder={locale === "pt-BR" ? "Oportunidade, consultoria ou arquitetura" : "Opportunity, consulting, or architecture"}
        />
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
          {t.contact.messageLabel} *
        </label>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-sm transition-colors resize-none"
          placeholder={locale === "pt-BR" ? "Como posso ajudar no seu desafio de engenharia?" : "How can I help with your engineering challenge?"}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "sending"}
        className="w-full"
      >
        <Send className="w-4 h-4 mr-2" />
        <span>{status === "sending" ? t.contact.sendingButton : t.contact.sendButton}</span>
      </Button>
    </form>
  );
}
