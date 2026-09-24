import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  Card,
} from "@portfolio/ui";
import { ContactForm } from "./ContactForm";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: t.contact.title,
    description: t.contact.subtitle,
  };
}

export default async function ContactPage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const profile = await repo.getProfile();

  return (
    <Section spacing="lg">
      <Container size="narrow">
        <div className="mb-12">
          <Text variant="caption" className="mb-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            COMMUNICATION CHANNEL
          </Text>
          <Heading as="h1" className="mb-3">
            {t.contact.title}
          </Heading>
          <Text variant="lead">
            {t.contact.subtitle}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-xs font-mono text-zinc-500 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>DIRECT EMAIL</span>
              </div>
              <a
                href={`mailto:${profile.personal.email}`}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                {profile.personal.email}
              </a>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-mono text-zinc-500 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>LINKEDIN</span>
              </div>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                in/guilherme-rodovalho
              </a>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-mono text-zinc-500 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>GITHUB</span>
              </div>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                github.com/rodovalhog
              </a>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="p-6 sm:p-8">
              <ContactForm locale={lang} />
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
