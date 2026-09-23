export type SupportedLocale = "pt-BR" | "en-US";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["pt-BR", "en-US"];
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

export interface TranslationSchema {
  common: {
    name: string;
    role: string;
    location: string;
    availableForWork: string;
    viewResume: string;
    downloadResume: string;
    talkToAI: string;
    exploreWork: string;
    contactMe: string;
    copyEmail: string;
    emailCopied: string;
    readMore: string;
    backToProjects: string;
    allRightsReserved: string;
    builtWith: string;
    sourceCode: string;
    increaseFontSize: string;
    decreaseFontSize: string;
    resetFontSize: string;
    fontSize: string;
  };
  navigation: {
    home: string;
    about: string;
    experience: string;
    projects: string;
    skills: string;
    architecture: string;
    resume: string;
    contact: string;
    careerAI: string;
    performance: string;
  };
  home: {
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    metricsTitle: string;
    featuredProjectsTitle: string;
    featuredProjectsSubtitle: string;
    dnaTitle: string;
    dnaSubtitle: string;
    experiencePreviewTitle: string;
    experiencePreviewSubtitle: string;
  };
  about: {
    title: string;
    subtitle: string;
    philosophyTitle: string;
    engineeringValuesTitle: string;
    educationTitle: string;
    certificationsTitle: string;
  };
  experience: {
    title: string;
    subtitle: string;
    problemLabel: string;
    decisionLabel: string;
    implementationLabel: string;
    impactLabel: string;
    technologiesUsed: string;
  };
  projects: {
    title: string;
    subtitle: string;
    filterAll: string;
    viewCaseStudy: string;
    contextTitle: string;
    problemTitle: string;
    constraintsTitle: string;
    optionsTitle: string;
    decisionTitle: string;
    solutionTitle: string;
    architectureTitle: string;
    impactTitle: string;
    metricsTitle: string;
  };
  skills: {
    title: string;
    subtitle: string;
    expertLevel: string;
    advancedLevel: string;
    proficientLevel: string;
    evidenceLinked: string;
  };
  resume: {
    title: string;
    subtitle: string;
    downloadPDF: string;
    printFriendly: string;
    version: string;
    summaryTitle: string;
    experienceTitle: string;
    educationTitle: string;
    skillsTitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    sendButton: string;
    sendingButton: string;
    successMessage: string;
    errorMessage: string;
  };
  performancePage: {
    badge: string;
    title: string;
    subtitle: string;
    liveTelemetryTitle: string;
    liveTelemetrySubtitle: string;
    aiDiagnosticTitle: string;
    aiDiagnosticSubtitle: string;
    benchmarkTitle: string;
    benchmarkSubtitle: string;
    runBenchmark: string;
    benchmarking: string;
    goodBadge: string;
    needsImprovementBadge: string;
    poorBadge: string;
    executiveSummary: string;
    architectureNotes: string;
  };
}
