import fs from "fs/promises";

const FILE = "./data/drugs.json";
const SLEEP_MS = 400;
const LIMIT = Number(process.env.LIMIT || "150");

// DrugBank API (requires API key, but we'll use public endpoints)
const DRUGBANK_BASE = "https://api.drugbank.com/v1";

// FDA Drug Interactions API
const FDA_INTERACTIONS_BASE = "https://api.fda.gov/drug/label";

// Drugs.com API (public)
const DRUGS_COM_BASE = "https://api.drugs.com/v1";

// MedlinePlus API (public)
const MEDLINEPLUS_BASE = "https://medlineplus.gov/api";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchDrugBankInteractions(drug) {
  try {
    // Search DrugBank by drug name
    const searchUrl = `${DRUGBANK_BASE}/drugs?name=${encodeURIComponent(drug.name)}&limit=1`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.drugs || data.drugs.length === 0) return null;
    
    const drugInfo = data.drugs[0];
    
    return {
      drugbankData: {
        drug_id: drugInfo.id,
        drug_name: drugInfo.name,
        description: drugInfo.description,
        state: drugInfo.state,
        groups: drugInfo.groups,
        synonyms: drugInfo.synonyms,
        products: drugInfo.products,
        drug_interactions: drugInfo.drug_interactions,
        food_interactions: drugInfo.food_interactions,
        experimental_properties: drugInfo.experimental_properties,
        approved: drugInfo.approved,
        withdrawn: drugInfo.withdrawn,
        international_brands: drugInfo.international_brands,
        mixtures: drugInfo.mixtures,
        packagers: drugInfo.packagers,
        manufacturers: drugInfo.manufacturers,
        prices: drugInfo.prices,
        categories: drugInfo.categories,
        dosages: drugInfo.dosages,
        atc_codes: drugInfo.atc_codes,
        ahfs_codes: drugInfo.ahfs_codes,
        pharmacology: drugInfo.pharmacology,
        mechanism_of_action: drugInfo.mechanism_of_action,
        toxicity: drugInfo.toxicity,
        metabolism: drugInfo.metabolism,
        absorption: drugInfo.absorption,
        half_life: drugInfo.half_life,
        route_of_elimination: drugInfo.route_of_elimination,
        volume_of_distribution: drugInfo.volume_of_distribution,
        clearance: drugInfo.clearance,
        protein_binding: drugInfo.protein_binding,
        drug_interactions: drugInfo.drug_interactions,
        food_interactions: drugInfo.food_interactions,
        external_links: drugInfo.external_links,
        synonyms: drugInfo.synonyms,
        international_brands: drugInfo.international_brands,
        mixtures: drugInfo.mixtures,
        packagers: drugInfo.packagers,
        manufacturers: drugInfo.manufacturers,
        prices: drugInfo.prices,
        categories: drugInfo.categories,
        dosages: drugInfo.dosages,
        atc_codes: drugInfo.atc_codes,
        ahfs_codes: drugInfo.ahfs_codes,
        pharmacology: drugInfo.pharmacology,
        mechanism_of_action: drugInfo.mechanism_of_action,
        toxicity: drugInfo.toxicity,
        metabolism: drugInfo.metabolism,
        absorption: drugInfo.absorption,
        half_life: drugInfo.half_life,
        route_of_elimination: drugInfo.route_of_elimination,
        volume_of_distribution: drugInfo.volume_of_distribution,
        clearance: drugInfo.clearance,
        protein_binding: drugInfo.protein_binding,
        drug_interactions: drugInfo.drug_interactions,
        food_interactions: drugInfo.food_interactions,
        external_links: drugInfo.external_links
      }
    };
  } catch (error) {
    console.error(`DrugBank error for ${drug.name}:`, error);
    return null;
  }
}

async function fetchFDAInteractions(drug) {
  try {
    // Search FDA by drug name
    const searchUrl = `${FDA_INTERACTIONS_BASE}?search=openfda.product_name:${encodeURIComponent(drug.name)}&limit=20`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    
    const interactions = [];
    
    for (const item of data.results) {
      if (item.drug_interactions) {
        interactions.push(...(Array.isArray(item.drug_interactions) ? item.drug_interactions : [item.drug_interactions]));
      }
    }
    
    return {
      fdaInteractionsData: {
        drug_name: drug.name,
        interactions: interactions,
        total_interactions: interactions.length,
        source: "FDA Drug Label Database"
      }
    };
  } catch (error) {
    console.error(`FDA interactions error for ${drug.name}:`, error);
    return null;
  }
}

async function fetchDrugsComInteractions(drug) {
  try {
    // Search Drugs.com by drug name
    const searchUrl = `${DRUGS_COM_BASE}/interactions?drug=${encodeURIComponent(drug.name)}&limit=20`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.interactions || data.interactions.length === 0) return null;
    
    return {
      drugsComData: {
        drug_name: drug.name,
        interactions: data.interactions,
        total_interactions: data.interactions.length,
        severity_levels: data.severity_levels,
        source: "Drugs.com"
      }
    };
  } catch (error) {
    console.error(`Drugs.com error for ${drug.name}:`, error);
    return null;
  }
}

async function fetchMedlinePlusData(drug) {
  try {
    // Search MedlinePlus by drug name
    const searchUrl = `${MEDLINEPLUS_BASE}/search?query=${encodeURIComponent(drug.name)}&format=json&limit=1`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.search || data.search.results.length === 0) return null;
    
    const result = data.search.results[0];
    
    return {
      medlinePlusData: {
        drug_name: drug.name,
        title: result.title,
        summary: result.summary,
        url: result.url,
        source: "MedlinePlus",
        topics: result.topics,
        related_topics: result.related_topics
      }
    };
  } catch (error) {
    console.error(`MedlinePlus error for ${drug.name}:`, error);
    return null;
  }
}

async function run() {
  const raw = await fs.readFile(FILE, "utf-8");
  const drugs = JSON.parse(raw);

  const publishableDrugs = drugs.filter(d => d.publish === true);
  console.log(`Found ${publishableDrugs.length} publishable drugs out of ${drugs.length} total`);

  let ok = 0;
  let fail = 0;
  let processed = 0;

  for (let i = 0; i < Math.min(publishableDrugs.length, LIMIT); i++) {
    const d = publishableDrugs[i];

    // Skip if already enriched with interaction data
    if (d.drugbankData || d.fdaInteractionsData || d.drugsComData || d.medlinePlusData) {
      processed++;
      continue;
    }

    console.log(`\n[${processed + 1}/${Math.min(LIMIT, publishableDrugs.length)}] Processing ${d.name} (${d.rxnormTty}) (RXCUI: ${d.rxcui}) ===`);

    try {
      let enriched = false;

      // Try each interaction source
      const drugbank = await fetchDrugBankInteractions(d);
      if (drugbank) {
        Object.assign(d, drugbank);
        enriched = true;
        console.log("  ✓ Found DrugBank interaction data");
      }

      if (!enriched) {
        const fda = await fetchFDAInteractions(d);
        if (fda) {
          Object.assign(d, fda);
          enriched = true;
          console.log("  ✓ Found FDA interaction data");
        }
      }

      if (!enriched) {
        const drugscom = await fetchDrugsComInteractions(d);
        if (drugscom) {
          Object.assign(d, drugscom);
          enriched = true;
          console.log("  ✓ Found Drugs.com interaction data");
        }
      }

      if (!enriched) {
        const medlineplus = await fetchMedlinePlusData(d);
        if (medlineplus) {
          Object.assign(d, medlineplus);
          enriched = true;
          console.log("  ✓ Found MedlinePlus data");
        }
      }

      if (enriched) {
        ok++;
      } else {
        console.log(`  ↳ No interaction data found for ${d.name} after trying all sources`);
        fail++;
      }

    } catch (e) {
      console.log(`  ↳ skipped (error):`, e.message);
      fail++;
    }

    processed++;
    await sleep(SLEEP_MS);

    // Save progress every 25 drugs
    if (processed % 25 === 0) {
      await fs.writeFile(FILE, JSON.stringify(drugs, null, 2));
      console.log("  ↳ checkpoint saved");
    }
  }

  await fs.writeFile(FILE, JSON.stringify(drugs, null, 2));
  console.log(`\nDone. Enriched: ${ok}, failed: ${fail}, processed: ${processed}`);
  console.log(`\nInteraction sources used: DrugBank, FDA, Drugs.com, MedlinePlus`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
