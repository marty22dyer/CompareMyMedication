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
    <main className="comparePage">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: "Compare" },
          { label: `${data.a.name} vs ${data.b.name}` }
        ]}
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="compareHero">
        <h1 className="compareH1">{data.a.name} vs {data.b.name}</h1>
        <p className="compareSub">
          {data.summary.disclaimer}
        </p>

        <div className="compareTopLinks">
          <a className="comparePill" href={`/drug/${data.a.slug}`}>{data.a.name} overview</a>
          <a className="comparePill" href={`/drug/${data.b.slug}`}>{data.b.name} overview</a>
          <a className="comparePill" href={`/drug/${data.a.slug}/generic`}>Generic for {data.a.name}</a>
          <a className="comparePill" href={`/drug/${data.b.slug}/generic`}>Generic for {data.b.name}</a>
        </div>
      </section>

      <section className="compareBody">
        <h2>Quick comparison</h2>

        <div className="cmpTable">
          <div className="cmpHeader">
            <div />
            <div className="cmpHeadCell">{data.a.name}</div>
            <div className="cmpHeadCell">{data.b.name}</div>
          </div>

          {row("Generic name", data.a.generic || "—", data.b.generic || "—")}
          {row("Drug class", data.a.class || "—", data.b.class || "—")}
          {row("Commonly used for", (data.a.usedFor?.slice(0, 3).join(", ") || "—"), (data.b.usedFor?.slice(0, 3).join(", ") || "—"))}
        </div>

        <h2>Key takeaways</h2>
        <ul className="compareList">
          <li>{data.summary.sameClass ? "Both drugs are in the same drug class." : "These drugs are in different drug classes."}</li>
          <li>Generic names differ: <strong>{data.a.generic || "—"}</strong> vs <strong>{data.b.generic || "—"}</strong>.</li>
          <li>Cost can vary widely by insurance/pharmacy; use coupon links to compare.</li>
        </ul>

        <h2>Cost & savings (placeholder)</h2>
        <p className="compareP">
          This section is where affiliate pricing links will live (GoodRx/SingleCare/Amazon Pharmacy).
          For now, keep it informational: "Check local prices and coupons".
        </p>

        <div className="compareCtas">
          <a className="compareCta" href="/compare">Compare another medication</a>
          <a className="compareCta ghost" href={`/drug/${data.a.slug}`}>Back to {data.a.name}</a>
        </div>
      </section>
    </main>
  );
}
