"use client";

import React, { useState, useEffect } from "react";
import { SupportedLocale } from "@portfolio/domain";
import { CommandPalette } from "../navigation/CommandPalette";
import { JobMatcherModal } from "../ai/JobMatcherModal";
import { LiveTelemetryWidget } from "../performance/LiveTelemetryWidget";

export const InteractivePlatformAddons: React.FC<{ locale: SupportedLocale }> = ({
  locale,
}) => {
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);

  useEffect(() => {
    const handleOpenJobMatcher = () => setIsJobMatcherOpen(true);
    window.addEventListener("open-job-matcher", handleOpenJobMatcher);

    return () => {
      window.removeEventListener("open-job-matcher", handleOpenJobMatcher);
    };
  }, []);

  return (
    <>
      <CommandPalette
        locale={locale}
        onOpenJobMatcher={() => setIsJobMatcherOpen(true)}
      />
      <JobMatcherModal
        isOpen={isJobMatcherOpen}
        onClose={() => setIsJobMatcherOpen(false)}
        locale={locale}
      />
      <LiveTelemetryWidget locale={locale} />
    </>
  );
};
