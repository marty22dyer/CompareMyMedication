import { drugs } from "../lib/drugs";

const BASE_URL = "https://comparemymedication.com";

const STATIC_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
];

const CATEGORY_SLUGS = [
  "diabetes-medications",
  "weight-loss-drugs",
  "adhd-medications",
  "depression-anxiety",
  "blood-pressure",
  "cholesterol",
  "pain-relief",
  "antibiotics",
  "heart-medications",
  "thyroid",
  "asthma-copd",
  "birth-control",
];

const POPULAR_COMPARISONS = [
  "ozempic-vs-wegovy",
  "adderall-vs-vyvanse",
  "zoloft-vs-lexapro",
  "metformin-vs-ozempic",
  "lipitor-vs-crestor",
  "xanax-vs-ativan",
  "prozac-vs-zoloft",
  "cialis-vs-viagra",
  "synthroid-vs-levothyroxine",
  "lisinopril-vs-losartan",
];

export default function sitemap() {
  const now = new Date();

  const staticUrls = STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const categoryUrls = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const drugUrls = drugs.map((drug) => ({
    url: `${BASE_URL}/drug/${drug.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const compareUrls = POPULAR_COMPARISONS.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticUrls,
    ...categoryUrls,
    ...compareUrls,
    ...drugUrls,
  ];
}
