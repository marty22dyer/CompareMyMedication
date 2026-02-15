import fs from "fs/promises";

const OUT = "./data/drugs.json";

const URLS = [
  { tty: "IN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN" },
  { tty: "BN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=BN" },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function looksLikeNonMedicationName(name = "") {
  const n = name.toLowerCase();

  // punctuation-heavy / greek / chemistry vibes
  if (/[αβγδ]/i.test(name)) return true;
  if (n.includes(".alpha") || n.includes(".beta")) return true;
  if ((name.match(/[.'(),]/g) || []).length >= 3) return true;

  // common excipient/cosmetic signals
  const excipientSignals = [
    "fragrance",
    "flavor",
    "color",
    "dye",
    "extract",
    "allergenic",
    "sodium lauryl",
    "polyethylene glycol",
    "glycerin",
    "diglycerin",
    "propylene glycol",
  ];
  if (excipientSignals.some(s => n.includes(s))) return true;

  return false;
}

function isLikelyMedicationName(name="") {
  if (name.length > 25) return false;
  if (/[\[\]().,']/g.test(name)) return false;
  if (/\b(extract|allergenic)\b/i.test(name)) return false;
  return true;
}

function isGarbageName(name) {
  // Kill long chemistry strings + weird punctuation-heavy items
  if (name.length > 40) return true;
  if ((name.match(/[()]/g) || []).length >= 2) return true;
  if ((name.match(/-/g) || []).length >= 4) return true;
  if (/\bextract\b/i.test(name)) return true;
  if (/\ballergenic\b/i.test(name)) return true;
  return false;
}

async function fetchConcepts(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RxNorm failed: ${res.status}`);
  const data = await res.json();
  return data?.minConceptGroup?.minConcept || [];
}

async function run() {
  const seenRxcui = new Set();
  const seenSlug = new Set();
  const drugs = [];

  for (const src of URLS) {
    console.log(`Fetching RxNorm ${src.tty}...`);
    const concepts = await fetchConcepts(src.url);

    for (const c of concepts) {
      const rxcui = String(c.rxcui || "").trim();
      const name = String(c.name || "").trim();
      if (!rxcui || !name) continue;
      if (isGarbageName(name)) continue;
      if (looksLikeNonMedicationName(name)) continue;
      if (!isLikelyMedicationName(name)) continue;

      const slug = slugify(name);
      if (!slug) continue;
      if (seenRxcui.has(rxcui) || seenSlug.has(slug)) continue;

      seenRxcui.add(rxcui);
      seenSlug.add(slug);

      drugs.push({
        slug,
        name,
        rxcui,
        rxnormTty: src.tty,
        generic: "",
        class: "",
        category: "",
        usedFor: [],
        alternatives: [],
        dailymed: undefined,
        label: { indications: [], warnings: [] },
      });

      // start safe, scale later
      if (drugs.length >= 2000) break;
    }
  }

  console.log(`Saving ${drugs.length} medications...`);
  await fs.writeFile(OUT, JSON.stringify(drugs, null, 2));
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
