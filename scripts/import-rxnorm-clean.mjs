import fs from "fs/promises";

const OUT = "./data/drugs.json";

// Use clean RxNorm concepts - IN (ingredients), PIN (preferred ingredient), BN (brand names)
const URLS = [
  { tty: "IN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN" },
  { tty: "PIN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=PIN" },
  { tty: "BN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=BN" },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublishableDrug(name = "", tty = "") {
  // Only accept clean concept types
  if (!["IN", "PIN", "BN"].includes(tty)) return false;

  // Remove chemical/formulation junk
  if (name.includes(",")) return false; // no commas (complex formulations)
  if (name.includes("MG") || name.includes("ML")) return false; // no dosage units
  if (name.length > 25) return false; // reasonable length limit
  
  // Only letters, spaces, hyphens
  if (!/^[a-zA-Z\s\-]+$/.test(name)) return false;

  return true;
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
      
      if (!isPublishableDrug(name, src.tty)) continue;

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
        publish: true,
        rxOnly: true,
        generic: "",
        class: "",
        category: "",
        usedFor: [],
        alternatives: [],
        dailymed: undefined,
        label: { indications: [], warnings: [] },
      });

      // Start safe - clean, publishable drugs only
      if (drugs.length >= 500) break;
    }
  }

  console.log(`Saving ${drugs.length} publishable drugs...`);
  await fs.writeFile(OUT, JSON.stringify(drugs, null, 2));
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
