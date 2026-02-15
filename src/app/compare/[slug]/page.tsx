import type { Metadata } from "next";
import { DRUGS, bySlug, parseCompareSlug, titleCaseFromSlug } from "../../../lib/drugs";

type Props = {
  params: { slug: string };
};

function displayName(slug: string) {
  return bySlug(slug)?.name ?? titleCaseFromSlug(slug);
}

function canonicalFor(slug: string) {
  return `https://comparemymedication.com/compare/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseCompareSlug(params.slug);
  if (!parsed) {
    return {
      title: "Drug Comparison | CompareMyMedication",
      robots: { index: false, follow: true },
    };
  }

  const aName = displayName(parsed.a);
  const bName = displayName(parsed.b);

  const title = `${aName} vs ${bName}: Differences, uses, side effects & cost`;
  const description = `Compare ${aName} vs ${bName} by uses, drug class, generic options, common side effects, and typical cost considerations. Informational only — not medical advice.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalFor(params.slug) },
    openGraph: {
      title,
      description,
      url: canonicalFor(params.slug),
      type: "article",
      siteName: "CompareMyMedication",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

// Optional but helpful for SEO/internal linking. Keep small at first.
export function generateStaticParams() {
  const pairs = [
    ["ozempic", "wegovy"],
    ["adderall", "vyvanse"],
    ["zoloft", "lexapro"],
    ["lipitor", "crestor"],
    ["viagra", "cialis"],
  ];

  return pairs.map(([a, b]) => ({ slug: `${a}-vs-${b}` }));
}

export default function ComparePage({ params }: Props) {
  const parsed = parseCompareSlug(params.slug);

  if (!parsed) {
    // If someone hits /compare/something-wrong, don't index it.
    return (
      <main style={{ padding: 32 }}>
        <h1>Comparison not found</h1>
        <p>Please use a URL like <code>/compare/ozempic-vs-wegovy</code>.</p>
      </main>
    );
  }

  const a = bySlug(parsed.a);
  const b = bySlug(parsed.b);

  const aName = displayName(parsed.a);
  const bName = displayName(parsed.b);

  const aGeneric = a?.generic ?? "—";
  const bGeneric = b?.generic ?? "—";
  const aClass = a?.class ?? "—";
  const bClass = b?.class ?? "—";

  // JSON-LD (Article + FAQ). Even before you have real content, this is structured correctly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${aName} vs ${bName}`,
    mainEntityOfPage: canonicalFor(params.slug),
    publisher: { "@type": "Organization", name: "CompareMyMedication" },
    about: [
      { "@type": "Drug", name: aName },
      { "@type": "Drug", name: bName },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${aName} the same as ${bName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `They can be similar in some ways (such as drug class or intended use), but they are not always the same. Talk to a clinician before switching.`,
        },
      },
      {
        "@type": "Question",
        name: `Is there a generic for ${aName} or ${bName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Generic availability depends on the specific medication and market. This page lists common generic names when available; confirm with your pharmacist.`,
        },
      },
    ],
  };

  return (
    <main className="comparePage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="compareHero">
        <h1 className="compareH1">{aName} <span className="compareVs">vs</span> {bName}</h1>
        <p className="compareSub">
          Informational tool only; not medical advice. Always consult a healthcare professional.
        </p>

        <div className="compareQuick">
          <div className="compareQuickCard">
            <div className="compareQuickTitle">{aName}</div>
            <div className="compareQuickRow"><span>Generic:</span> <strong>{aGeneric}</strong></div>
            <div className="compareQuickRow"><span>Class:</span> <strong>{aClass}</strong></div>
          </div>

          <div className="compareQuickCard">
            <div className="compareQuickTitle">{bName}</div>
            <div className="compareQuickRow"><span>Generic:</span> <strong>{bGeneric}</strong></div>
            <div className="compareQuickRow"><span>Class:</span> <strong>{bClass}</strong></div>
          </div>
        </div>
      </section>

      <section className="compareBody">
        <h2>Key differences</h2>
        <ul className="compareList">
          <li><strong>Drug class:</strong> {aName} ({aClass}) vs {bName} ({bClass})</li>
          <li><strong>Generic names:</strong> {aName} ({aGeneric}) vs {bName} ({bGeneric})</li>
          <li><strong>Use cases:</strong> may overlap; depends on diagnosis and dosing.</li>
          <li><strong>Cost:</strong> varies by insurance, dosage, pharmacy, and coupons.</li>
        </ul>

        <h2>Alternatives</h2>
        <p className="compareP">
          If neither option fits, clinicians may consider same-class alternatives or different classes depending on goals and tolerability.
        </p>

        <h2>Safety notes</h2>
        <p className="compareP">
          Do not start/stop/switch medications without medical guidance. Side effects and interactions differ per person.
        </p>

        <div className="compareInternal">
          <h3>More comparisons</h3>
          <div className="compareLinks">
            <a href="/compare/ozempic-vs-wegovy">Ozempic vs Wegovy</a>
            <a href="/compare/adderall-vs-vyvanse">Adderall vs Vyvanse</a>
            <a href="/compare/zoloft-vs-lexapro">Zoloft vs Lexapro</a>
            <a href="/compare/lipitor-vs-crestor">Lipitor vs Crestor</a>
            <a href="/compare/viagra-vs-cialis">Viagra vs Cialis</a>
          </div>
        </div>
      </section>
    </main>
  );
}
