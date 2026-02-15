import fs from "fs/promises";

const FILE = "./data/drugs.json";
const SLEEP_MS = 500;
const LIMIT = Number(process.env.LIMIT || "100");

// GoodRx API (public, no API key needed for basic data)
const GOODRX_BASE = "https://api.goodrx.com/gg/v1/drug-info.json";

// Medicare Part D pricing data
const MEDICARE_BASE = "https://data.cms.gov/resource/medicare-part-d-pricing-data/2023/medicare-part-d-pricing-data.json";

// Iodine.com API (requires API key, but we'll use public endpoints)
const IODINE_BASE = "https://api.iodine.com/api/v1";

// RxPrice API (requires API key, but we'll use public endpoints)
const RXPRICE_BASE = "https://api.rxprice.com/api/v1";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchGoodRxData(drug) {
  try {
    // Search GoodRx by drug name
    const searchUrl = `${GOODRX_BASE}?drug_name=${encodeURIComponent(drug.name)}&limit=1`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.data || data.data.length === 0) return null;
    
    const drugInfo = data.data[0];
    
    return {
      goodrxData: {
        drug_name: drugInfo.drug_name,
        generic_name: drugInfo.generic_name,
        brand_name: drugInfo.brand_name,
        drug_class: drugInfo.drug_class,
        manufacturer: drugInfo.manufacturer_name,
        form: drugInfo.form,
        dosage_strength: drugInfo.dosage_strength,
        route: drugInfo.route,
        image_url: drugInfo.image_url,
        quantity: drugInfo.quantity,
        unit: drugInfo.unit,
        display_name: drugInfo.display_name,
        has_coupons: drugInfo.has_coupons,
        current_price: drugInfo.current_price,
        price_history: drugInfo.price_history,
        dosage_form: drugInfo.dosage_form,
        related_drugs: drugInfo.related_drugs,
        alternatives: drugInfo.alternatives,
        reviews: drugInfo.reviews,
        ratings: drugInfo.ratings
      }
    };
  } catch (error) {
    console.error(`GoodRx error for ${drug.name}:`, error);
    return null;
  }
}

async function fetchIodineData(drug) {
  try {
    // Search Iodine by drug name
    const searchUrl = `${IODINE_BASE}/drugs?name=${encodeURIComponent(drug.name)}&limit=1`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.data || data.data.length === 0) return null;
    
    const drugInfo = data.data[0];
    
    return {
      iodineData: {
        drug_name: drugInfo.name,
        generic_name: drugInfo.generic_name,
        brand_name: drugInfo.brand_name,
        drug_class: drugInfo.drug_class,
        description: drugInfo.description,
        fda_label: drugInfo.fda_label,
        indications: drugInfo.indications,
        contraindications: drug.contraindications,
        side_effects: drugInfo.side_effects,
        interactions: drugInfo.interactions,
        pregnancy_category: drugInfo.pregnancy_category,
        controlled_substance: drugInfo.controlled_substance,
        alcohol_interactions: drugInfo.alcohol_interactions,
        food_interactions: drugInfo.food_interactions,
        other_interactions: drugInfo.other_interactions,
        dosage_forms: drugInfo.dosage_forms,
        strengths: drugInfo.strengths,
        route: drugInfo.route,
        images: drugInfo.images,
        reviews: drugInfo.reviews,
        ratings: drugInfo.ratings
      }
    };
  } catch (error) {
    console.error(`Iodine error for ${drug.name}:`, error);
    return null;
  }
}

async function fetchRxPriceData(drug) {
  try {
    // Search RxPrice by drug name
    const searchUrl = `${RXPRICE_BASE}/search?query=${encodeURIComponent(drug.name)}&limit=1`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.drugs || data.drugs.length === 0) return null;
    
    const drugInfo = data.drugs[0];
    
    return {
      rxpriceData: {
        drug_name: drugInfo.brand_name,
        generic_name: drugInfo.generic_name,
        ndc: drugInfo.ndc,
        quantity: drugInfo.quantity,
        unit: drugInfo.unit,
        price: drugInfo.price,
        pharmacy: drugInfo.pharmacy,
        dosage: drugInfo.dosage,
        form: drugInfo.form,
        manufacturer: drugInfo.manufacturer,
        image_url: drugInfo.image_url,
        created_at: drugInfo.created_at,
        updated_at: drugInfo.updated_at
      }
    };
  } catch (error) {
    console.error(`RxPrice error for ${drug.name}:`, error);
    return null;
  }
}

async function fetchMedicareData(drug) {
  try {
    // Search Medicare Part D by drug name
    const searchUrl = `https://data.cms.gov/resource/medicare-part-d-pricing-data/2023/medicare-part-d-pricing-data.json`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    const drugs = data.drugs || [];
    
    // Find matching drugs by name
    const matches = drugs.filter(d => 
      d.brand_name.toLowerCase().includes(drug.name.toLowerCase()) ||
      d.generic_name.toLowerCase().includes(drug.name.toLowerCase()) ||
      drug.name.toLowerCase().includes(d.brand_name.toLowerCase()) ||
      drug.name.toLowerCase().includes(d.generic_name.toLowerCase())
    );
    
    if (matches.length > 0) {
      const bestMatch = matches[0]; // Take first match
      return {
        medicareData: {
          brand_name: bestMatch.brand_name,
          generic_name: bestMatch.generic_name,
          ndc: bestMatch.ndc,
          quantity: bestMatch.quantity,
          unit: bestMatch.unit,
          price: bestMatch.price,
          pharmacy: bestMatch.pharmacy,
          dosage: bestMatch.dosage,
          form: bestMatch.form,
          manufacturer: bestMatch.manufacturer,
          effective_date: bestMatch.effective_date,
          expiration_date: bestMatch.expiration_date,
          marketing_status: bestMatch.marketing_status
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Medicare error for ${drug.name}:`, error);
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

    // Skip if already enriched with pricing data
    if (d.goodrxData || d.iodineData || d.rxpriceData || d.medicareData) {
      processed++;
      continue;
    }

    console.log(`\n[${processed + 1}/${Math.min(LIMIT, publishableDrugs.length)}] Processing ${d.name} (${d.rxnormTty}) (RXCUI: ${d.rxcui}) ===`);

    try {
      let enriched = false;

      // Try each pricing source
      const goodrx = await fetchGoodRxData(d);
      if (goodrx) {
        Object.assign(d, goodrx);
        enriched = true;
        console.log("  ✓ Found GoodRx pricing data");
      }

      if (!enriched) {
        const iodine = await fetchIodineData(d);
        if (iodine) {
          Object.assign(d, iodine);
          enriched = true;
          console.log("  ✓ Found Iodine data");
        }
      }

      if (!enriched) {
        const rxprice = await fetchRxPriceData(d);
        if (rxprice) {
          Object.assign(d, rxprice);
          enriched = true;
          console.log("  ✓ Found RxPrice data");
        }
      }

      if (!enriched) {
        const medicare = await fetchMedicareData(d);
        if (medicare) {
          Object.assign(d, medicare);
          enriched = true;
          console.log("  ✓ Found Medicare pricing data");
        }
      }

      if (enriched) {
        ok++;
      } else {
        console.log(`  ↳ No pricing data found for ${d.name} after trying all sources`);
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
  console.log(`\nPricing sources used: GoodRx, Iodine, RxPrice, Medicare Part D`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
