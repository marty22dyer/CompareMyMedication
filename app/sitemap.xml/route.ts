import { drugs } from '../../lib/drugs';

export async function GET() {
  const baseUrl = 'https://comparemymedication.com';
  
  // Get all drug slugs
  const drugUrls = drugs.map(drug => ({
    url: `${baseUrl}/drug/${drug.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Generate comparison URLs for popular comparisons
  const popularComparisons = [
    'adderall-vs-vyvanse',
    'ozempic-vs-wegovy',
    'zoloft-vs-lexapro',
    'metformin-vs-ozempic',
    'lipitor-vs-crestor',
    'xanax-vs-ativan',
  ];

  const comparisonUrls = popularComparisons.map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/compare`, priority: 0.9 },
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, priority: 0.3 },
  ];

  const allUrls = [
    ...staticPages.map(page => ({
      ...page,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
    })),
    ...comparisonUrls,
    ...drugUrls,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastModified, changeFrequency, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.toISOString()}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
