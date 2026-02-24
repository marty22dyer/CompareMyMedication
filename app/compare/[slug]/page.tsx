import type { Metadata } from "next";
import { bySlug } from "../../../lib/drugs";
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

  const jsonLd = A && B ? {
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

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ComparePageClient params={params} />
    </>
  );
}
