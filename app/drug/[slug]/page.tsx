import type { Metadata } from "next";
import { bySlug, displayName, drugs } from "../../../lib/drugs";
import DrugPageClient from "./DrugPageClient";

const SITE = "https://comparemymedication.com";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const drug = bySlug(params.slug);
  if (!drug) return { title: "Drug Not Found", robots: { index: false, follow: true } };

  const name = drug.name ?? displayName(params.slug);
  const generic = drug.generic ? ` (${drug.generic})` : "";
  const usedFor = drug.usedFor?.slice(0, 2).join(", ") ?? "";
  const drugClass = drug.class ?? "";

  const title = `${name}${generic}: Uses, Side Effects & Price Comparison`;
  const description = `Compare ${name} prices, side effects, dosing, and alternatives.${usedFor ? ` Used for: ${usedFor}.` : ""}${drugClass ? ` Drug class: ${drugClass}.` : ""} FDA-verified data. Free, no sign-up required.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/drug/${params.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE}/drug/${params.slug}`,
      siteName: "CompareMyMedication",
    },
    twitter: { card: "summary", title, description },
  };
}

export default function DrugPage({ params }: Props) {
  const drug = bySlug(params.slug);
  const name = drug?.name ?? params.slug;

  const jsonLd = drug ? {
    "@context": "https://schema.org",
    "@type": "Drug",
    name,
    nonProprietaryName: drug.generic ?? undefined,
    drugClass: drug.class ?? undefined,
    url: `${SITE}/drug/${params.slug}`,
    description: drug.usedFor?.length
      ? `${name} is used for: ${drug.usedFor.join(", ")}.`
      : undefined,
    prescriptionStatus: drug.rxOnly ? "PrescriptionOnly" : "OTC",
    manufacturer: drug.ndcData?.labeler_name
      ? { "@type": "Organization", name: drug.ndcData.labeler_name }
      : undefined,
    relatedDrug: drug.alternatives?.slice(0, 5).map((s) => ({
      "@type": "Drug",
      name: bySlug(s)?.name ?? s,
      url: `${SITE}/drug/${s}`,
    })),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <DrugPageClient params={params} />
    </>
  );
}
