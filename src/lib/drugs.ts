export type Drug = {
  name: string;
  slug: string;
  generic?: string;
  class?: string;
  conditions?: string[]; // what it's commonly used for (high level)
  summary?: string;      // 1-2 sentence neutral summary (no advice)
};

export const DRUGS: Drug[] = [
  {
    name: "Ozempic",
    slug: "ozempic",
    generic: "semaglutide",
    class: "GLP-1 receptor agonist",
    conditions: ["Type 2 diabetes"],
    summary: "Ozempic is a prescription medication commonly used for blood sugar management in adults with type 2 diabetes.",
  },
  {
    name: "Wegovy",
    slug: "wegovy",
    generic: "semaglutide",
    class: "GLP-1 receptor agonist",
    conditions: ["Chronic weight management"],
    summary: "Wegovy is a prescription medication used for chronic weight management in certain adults and adolescents.",
  },
  {
    name: "Adderall",
    slug: "adderall",
    generic: "amphetamine/dextroamphetamine",
    class: "stimulant",
    conditions: ["ADHD", "Narcolepsy"],
    summary: "Adderall is a stimulant medication used for ADHD and sometimes narcolepsy, depending on clinical evaluation.",
  },
  {
    name: "Vyvanse",
    slug: "vyvanse",
    generic: "lisdexamfetamine",
    class: "stimulant",
    conditions: ["ADHD", "Binge eating disorder"],
    summary: "Vyvanse is a stimulant medication used for ADHD and, in some cases, binge eating disorder in adults.",
  },
  {
    name: "Zoloft",
    slug: "zoloft",
    generic: "sertraline",
    class: "SSRI",
    conditions: ["Depression", "Anxiety-related disorders"],
    summary: "Zoloft is an SSRI antidepressant used for depression and several anxiety-related conditions.",
  },
  {
    name: "Lexapro",
    slug: "lexapro",
    generic: "escitalopram",
    class: "SSRI",
    conditions: ["Depression", "Generalized anxiety disorder"],
    summary: "Lexapro is an SSRI antidepressant used for depression and generalized anxiety disorder.",
  },
  {
    name: "Lipitor",
    slug: "lipitor",
    generic: "atorvastatin",
    class: "statin",
    conditions: ["High cholesterol"],
    summary: "Lipitor is a statin medication used to help lower high cholesterol levels.",
  },
  {
    name: "Crestor",
    slug: "crestor",
    generic: "rosuvastatin",
    class: "statin",
    conditions: ["High cholesterol"],
    summary: "Crestor is a statin medication used to help lower high cholesterol levels.",
  },
  {
    name: "Viagra",
    slug: "viagra",
    generic: "sildenafil",
    class: "PDE5 inhibitor",
    conditions: ["Erectile dysfunction"],
    summary: "Viagra is a PDE5 inhibitor medication used to treat erectile dysfunction in men.",
  },
  {
    name: "Cialis",
    slug: "cialis",
    generic: "tadalafil",
    class: "PDE5 inhibitor",
    conditions: ["Erectile dysfunction", "Benign prostatic hyperplasia"],
    summary: "Cialis is a PDE5 inhibitor medication used for erectile dysfunction and benign prostatic hyperplasia.",
  },
];

export function bySlug(slug: string): Drug | undefined {
  return DRUGS.find(d => d.slug === slug);
}

export function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function displayName(slug: string) {
  return bySlug(slug)?.name ?? titleCaseFromSlug(slug);
}

/** Find other drugs in the same class (simple "alternatives" starting point) */
export function sameClass(slug: string, limit = 8): Drug[] {
  const d = bySlug(slug);
  if (!d?.class) return [];
  return DRUGS.filter(x => x.slug !== slug && x.class === d.class).slice(0, limit);
}

/** Build a few comparison links for internal linking */
export function comparisonTargets(slug: string, limit = 6): Drug[] {
  const d = bySlug(slug);
  if (!d) return [];
  // Prioritize same class, else just other popular entries
  const same = sameClass(slug, limit);
  if (same.length >= limit) return same;
  const fill = DRUGS.filter(x => x.slug !== slug && !same.some(s => s.slug === x.slug)).slice(0, limit - same.length);
  return [...same, ...fill];
}

/**
 * Parse:
 *  - "ozempic-vs-wegovy" => { a:"ozempic", b:"wegovy" }
 *  - "ozempic-vs-wegovy/" (Next removes trailing slash)
 */
export function parseCompareSlug(slug: string): { a: string; b: string } | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const a = parts[0]?.trim();
  const b = parts[1]?.trim();
  if (!a || !b) return null;
  return { a, b };
}
