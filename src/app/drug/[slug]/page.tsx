import type { Metadata } from "next";
import { bySlug, comparisonTargets, displayName, sameClass } from "../../../lib/drugs";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: { slug: string } };

const SITE = "https://comparemymedication.com";

function canonical(slug: string) {
  return `${SITE}/drug/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = bySlug(params.slug);
  if (!d) return { title: "Drug not found", robots: { index: false, follow: true } };

  const title = `${d.name}: uses, generic, class & comparisons`;
  const description =
    `Learn about ${d.name} including common uses, drug class, generic name, and head-to-head comparisons. Informational only — not medical advice.`;

  return {
    title,
    description,
    alternates: { canonical: canonical(d.slug) },
    openGraph: {
      title,
      description,
      url: canonical(d.slug),
      type: "article",
      siteName: "CompareMyMedication",
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  // Pre-render for speed + indexability (works great even with a small list)
  // Later you can remove this if you have thousands and want full dynamic.
  const slugs = ["ozempic", "wegovy", "adderall", "vyvanse", "zoloft", "lexapro"];
  return slugs.map(slug => ({ slug }));
}

export default function DrugPage({ params }: Props) {
  const d = bySlug(params.slug);
  if (!d) return notFound();

  const name = d.name ?? displayName(params.slug);
  const generic = d.generic ?? "—";
  const drugClass = d.class ?? "—";
  const conditions = d.conditions ?? [];
  const summary = d.summary ?? `Information about ${name} including generic name, class, and comparisons.`;

  const compareTo = comparisonTargets(d.slug, 6);
  const same = sameClass(d.slug, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${name} overview`,
    url: canonical(d.slug),
    about: {
      "@type": "Drug",
      name,
      nonProprietaryName: d.generic ?? undefined,
      drugClass: d.class ?? undefined,
    },
    publisher: { "@type": "Organization", name: "CompareMyMedication" },
  };

  const alts = (d.alternatives ?? [])
    .map((s) => bySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof bySlug>>[];

  return (
    <div className="drug-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <div className="drug-hero">
        <div className="drug-hero-content">
          <div className="drug-breadcrumb">
            <Link href="/" className="drug-breadcrumb-link">Home</Link>
            <span className="drug-breadcrumb-separator">›</span>
            <span className="drug-breadcrumb-current">{name}</span>
          </div>
          
          <h1 className="drug-title">{name}</h1>
          
          {d.generic && (
            <p className="drug-generic">
              Generic: <strong>{generic}</strong>
            </p>
          )}
          
          <p className="drug-disclaimer">
            ⚕️ Informational tool only; not medical advice. Always consult a healthcare professional.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="drug-content">
        {/* Key Facts Card */}
        <div className="drug-card drug-card-primary">
          <h2 className="drug-card-title">📊 Key Facts</h2>
          <div className="drug-facts-grid">
            <div className="drug-fact">
              <div className="drug-fact-label">Generic Name</div>
              <div className="drug-fact-value">{generic}</div>
            </div>
            <div className="drug-fact">
              <div className="drug-fact-label">Drug Class</div>
              <div className="drug-fact-value">{drugClass}</div>
            </div>
            <div className="drug-fact">
              <div className="drug-fact-label">Category</div>
              <div className="drug-fact-value">{d.category || "Not specified"}</div>
            </div>
            {d.rxcui && (
              <div className="drug-fact">
                <div className="drug-fact-label">RxCUI Code</div>
                <div className="drug-fact-value">{d.rxcui}</div>
              </div>
            )}
          </div>
        </div>

        {/* Commonly Used For */}
        {conditions.length > 0 && (
          <div className="drug-card">
            <h2 className="drug-card-title">💊 Commonly Used For</h2>
            <div className="drug-conditions">
              {conditions.slice(0, 8).map((condition: string, idx: number) => (
                <span key={idx} className="drug-condition-tag">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compare With */}
        {compareTo.length > 0 && (
          <div className="drug-card">
            <h2 className="drug-card-title">🔄 Compare With</h2>
            <div className="drug-compare-list">
              {compareTo.map((x: any) => (
                <Link key={x.slug} href={`/compare/${d.slug}-vs-${x.slug}`} className="drug-compare-link">
                  <span className="drug-compare-arrow">→</span>
                  {name} vs {x.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Similar Medications */}
        {same.length > 0 && (
          <div className="drug-card">
            <h2 className="drug-card-title">📋 Similar Medications (Same Class)</h2>
            <div className="drug-similar-list">
              {same.map((x: any, idx: number) => (
                <span key={x.slug}>
                  <Link href={`/drug/${x.slug}`} className="drug-similar-link">
                    {x.name}
                  </Link>
                  {idx < same.length - 1 && <span className="drug-similar-separator"> • </span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Overview */}
        {summary && (
          <div className="drug-card">
            <h2 className="drug-card-title">Overview</h2>
            <p className="drug-text">{summary}</p>
          </div>
        )}

        {/* FDA Label Info */}
        {d.label?.indications?.length && (
          <div className="drug-card">
            <h2 className="drug-card-title">What is {name} used for?</h2>
            <p className="drug-text">{d.label.indications[0]}</p>
          </div>
        )}

        {d.label?.warnings?.length && (
          <div className="drug-card drug-card-warning">
            <h2 className="drug-card-title">⚠️ Warnings</h2>
            <p className="drug-text">{d.label.warnings[0]}</p>
          </div>
        )}

        {/* Safety Note */}
        <div className="drug-card drug-card-info">
          <h2 className="drug-card-title">Safety Note</h2>
          <p className="drug-text">
            Do not start, stop, or switch medications without medical guidance. Side effects and interactions differ per person.
          </p>
        </div>
      </div>

      <a href="#top" className="drug-back-to-top" aria-label="Back to top">
        ↑
      </a>
    </div>
  );
}
