import type { MetadataRoute } from "next";
import { drugs, comparisonTargets } from "../lib/drugs";

const SITE = "https://comparemymedication.com";

import sitemap from "./sitemap-optimized";
export default sitemap;

// drug pages
const drugUrls: MetadataRoute.Sitemap = drugs.map((d) => ({
  url: `${SITE}/drug/${d.slug}`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.8,
}));

// generic pages (optional)
const genericUrls: MetadataRoute.Sitemap = drugs.map((d) => ({
  url: `${SITE}/drug/${d.slug}/generic`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.6,
}));

// compare pages (SEO engine) - canonical alphabetical order only
const seen = new Set<string>();
const compareUrls: MetadataRoute.Sitemap = [];

for (const drug of drugs) {
  for (const t of comparisonTargets(drug.slug)) {
    const targetSlug = typeof t === "string" ? t : t?.slug;
    if (!targetSlug) continue;
      if (!targetSlug) continue;

      const canonSlug = [drug.slug, targetSlug].sort().join("-vs-");
      if (seen.has(canonSlug)) continue;
      seen.add(canonSlug);

      compareUrls.push({
        url: `${SITE}/compare/${canonSlug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // homepage and compare index
  const base: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  return [...base, ...drugUrls, ...genericUrls, ...compareUrls];
}
