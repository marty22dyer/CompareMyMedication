import { drugs } from "./drugs";

export function allCompareSlugs(): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const drug of drugs) {
    const drugClass = (drug.class || "").trim();
    const drugCategory = (drug.category || "").trim();
    const alts = Array.isArray(drug.alternatives) ? drug.alternatives : [];

    const targets = drugs.filter((d) => {
      if (d.slug === drug.slug) return false;

      const dClass = (d.class || "").trim();
      const dCategory = (d.category || "").trim();

      const sameClass = drugClass && dClass && dClass === drugClass;
      const sameCategory = drugCategory && dCategory && dCategory === drugCategory;
      const isAlt = alts.includes(d.slug);

      return sameClass || sameCategory || isAlt;
    });

    for (const target of targets) {
      const canon = [drug.slug, target.slug].sort().join("-vs-");
      if (seen.has(canon)) continue;
      seen.add(canon);
      slugs.push(canon);
    }
  }

  return slugs.sort();
}
