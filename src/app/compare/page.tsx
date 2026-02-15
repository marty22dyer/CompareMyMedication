import { DRUGS } from "@/lib/drugs";

const featured = [
  ["ozempic", "wegovy"],
  ["adderall", "vyvanse"],
  ["zoloft", "lexapro"],
  ["lipitor", "crestor"],
  ["viagra", "cialis"],
];

export default function CompareIndex() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Drug Comparisons</h1>
      <p>Browse popular head-to-head comparisons.</p>

      <h2>Popular</h2>
      <ul>
        {featured.map(([a, b]) => (
          <li key={`${a}-vs-${b}`}>
            <a href={`/compare/${a}-vs-${b}`}>{a} vs {b}</a>
          </li>
        ))}
      </ul>

      <h2>All drugs</h2>
      <ul>
        {DRUGS.map(d => (
          <li key={d.slug}>
            <a href={`/drug/${d.slug}`}>{d.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
