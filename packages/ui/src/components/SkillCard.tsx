import React from "react";
import { Skill, SupportedLocale, getLocalized } from "@portfolio/domain";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Heading, Text } from "./Typography";
import { Code2, Cpu, Database, Gauge, Layers, ShieldCheck, Terminal, Cloud } from "lucide-react";

const categoryIcons = {
  frontend: Code2,
  architecture: Layers,
  ai: Cpu,
  backend: Database,
  performance: Gauge,
  testing: ShieldCheck,
  devops: Terminal,
  cloud: Cloud,
};

export function SkillCard({
  skill,
  locale,
}: {
  skill: Skill;
  locale: SupportedLocale;
}) {
  const Icon = categoryIcons[skill.category] ?? Layers;

  const levelBadges = {
    expert: { label: "Expert / Lead", variant: "success" as const },
    advanced: { label: "Advanced", variant: "accent" as const },
    proficient: { label: "Proficient", variant: "default" as const },
  };

  const currentLevel = levelBadges[skill.level];

  return (
    <Card
      id={`skill-${skill.id}`}
      data-mcp-id={skill.id}
      data-mcp-resource="skill"
      data-mcp-action="view"
      data-mcp-description={`${skill.name}: ${getLocalized(skill.description, locale)}`}
      hoverable
      className="flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-200 dark:border-zinc-700/60">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <Heading as="h4">{skill.name}</Heading>
              <Text variant="caption">{skill.yearsOfExperience}+ anos de experiência prática</Text>
            </div>
          </div>
          <Badge variant={currentLevel.variant}>{currentLevel.label}</Badge>
        </div>

        <Text variant="body" className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
          {getLocalized(skill.description, locale)}
        </Text>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-200 dark:border-zinc-800/60">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
