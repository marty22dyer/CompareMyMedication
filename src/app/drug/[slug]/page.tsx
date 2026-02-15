import type { Metadata } from "next";
import { bySlug, comparisonTargets, displayName, sameClass } from "@/lib/drugs";
import { notFound } from "next/navigation";

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

  return (
    <main className="comparePage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="compareHero">
        <h1 className="compareH1">{name}</h1>
        <p className="compareSub">
          Informational tool only; not medical advice. Always consult a healthcare professional.
        </p>

        <div className="compareQuick">
          <div className="compareQuickCard">
            <div className="compareQuickTitle">Quick facts</div>
            <div className="compareQuickRow"><span>Generic:</span> <strong>{generic}</strong></div>
            <div className="compareQuickRow"><span>Class:</span> <strong>{drugClass}</strong></div>
            <div className="compareQuickRow">
              <span>Generic page:</span>
              <strong><a href={`/drug/${d.slug}/generic`}>View</a></strong>
            </div>
          </div>

          <div className="compareQuickCard">
            <div className="compareQuickTitle">Commonly used for</div>
            {conditions.length ? (
              <ul className="compareList" style={{ marginTop: 0 }}>
                {conditions.slice(0, 6).map(c => <li key={c}>{c}</li>)}
              </ul>
            ) : (
              <p className="compareP" style={{ margin: 0 }}>
                Uses vary by diagnosis and clinician guidance.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="compareBody">
        <h2>Overview</h2>
        <p className="compareP">{summary}</p>

        <h2>Generic name</h2>
        <p className="compareP">
          {name} is commonly associated with generic name <strong>{generic}</strong>.
          Generic availability can vary—confirm with a pharmacist.
        </p>

        <h2>Compare {name} to</h2>
        <div className="compareLinks">
          {compareTo.map(x => (
            <a key={x.slug} href={`/compare/${d.slug}-vs-${x.slug}`}>
              {name} vs {x.name}
            </a>
          ))}
        </div>

        <h2>Same-class medications</h2>
        {same.length ? (
          <div className="compareLinks">
            {same.map(x => (
              <a key={x.slug} href={`/drug/${x.slug}`}>{x.name}</a>
            ))}
          </div>
        ) : (
          <p className="compareP">No same-class links available yet.</p>
        )}

        <h2>Safety note</h2>
        <p className="compareP">
          Do not start, stop, or switch medications without medical guidance. Side effects and interactions differ per person.
        </p>
      </section>
    </main>
  );
}
