import type { Metadata } from "next";
import { bySlug, displayName, drugs } from "../../../../lib/drugs";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

const SITE = "https://comparemymedication.com";

function canonical(slug: string) {
  return `${SITE}/drug/${slug}/generic`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = bySlug(params.slug);
  if (!d) return { title: "Not found", robots: { index: false, follow: true } };

  const name = d.name ?? displayName(params.slug);
  const title = `Generic for ${name}: name, options & cost notes`;
  const description =
    `Find generic name for ${name}, how brand vs generic typically differs, and comparison links. Informational only — not medical advice.`;

  return {
    title,
    description,
    alternates: { canonical: canonical(d.slug) },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return drugs.map((d) => ({ slug: d.slug }));
}

export default function GenericPage({ params }: Props) {
  const d = bySlug(params.slug);
  if (!d) return notFound();

  const name = d.name ?? displayName(params.slug);
  const generic = d.generic ?? "—";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Generic for ${name}`,
    mainEntityOfPage: canonical(d.slug),
    publisher: { "@type": "Organization", name: "CompareMyMedication" },
    about: { "@type": "Drug", name, nonProprietaryName: d.generic ?? undefined },
  };

  return (
    <main className="comparePage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="compareHero">
        <h1 className="compareH1">Generic for {name}</h1>
        <p className="compareSub">
          Informational tool only; not medical advice. Always consult a healthcare professional.
        </p>

        <div className="compareQuick">
          <div className="compareQuickCard">
            <div className="compareQuickTitle">Generic name</div>
            <div className="compareQuickRow"><span>{name}:</span> <strong>{generic}</strong></div>
            <div className="compareQuickRow">
              <span>Drug page:</span>
              <strong><a href={`/drug/${d.slug}`}>Overview</a></strong>
            </div>
          </div>

          <div className="compareQuickCard">
            <div className="compareQuickTitle">Brand vs generic (general)</div>
            <ul className="compareList" style={{ marginTop: 0 }}>
              <li>Same active ingredient (when true generic exists)</li>
              <li>Different fillers/appearance can vary</li>
              <li>Cost often differs by insurance/pharmacy</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="compareBody">
        <h2>Notes on availability</h2>
        <p className="compareP">
          Generic availability depends on market and regulatory status. If the generic name is shown as "—",
          this may indicate it's not available or not added yet in our dataset.
        </p>

        <h2>Compare {name} with similar options</h2>
        <div className="compareLinks">
          <a href="/compare/ozempic-vs-wegovy">Ozempic vs Wegovy</a>
          <a href="/compare/adderall-vs-vyvanse">Adderall vs Vyvanse</a>
          <a href="/compare/zoloft-vs-lexapro">Zoloft vs Lexapro</a>
        </div>
      </section>
    </main>
  );
}
