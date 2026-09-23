import React from "react";
import { Project, SupportedLocale, getLocalized } from "@portfolio/domain";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Heading, Text } from "./Typography";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export function ProjectCard({
  project,
  locale,
  href,
}: {
  project: Project;
  locale: SupportedLocale;
  href: string;
}) {
  return (
    <Card
      id={`project-${project.slug || project.id}`}
      data-mcp-id={project.slug || project.id}
      data-mcp-resource="project"
      data-mcp-action="view"
      data-mcp-target={href}
      data-mcp-description={getLocalized(project.title, locale)}
      hoverable
      className="flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <Badge variant={project.featured ? "accent" : "default"}>
            {project.featured ? "Featured Case Study" : "Case Study"}
          </Badge>
          <span className="text-xs font-mono text-zinc-500">{project.period}</span>
        </div>

        <Heading as="h3" className="mb-2 group-hover:text-zinc-100 transition-colors">
          <a href={href} className="inline-flex items-center gap-2">
            <span>{getLocalized(project.title, locale)}</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </Heading>

        <Text variant="body" className="text-zinc-400 mb-6 text-sm line-clamp-3">
          {getLocalized(project.tagline, locale)}
        </Text>

        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 p-3 mb-6 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
            {project.metrics.slice(0, 2).map((m, i) => (
              <div key={i}>
                <div className="text-xs text-zinc-500 font-mono">
                  {getLocalized(m.label, locale)}
                </div>
                <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/60">
          {project.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono text-zinc-400 bg-zinc-800/40 px-2 py-0.5 rounded border border-zinc-800"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="text-xs font-mono text-zinc-500 px-1 py-0.5">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
