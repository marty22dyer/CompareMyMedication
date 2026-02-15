import { getPopularDrugs, getEnrichedDrugs } from "../lib/drugs-optimized";

export default function sitemap() {
  const baseUrl = "http://localhost:3001";
  const popularDrugs = getPopularDrugs(100);
  const enrichedDrugs = getEnrichedDrugs();
  
  // Combine and deduplicate
  const allDrugs = new Map();
  popularDrugs.forEach(drug => allDrugs.set(drug.slug, drug));
  enrichedDrugs.forEach(drug => allDrugs.set(drug.slug, drug));
  
  const drugUrls = Array.from(allDrugs.values()).map((drug) => ({
    url: `${baseUrl}/drug/${drug.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...drugUrls,
  ];
}
