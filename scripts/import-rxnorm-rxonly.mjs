import fs from "fs/promises";

const OUT = "./data/drugs.json";

// Ingredients (clean) from RxNorm - better than random chemicals
const RX_IN_URL = "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Aggressive filter to avoid chemistry / excipient junk
function isBadName(name = "") {
  const n = name.toLowerCase();

  // punctuation/chemistry signals
  if (name.length > 28) return true;
  if (/[αβγδ]/i.test(name)) return true;
  if ((name.match(/[().,'"]/g) || []).length >= 2) return true;

  // obvious non-Rx / cosmetic / ingredient style
  const badTokens = [
    "extract", "allergenic", "fragrance", "flavor", "dye",
    "diglycerin", "glycerin", "propylene glycol", "polyethylene glycol",
  ];
  if (badTokens.some(t => n.includes(t))) return true;

  return false;
}

async function run() {
  console.log("Fetching RxNorm Prescribe PSN concepts...");

  const res = await fetch(RX_IN_URL);
  if (!res.ok) throw new Error(`RxNorm failed: ${res.status} ${res.statusText}`);

  const data = await res.json();
  const concepts = data?.minConceptGroup?.minConcept || [];

  const seenRxcui = new Set();
  const seenSlug = new Set();

  const drugs = [];
  for (const c of concepts) {
    const rxcui = String(c.rxcui || "").trim();
    const name = String(c.name || "").trim();
    if (!rxcui || !name) continue;
    if (isBadName(name)) continue;

    const slug = slugify(name);
    if (!slug) continue;

    if (seenRxcui.has(rxcui) || seenSlug.has(slug)) continue;
    seenRxcui.add(rxcui);
    seenSlug.add(slug);

    drugs.push({
      slug,
      name,
      rxcui,
      rxOnly: true,               // ✅ your rule
      generic: "",
      class: "",
      category: "",
      usedFor: [],
      alternatives: [],
      dailymed: undefined,
      label: { indications: [], warnings: [] },
    });

    if (drugs.length >= 1500) break; // start safe
  }

  await fs.writeFile(OUT, JSON.stringify(drugs, null, 2));
  console.log(`Saved ${drugs.length} Rx-only PSN drugs to ${OUT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
