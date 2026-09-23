import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { Container, Section } from "@portfolio/ui";
import { PerformanceObservatory } from "@/components/performance/PerformanceObservatory";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: `${t.navigation.performance} | Guilherme Rodovalho`,
    description: t.performancePage.subtitle,
  };
}

export default function PerformancePage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  return (
    <Section spacing="lg">
      <Container>
        <PerformanceObservatory locale={params.lang} />
      </Container>
    </Section>
  );
}
