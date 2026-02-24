import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

const SITE = "https://comparemymedication.com";

export const metadata: Metadata = {
  title: "Compare Prescription Drug Prices & Find Cheaper Alternatives | CompareMyMedication",
  description:
    "Compare 238+ prescription medications side-by-side. Find cheaper generic alternatives, check real pharmacy prices, review side effects — all backed by FDA data. Free, no sign-up required.",
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    title: "Compare Prescription Drug Prices & Find Cheaper Alternatives",
    description:
      "Compare 238+ medications side-by-side. Find cheaper alternatives, check real prices — backed by FDA data. Free.",
    url: SITE,
    siteName: "CompareMyMedication",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Prescription Drug Prices & Find Cheaper Alternatives",
    description: "Compare 238+ medications side-by-side. Find cheaper alternatives backed by FDA data.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CompareMyMedication",
  url: SITE,
  description:
    "Compare prescription drug prices, find cheaper alternatives, and review side effects — all backed by FDA data.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/drug/{search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CompareMyMedication",
  url: SITE,
  logo: `${SITE}/CompareMyMedication_logo.png`,
  sameAs: [],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
