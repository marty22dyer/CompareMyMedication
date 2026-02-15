import { NextResponse } from "next/server";
import { DRUGS } from "@/lib/drugs";

const SITE = "https://comparemymedication.com";

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function url(loc: string, lastmod?: string, changefreq?: string, priority?: string) {
  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
    ${priority ? `<priority>${priority}</priority>` : ""}
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString();

  // Build compare pairs (simple starting set):
  // same-class comparisons first, then a few popular cross-links.
  const comparePairs: Array<[string, string]> = [];
  for (const d of DRUGS) {
    for (const other of DRUGS) {
      if (d.slug === other.slug) continue;
      if (d.class && other.class && d.class === other.class) {
        // only include one direction to avoid duplicates
        if (d.slug < other.slug) comparePairs.push([d.slug, other.slug]);
      }
    }
  }

  // Cap to prevent huge sitemap early; later you can paginate.
  const cappedPairs = comparePairs.slice(0, 500);

  const urls: string[] = [];

  // Core pages
  urls.push(url(`${SITE}/`, now, "daily", "1.0"));
  urls.push(url(`${SITE}/compare`, now, "daily", "0.9"));

  // Drug pages + generic pages
  for (const d of DRUGS) {
    urls.push(url(`${SITE}/drug/${d.slug}`, now, "weekly", "0.8"));
    urls.push(url(`${SITE}/drug/${d.slug}/generic`, now, "weekly", "0.7"));
  }

  // Compare pages
  for (const [a, b] of cappedPairs) {
    urls.push(url(`${SITE}/compare/${a}-vs-${b}`, now, "weekly", "0.7"));
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
