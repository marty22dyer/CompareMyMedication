import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug } from "../../../lib/drugs";

export default function DrugPage({ params }: { params: { slug: string } }) {
  const drug = bySlug(params.slug);
  if (!drug) return notFound();

  const name = drug.name;
  const generic = drug.generic || "—";
  const drugClass = drug.class || "—";
  const conditions = drug.conditions || [];
  
  const alts = (drug.alternatives ?? [])
    .map((s: string) => bySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof bySlug>>[];

  return (
    <div className="drug-page">
      {/* Hero Section */}
      <div className="drug-hero">
        <div className="drug-hero-content">
          <div className="drug-breadcrumb">
            <Link href="/" className="drug-breadcrumb-link">Home</Link>
            <span className="drug-breadcrumb-separator">›</span>
            <span className="drug-breadcrumb-current">{name}</span>
          </div>
          
          <h1 className="drug-title">{name}</h1>
          
          {drug.generic && (
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
              <div className="drug-fact-value">{drug.category || "Not specified"}</div>
            </div>
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

        {/* Alternatives */}
        {alts.length > 0 && (
          <div className="drug-card">
            <h2 className="drug-card-title">🔄 Similar Medications</h2>
            <div className="drug-similar-list">
              {alts.map((a: any, idx: number) => (
                <span key={a.slug}>
                  <Link href={`/drug/${a.slug}`} className="drug-similar-link">
                    {a.name}
                  </Link>
                  {idx < alts.length - 1 && <span className="drug-similar-separator"> • </span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FDA Label Info */}
        {drug.label?.indications?.length && (
          <div className="drug-card">
            <h2 className="drug-card-title">What is {name} used for?</h2>
            <p className="drug-text">{drug.label.indications[0]}</p>
          </div>
        )}

        {drug.label?.warnings?.length && (
          <div className="drug-card drug-card-warning">
            <h2 className="drug-card-title">⚠️ Warnings</h2>
            <p className="drug-text">{drug.label.warnings[0]}</p>
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
