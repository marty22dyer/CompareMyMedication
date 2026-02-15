import fs from "fs/promises";

const OUT = "./data/common-meds.json";

// Common medications to search for
const COMMON_MEDS = [
  "tylenol", "acetaminophen", "advil", "ibuprofen", "aleve", "naproxen",
  "percocet", "oxycodone", "vicodin", "hydrocodone", "morphine",
  "aspirin", "motrin", "midol", "excedrin", "benadryl", "diphenhydramine",
  "claritin", "loratadine", "zyrtec", "cetirizine", "allegra", "fexofenadine",
  "pepto-bismol", "imodium", "loperamide", "prilosec", "omeprazole",
  "nexium", "esomeprazole", "zantac", "ranitidine", "tagamet", "cimetidine",
  "robitussin", "delsym", "mucinex", "sudafed", "pseudoephedrine",
  "nyquil", "dayquil", "advil cold & sinus", "tylenol cold & flu",
  "ambien", "zolpidem", "xanax", "alprazolam", "ativan", "lorazepam",
  "valium", "diazepam", "klonopin", "clonazepam", "prozac", "fluoxetine",
  "zoloft", "sertraline", "lexapro", "escitalopram", "wellbutrin", "bupropion",
  "abilify", "aripiprazole", "seroquel", "quetiapine", "risperdal", "risperidone",
  "geodon", "ziprasidone", "lamictal", "lamotrigine", "topamax", "topiramate",
  "neurontin", "gabapentin", "lyrica", "pregabalin", "cymbalta", "duloxetine",
  "effexor", "venlafaxine", "pristiq", "desvenlafaxine", "remeron", "mirtazapine",
  "trazodone", "desyrel", "buspar", "buspirone", "adderall", "amphetamine",
  "ritalin", "methylphenidate", "concerta", "vyvanse", "lisdexamfetamine",
  "focalin", "dexmethylphenidate", "strattera", "atomoxetine", "intuniv", "guanfacine",
  "kapvay", "guanfacine", "tenex", "clonidine", "catapres", "clonidine"
];

// RxNorm endpoints to search
const RXNORM_ENDPOINTS = [
  { tty: "BN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=BN" },   // Brand Names
  { tty: "IN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN" },   // Ingredients
  { tty: "SBD", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=SBD" }, // Branded Drug
  { tty: "SCD", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=SCD" }, // Clinical Drug
  { tty: "PIN", url: "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=PIN" }, // Preferred Ingredient
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isCommonMedication(name = "") {
  const n = name.toLowerCase();
  return COMMON_MEDS.some(med => n.includes(med) || med.includes(n));
}

async function fetchConcepts(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RxNorm failed: ${res.status}`);
  const data = await res.json();
  return data?.minConceptGroup?.minConcept || [];
}

async function searchDrugByName(drugName) {
  const results = [];
  
  for (const src of RXNORM_ENDPOINTS) {
    console.log(`Searching ${drugName} in ${src.tty}...`);
    const concepts = await fetchConcepts(src.url);

    for (const c of concepts) {
      const name = String(c.name || "").trim();
      if (name.toLowerCase().includes(drugName.toLowerCase()) || 
          drugName.toLowerCase().includes(name.toLowerCase())) {
        results.push({
          slug: slugify(name),
          name,
          rxcui: String(c.rxcui || "").trim(),
          rxnormTty: src.tty,
          publish: true,
          rxOnly: src.tty !== "BN", // Brand names might be OTC
          generic: "",
          class: "",
          category: "",
          usedFor: [],
          alternatives: [],
          dailymed: undefined,
          label: { indications: [], warnings: [] },
        });
      }
    }
  }

  // Remove duplicates by RXCUI
  const unique = new Map();
  for (const drug of results) {
    if (!unique.has(drug.rxcui)) {
      unique.set(drug.rxcui, drug);
    }
  }

  return Array.from(unique.values());
}

async function run() {
  console.log("Searching for common medications...");
  
  const allResults = [];
  const seenRxcui = new Set();
  const seenSlug = new Set();

  // Search for each common medication
  for (const med of COMMON_MEDS) {
    const results = await searchDrugByName(med);
    
    for (const drug of results) {
      if (!seenRxcui.has(drug.rxcui) && !seenSlug.has(drug.slug)) {
        seenRxcui.add(drug.rxcui);
        seenSlug.add(drug.slug);
        allResults.push(drug);
      }
    }
  }

  console.log(`Found ${allResults.length} common medications`);
  await fs.writeFile(OUT, JSON.stringify(allResults, null, 2));
  console.log("Common medications import complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
