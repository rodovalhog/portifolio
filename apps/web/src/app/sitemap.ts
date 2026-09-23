import { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";

const baseUrl = "https://guilhermerodovalho.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = new FileProfileRepository();
  const projects = await repo.getProjects();

  const routes = ["", "/about", "/experience", "/projects", "/skills", "/performance", "/resume", "/contact", "/career"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    for (const project of projects) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  return sitemapEntries;
}
