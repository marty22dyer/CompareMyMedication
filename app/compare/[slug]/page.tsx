import type { Metadata } from "next";
import { bySlug } from "../../../lib/drugs";
import { getCompareContent, getDynamicCompareContent } from "../../../lib/compare-content";
import ComparePageClient from "./ComparePageClient";

const SITE = "https://comparemymedication.com";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [slugA, slugB] = params.slug.split("-vs-");
  const A = bySlug(slugA);
  const B = bySlug(slugB);

  if (!A || !B) return { title: "Comparison Not Found", robots: { index: false, follow: true } };

  const title = `${A.name} vs ${B.name}: Side-by-Side Comparison`;
  const usedForA = A.usedFor?.slice(0, 1).join("") ?? "";
  const usedForB = B.usedFor?.slice(0, 1).join("") ?? "";
  const description = `Compare ${A.name} vs ${B.name} side-by-side. See differences in uses, side effects, pricing, and drug class.${usedForA ? ` ${A.name} is used for ${usedForA}.` : ""}${usedForB ? ` ${B.name} is used for ${usedForB}.` : ""} Free FDA-verified comparison.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/compare/${params.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE}/compare/${params.slug}`,
      siteName: "CompareMyMedication",
    },
    twitter: { card: "summary", title, description },
  };
}

export default function ComparePage({ params }: Props) {
  const [slugA, slugB] = params.slug.split("-vs-");
  const A = bySlug(slugA);
  const B = bySlug(slugB);

  const sameClass = !!(A?.class && B?.class && A.class === B.class);
  const richContent = A && B
    ? (getCompareContent(params.slug) ?? getDynamicCompareContent(
        A.name, A.class, A.usedFor ?? [],
        B.name, B.class, B.usedFor ?? [],
        sameClass, A.generic === B.generic
      ))
    : null;

  const articleJsonLd = A && B ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${A.name} vs ${B.name}: Side-by-Side Comparison`,
    url: `${SITE}/compare/${params.slug}`,
    description: `Compare ${A.name} and ${B.name} side-by-side including uses, side effects, pricing, and drug class.`,
    publisher: { "@type": "Organization", name: "CompareMyMedication", url: SITE },
    about: [
      { "@type": "Drug", name: A.name, nonProprietaryName: A.generic, url: `${SITE}/drug/${A.slug}` },
      { "@type": "Drug", name: B.name, nonProprietaryName: B.generic, url: `${SITE}/drug/${B.slug}` },
    ],
  } : null;

  const faqJsonLd = richContent ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: richContent.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ComparePageClient params={params} />
    </>
  );
}
