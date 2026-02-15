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
    <main className="compare-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section with Side-by-Side Cards */}
      <section className="compare-hero">
        <div className="compare-hero-content">
          <h1 className="compare-title">
            <span className="compare-drug-name">{data.a.name}</span>
            <span className="compare-vs">vs ⚡</span>
            <span className="compare-drug-name">{data.b.name}</span>
          </h1>
          
          <div className="compare-cards">
            {/* Drug A Card */}
            <div className="compare-card compare-card-left">
              <div className="compare-card-header">
                <h2>{data.a.name}</h2>
                <p className="compare-card-subtitle">{data.a.class || "Medication"}</p>
              </div>
              
              <div className="compare-card-body">
                <div className="compare-info-row">
                  <span className="compare-label">💊 Generic:</span>
                  <span className="compare-value">{data.a.generic ? "Available" : "Brand only"}</span>
                </div>
                {data.a.generic && (
                  <div className="compare-generic-name">{data.a.generic}</div>
                )}
              </div>
              
              <a 
                href={`https://www.goodrx.com/${data.a.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="compare-cta-button compare-cta-primary"
              >
                See cheapest price for {data.a.name} →
              </a>
            </div>

            {/* Drug B Card */}
            <div className="compare-card compare-card-right">
              <div className="compare-card-header">
                <h2>{data.b.name}</h2>
                <p className="compare-card-subtitle">{data.b.class || "Medication"}</p>
              </div>
              
              <div className="compare-card-body">
                <div className="compare-info-row">
                  <span className="compare-label">💊 Generic:</span>
                  <span className="compare-value">{data.b.generic ? "Available" : "Brand only"}</span>
                </div>
                {data.b.generic && (
                  <div className="compare-generic-name">{data.b.generic}</div>
                )}
              </div>
              
              <a 
                href={`https://www.goodrx.com/${data.b.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="compare-cta-button compare-cta-secondary"
              >
                See cheapest price for {data.b.name} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Sections */}
      <section className="compare-body">
        <div className="compare-section">
          <h2 className="compare-section-title">📊 Quick Comparison</h2>
          
          <div className="compare-table">
            <div className="compare-table-row compare-table-header">
              <div className="compare-table-cell"></div>
              <div className="compare-table-cell">{data.a.name}</div>
              <div className="compare-table-cell">{data.b.name}</div>
            </div>
            
            <div className="compare-table-row">
              <div className="compare-table-cell compare-table-label">Generic name</div>
              <div className="compare-table-cell">{data.a.generic || "—"}</div>
              <div className="compare-table-cell">{data.b.generic || "—"}</div>
            </div>
            
            <div className="compare-table-row">
              <div className="compare-table-cell compare-table-label">Drug class</div>
              <div className="compare-table-cell">{data.a.class || "—"}</div>
              <div className="compare-table-cell">{data.b.class || "—"}</div>
            </div>
            
            <div className="compare-table-row">
              <div className="compare-table-cell compare-table-label">Commonly used for</div>
              <div className="compare-table-cell">{data.a.usedFor?.slice(0, 2).join(", ") || "—"}</div>
              <div className="compare-table-cell">{data.b.usedFor?.slice(0, 2).join(", ") || "—"}</div>
            </div>
          </div>
        </div>

        <div className="compare-section">
          <h2 className="compare-section-title">💡 Key Takeaways</h2>
          <div className="compare-takeaways">
            <div className="compare-takeaway">
              <span className="compare-takeaway-icon">🔍</span>
              <p>{data.summary.sameClass ? "Both drugs are in the same drug class." : "These drugs are in different drug classes."}</p>
            </div>
            <div className="compare-takeaway">
              <span className="compare-takeaway-icon">💊</span>
              <p>Generic names: <strong>{data.a.generic || data.a.name}</strong> vs <strong>{data.b.generic || data.b.name}</strong></p>
            </div>
            <div className="compare-takeaway">
              <span className="compare-takeaway-icon">💰</span>
              <p>Cost can vary widely by insurance and pharmacy. Use the buttons above to compare prices.</p>
            </div>
          </div>
        </div>

        <div className="compare-section">
          <h2 className="compare-section-title">🏥 Best if you want...</h2>
          <div className="compare-recommendations">
            <div className="compare-recommendation">
              <h3>💊 {data.a.name}</h3>
              <p>{data.a.usedFor?.[0] || "Consult your healthcare provider"}</p>
              <a href={`/drug/${data.a.slug}`} className="compare-learn-more">Learn more →</a>
            </div>
            <div className="compare-recommendation">
              <h3>💊 {data.b.name}</h3>
              <p>{data.b.usedFor?.[0] || "Consult your healthcare provider"}</p>
              <a href={`/drug/${data.b.slug}`} className="compare-learn-more">Learn more →</a>
            </div>
          </div>
        </div>

        <div className="compare-disclaimer">
          <p><strong>⚕️ Medical Disclaimer:</strong> This comparison is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult your healthcare provider before starting, stopping, or changing any medication.</p>
        </div>
      </section>
    </main>
  );
}
