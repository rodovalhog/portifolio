import React from "react";
import { Experience, SupportedLocale, getLocalized } from "@portfolio/domain";
import { Badge } from "./Badge";
import { Heading, Text } from "./Typography";
import { Card } from "./Card";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export function Timeline({
  experiences,
  locale,
}: {
  experiences: Experience[];
  locale: SupportedLocale;
}) {
  return (
    <div className="relative border-l border-zinc-800 ml-4 pl-6 space-y-12">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          id={exp.id}
          data-mcp-id={exp.id}
          data-mcp-resource="experience"
          data-mcp-action="view"
          data-mcp-description={`${getLocalized(exp.role, locale)} na ${exp.company}`}
          className="relative group p-3 -m-3 rounded-xl transition"
        >
          {/* Node marker */}
          <div className="absolute -left-[19px] top-4 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-zinc-300 transition-colors" />

          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              {exp.period.startDate} — {exp.period.isCurrent ? (locale === "pt-BR" ? "Presente" : "Present") : exp.period.endDate}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <MapPin className="w-3 h-3" />
              {getLocalized(exp.location, locale)}
            </span>
            <Badge variant="neutral">{exp.type}</Badge>
          </div>

          <Heading as="h3" className="text-xl sm:text-2xl text-zinc-100 mb-1">
            {getLocalized(exp.role, locale)}
          </Heading>
          <div className="text-base font-medium text-zinc-400 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-zinc-500" />
            {exp.company}
          </div>

          <Text variant="body" className="text-zinc-300 mb-4">
            {getLocalized(exp.summary, locale)}
          </Text>

          {exp.highlights && exp.highlights.length > 0 && (
            <ul className="mb-6 space-y-2 pl-1">
              {exp.highlights.map((hl, hIdx) => (
                <li key={hIdx} className="text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0 mt-1">•</span>
                  <span>{getLocalized(hl, locale)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Engineering Cases within Experience */}
          {exp.engineeringCases && exp.engineeringCases.length > 0 && (
            <div className="space-y-4 mb-6">
              {exp.engineeringCases.map((ec, idx) => (
                <Card key={idx} className="bg-zinc-950/60 border-zinc-800/80 p-5">
                  <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{getLocalized(ec.title, locale)}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs font-mono uppercase text-zinc-500 mb-1">
                        {locale === "pt-BR" ? "Problema / Gargalo" : "Problem & Bottleneck"}
                      </div>
                      <div className="text-zinc-400">{getLocalized(ec.problem, locale)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-zinc-500 mb-1">
                        {locale === "pt-BR" ? "Decisão Arquitetural" : "Architectural Decision"}
                      </div>
                      <div className="text-zinc-400">{getLocalized(ec.decision, locale)}</div>
                    </div>
                    <div className="md:col-span-2 pt-2 border-t border-zinc-800/60">
                      <div className="text-xs font-mono uppercase text-emerald-400 mb-1">
                        {locale === "pt-BR" ? "Impacto & Resultados" : "Impact & Results"}
                      </div>
                      <div className="text-zinc-300 font-medium">{getLocalized(ec.impact, locale)}</div>
                    </div>
                  </div>

                  {ec.metrics && ec.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/60">
                      {ec.metrics.map((m, mi) => (
                        <span
                          key={mi}
                          className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {exp.technologies.map((t) => (
              <span
                key={t}
                className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
