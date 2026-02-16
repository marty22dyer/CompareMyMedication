import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { allCompareSlugs } from "../../../lib/compare";
import Breadcrumbs from "../../../components/Breadcrumbs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

async function getCompare(slug: string) {
  const [a, b] = slug.split("-vs-");
  const res = await fetch(`${SITE}/api/compare?a=${a}&b=${b}`, {
    next: { revalidate: 60 * 60 }, // cache 1 hour
  });

  if (!res.ok) return null;
  return res.json();
}

type Props = { params: { slug: string } };

const canonicalUrl = (slug: string) => `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/compare/${slug}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCompare(params.slug);
  if (!data) {
    return { title: "Comparison not found", robots: { index: false, follow: true } };
  }

  const title = `${data.a.name} vs ${data.b.name}: differences, generics, class & costs`;
  const description = `Compare ${data.a.name} vs ${data.b.name} with key differences like drug class, generic name, and typical considerations. Informational only — not medical advice.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(params.slug) },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl(params.slug),
      type: "article",
      siteName: "CompareMyMedication",
    },
  };
}

function row(label: string, a: string, b: string) {
  return (
    <div className="cmpRow">
      <div className="cmpLabel">{label}</div>
      <div className="cmpCell">{a}</div>
      <div className="cmpCell">{b}</div>
    </div>
  );
}

export function generateStaticParams() {
  return allCompareSlugs().map((slug) => ({ slug }));
}

export default async function ComparePage({ params }: Props) {
  const data = await getCompare(params.slug);
  if (!data) return notFound();

  // enforce canonical alphabetical order
  const canonSlug = [data.a.slug, data.b.slug].sort().join("-vs-");
  if (params.slug !== canonSlug) {
    redirect(`/compare/${canonSlug}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${data.a.name} vs ${data.b.name}`,
    url: canonicalUrl(canonSlug),
    about: [
      { "@type": "Drug", name: data.a.name, nonProprietaryName: data.a.generic },
      { "@type": "Drug", name: data.b.name, nonProprietaryName: data.b.generic },
    ],
    publisher: { "@type": "Organization", name: "CompareMyMedication" },
  };

  return (
    <main className="compare-page-v2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="cmp-hero">
        <div className="cmp-container">
          <h1 className="cmp-main-title">
            <span className="cmp-drug-a">{data.a.name}</span>
            <span className="cmp-vs-text">vs</span>
            <span className="cmp-drug-b">{data.b.name}</span>
          </h1>
          
          <div className="cmp-hero-cards">
            {/* Drug A Card */}
            <div className="cmp-hero-card">
              <div className="cmp-stars">★★★★☆</div>
              <div className="cmp-generic-status">
                $ {data.a.generic ? "Generic available" : "Brand only"}
              </div>
              <a 
                href={`https://www.goodrx.com/${data.a.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="cmp-price-btn cmp-btn-green"
              >
                See cheapest price for {data.a.name} →
              </a>
            </div>

            {/* Drug B Card */}
            <div className="cmp-hero-card">
              <div className="cmp-stars">★★★★☆</div>
              <div className="cmp-generic-status">
                {data.b.generic ? "$ Generic available" : "$$$ Brand only"}
              </div>
              <a 
                href={`https://www.goodrx.com/${data.b.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="cmp-price-btn cmp-btn-blue"
              >
                See cheapest price for {data.b.name} →
              </a>
            </div>
          </div>

          <div className="cmp-which-better">
            Which works better for YOU? →
          </div>
        </div>
      </section>

      {/* Comparison Body */}
      <section className="cmp-body">
        <div className="cmp-container">
          
          {/* Quick Comparison Table */}
          <div className="cmp-section">
            <h2 className="cmp-section-title">Quick Comparison</h2>
            <div className="cmp-comparison-table">
              <div className="cmp-table-row cmp-table-header">
                <div className="cmp-table-cell"></div>
                <div className="cmp-table-cell"><strong>{data.a.name}</strong></div>
                <div className="cmp-table-cell"><strong>{data.b.name}</strong></div>
              </div>
              <div className="cmp-table-row">
                <div className="cmp-table-cell cmp-table-label">Generic name</div>
                <div className="cmp-table-cell">{data.a.generic || "—"}</div>
                <div className="cmp-table-cell">{data.b.generic || "—"}</div>
              </div>
              <div className="cmp-table-row">
                <div className="cmp-table-cell cmp-table-label">Drug class</div>
                <div className="cmp-table-cell">{data.a.class || "—"}</div>
                <div className="cmp-table-cell">{data.b.class || "—"}</div>
              </div>
              <div className="cmp-table-row">
                <div className="cmp-table-cell cmp-table-label">Used for</div>
                <div className="cmp-table-cell">{data.a.usedFor?.slice(0, 2).join(", ") || "—"}</div>
                <div className="cmp-table-cell">{data.b.usedFor?.slice(0, 2).join(", ") || "—"}</div>
              </div>
            </div>
          </div>

          {/* Cost Comparison */}
          <div className="cmp-section">
            <h2 className="cmp-section-title">Cost Comparison</h2>
            <div className="cmp-cost-grid">
              <div className="cmp-cost-card">
                <h3 className="cmp-cost-drug-name">{data.a.name}</h3>
                <div className="cmp-cost-row">
                  <span className="cmp-cost-label">Typical monthly cost</span>
                  <span className="cmp-cost-value">Check GoodRx</span>
                </div>
              </div>
              <div className="cmp-cost-card">
                <h3 className="cmp-cost-drug-name">{data.b.name}</h3>
                <div className="cmp-cost-row">
                  <span className="cmp-cost-label">Typical monthly cost</span>
                  <span className="cmp-cost-value">Check GoodRx</span>
                </div>
              </div>
            </div>
          </div>

          {/* Best If You Want */}
          <div className="cmp-section">
            <h2 className="cmp-section-title">Best if you want...</h2>
            <div className="cmp-best-grid">
              <div className="cmp-best-card">
                <div className="cmp-best-header">
                  <span className="cmp-best-icon">💊</span>
                  <h3>{data.a.name}</h3>
                  <span className="cmp-best-arrow">→</span>
                </div>
                <div className="cmp-best-info">
                  <span className="cmp-warning-icon">⚠️</span>
                  <span>{data.a.usedFor?.[0] || "Consult your healthcare provider"}</span>
                </div>
              </div>
              <div className="cmp-best-card">
                <div className="cmp-best-header">
                  <span className="cmp-best-icon">💊</span>
                  <h3>{data.b.name}</h3>
                  <span className="cmp-best-arrow">→</span>
                </div>
                <div className="cmp-best-info">
                  <span className="cmp-warning-icon">⚠️</span>
                  <span>{data.b.usedFor?.[0] || "Consult your healthcare provider"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="cmp-disclaimer">
            <strong>⚕️ Medical Disclaimer:</strong> This comparison is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult your healthcare provider before starting, stopping, or changing any medication.
          </div>
        </div>
      </section>
    </main>
  );
}
