import { redirect } from "next/navigation";
import { getPopularDrugs, comparisonTargets, bySlug } from "../../lib/drugs-optimized";
import SearchBox from "../../components/SearchBox";

export const runtime = 'edge';

function toSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const featured = [
  ["ozempic", "wegovy"],
  ["adderall", "vyvanse"],
  ["zoloft", "lexapro"],
  ["lipitor", "crestor"],
  ["viagra", "cialis"],
];

export default function CompareIndex({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q || "").trim().toLowerCase();

  // If user typed "wegovy and ozempic" or "wegovy vs ozempic"
  const parts = q
    .split(/\b(vs|versus|and)\b/i)
    .map(s => s.trim())
    .filter(Boolean);

  if (parts.length === 2) {
    const a = toSlug(parts[0]);
    const b = toSlug(parts[1]);

    // Optional: validate they exist in your dataset
    const aExists = bySlug(a) !== undefined;
    const bExists = bySlug(b) !== undefined;

    if (aExists && bExists) {
      const canon = [a, b].sort().join("-vs-");
      redirect(`/compare/${canon}`);
    }
  }

  return (
    <>
      <main className="pageCard">
        <h1>Drug Comparisons</h1>
        <p>Browse popular head-to-head comparisons.</p>
        <p>Try "ozempic vs wegovy" or "metformin and jardiance".</p>
        
        <SearchBox />

        <h2>Popular</h2>
        <ul>
          {featured.map(([a, b]) => (
            <li key={`${a}-vs-${b}`}>
              <a href={`/compare/${a}-vs-${b}`}>{a} vs {b}</a>
            </li>
          ))}
        </ul>

        <h2>Popular Drugs</h2>
        <ul>
          {getPopularDrugs(50).map((d: any) => (
            <li key={d.slug}>
              <a href={`/drug/${d.slug}`}>{d.name}</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
