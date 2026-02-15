import fs from "fs/promises";

const OUT = "./data/comprehensive-drugs.json";

// Multiple RxNorm endpoints for comprehensive coverage
const RXNORM_ENDPOINTS = [
  { tty: "IN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN" },  // Ingredients
  { tty: "PIN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=PIN" }, // Preferred Ingredients  
  { tty: "BN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=BN" },   // Brand Names
  { tty: "SBD", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=SBD" }, // Branded Drug
  { tty: "SCD", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=SCD" }, // Clinical Drug
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isHighValueDrug(name = "", tty = "") {
  // Prioritize certain concept types
  const priorityTypes = ["BN", "PIN", "IN"];
  if (!priorityTypes.includes(tty)) return false;

  // Filter out obvious non-drugs
  const n = name.toLowerCase();
  if (n.includes("extract") && n.includes("allergenic")) return false;
  if (n.includes("fragrance") || n.includes("flavor")) return false;
  if (n.includes("dye") || n.includes("color")) return false;

  // Keep reasonable length
  if (name.length > 50) return false;

  // Must have letters only (with basic punctuation)
  if (!/^[a-zA-Z\s\-\(\)\[\]]+$/.test(name)) return false;

  return true;
}

async function fetchConcepts(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RxNorm failed: ${res.status}`);
  const data = await res.json();
  return data?.minConceptGroup?.minConcept || [];
}

async function enhanceWithDrugBank(drug) {
  // Future: Add DrugBank API calls for additional data
  // For now, add basic enhancement logic
  return {
    ...drug,
    drugbankId: null,
    fdaApprovalDate: null,
    pregnancyCategory: null,
    controlledSubstance: false,
  };
}

async function run() {
  console.log("Starting comprehensive drug import...");
  
  const seenRxcui = new Set();
  const seenSlug = new Set();
  const drugs = [];

  // Import from multiple RxNorm endpoints
  for (const src of RXNORM_ENDPOINTS) {
    console.log(`Fetching RxNorm ${src.tty}...`);
    const concepts = await fetchConcepts(src.url);

    for (const c of concepts) {
      const rxcui = String(c.rxcui || "").trim();
      const name = String(c.name || "").trim();
      if (!rxcui || !name) continue;
      
      if (!isHighValueDrug(name, src.tty)) continue;

      const slug = slugify(name);
      if (!slug) continue;
      if (seenRxcui.has(rxcui) || seenSlug.has(slug)) continue;

      seenRxcui.add(rxcui);
      seenSlug.add(slug);

      const drug = {
        slug,
        name,
        rxcui,
        rxnormTty: src.tty,
        publish: true,
        rxOnly: src.tty !== "BN", // Brand names may be OTC
        generic: "",
        class: "",
        category: "",
        usedFor: [],
        alternatives: [],
        dailymed: undefined,
        label: { indications: [], warnings: [] },
      };

      // Enhance with additional data
      const enhanced = await enhanceWithDrugBank(drug);
      drugs.push(enhanced);

      if (drugs.length >= 5000) break; // Scale to 5000 drugs
    }

    if (drugs.length >= 5000) break;
  }

  console.log(`Saving ${drugs.length} comprehensive drugs...`);
  await fs.writeFile(OUT, JSON.stringify(drugs, null, 2));
  console.log("Comprehensive import complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
