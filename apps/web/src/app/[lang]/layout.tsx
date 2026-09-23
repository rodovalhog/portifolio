import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations, SUPPORTED_LOCALES } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import { Footer } from "@portfolio/ui";
import { AppHeader } from "@/components/AppHeader";
import { AIProvider } from "@/context/AIContext";
import { ChatWidget } from "@/components/ai/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}): Promise<Metadata> {
  const t = getTranslations(params.lang);
  const repo = new FileProfileRepository();
  const profile = await repo.getProfile();

  const title = `${profile.personal.name} — ${t.common.role}`;
  const description =
    params.lang === "pt-BR"
      ? profile.personal.bio["pt-BR"]
      : profile.personal.bio["en-US"];

  return {
    title: {
      default: title,
      template: `%s | ${profile.personal.name}`,
    },
    description,
    keywords: [
      "Staff Software Engineer",
      "Software Architect",
      "Next.js",
      "TypeScript",
      "Clean Architecture",
      "Web Performance",
      "Core Web Vitals",
      "AI Engineering",
      "Model Context Protocol",
      "Guilherme Rodovalho",
    ],
    authors: [{ name: profile.personal.name }],
    creator: profile.personal.name,
    metadataBase: new URL("https://guilhermerodovalho.dev"),
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        "pt-BR": "/pt-BR",
        "en-US": "/en-US",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://guilhermerodovalho.dev/${params.lang}`,
      siteName: "Guilherme Rodovalho — Engineering Portfolio",
      locale: params.lang,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: SupportedLocale };
}) {
  const repo = new FileProfileRepository();
  const profile = await repo.getProfile();

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.personal.name,
    jobTitle: "Staff Software Engineer",
    url: `https://guilhermerodovalho.dev/${params.lang}`,
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: [
      "Software Architecture",
      "Next.js",
      "TypeScript",
      "Clean Architecture",
      "Core Web Vitals",
      "AI Engineering",
      "Model Context Protocol",
    ],
  };

  return (
    <html lang={params.lang} className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var fs = localStorage.getItem('portfolio_font_size');
                if (fs === 'lg' || fs === 'xl') {
                  document.documentElement.setAttribute('data-font-size', fs);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-40" />
        <div className="fixed inset-0 radial-glow pointer-events-none z-0" />
        
        <AIProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <AppHeader locale={params.lang} />
            <main className="flex-1">{children}</main>
            <Footer locale={params.lang} links={profile.links} />
            <ChatWidget />
          </div>
        </AIProvider>
      </body>
    </html>
  );
}
