import fs from "fs/promises";

const OUT = "./data/drugs.json";

// Prefer IN (ingredients) for clean drug names
const RXNORM_IN_URL = "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function run() {
  console.log("Fetching RxNorm PSN concepts...");

  const res = await fetch(RXNORM_IN_URL);
  if (!res.ok) {
    throw new Error(`RxNorm fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // RxNorm returns: { minConceptGroup: { minConcept: [...] } }
  const concepts = data?.minConceptGroup?.minConcept || [];

  // Clean + dedupe by rxcui (best) and slug (backup)
  const seenRxcui = new Set();
  const seenSlug = new Set();

  const cleaned = [];
  for (const c of concepts) {
    const rxcui = String(c.rxcui || "").trim();
    const name = String(c.name || "").trim();
    if (!rxcui || !name) continue;

    const slug = slugify(name);
    if (!slug) continue;

    if (seenRxcui.has(rxcui)) continue;
    if (seenSlug.has(slug)) continue;

    seenRxcui.add(rxcui);
    seenSlug.add(slug);

    cleaned.push({
      slug,
      name,
      generic: "",     // fill later via enrichment/mapping
      class: "",       // fill later
      usedFor: [],     // fill later (DailyMed)
      alternatives: [],// fill later (class/category logic)
      rxcui,           // ✅ critical for DailyMed
      label: { indications: [], warnings: [] }, // will be enriched
    });

    // start safe; increase to 2000/5000 once stable
    if (cleaned.length >= 1200) break;
  }

  console.log(`Saving ${cleaned.length} PSN drugs to ${OUT}...`);
  await fs.writeFile(OUT, JSON.stringify(cleaned, null, 2));
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
