import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const FILE = "./data/drugs.json";
const SLEEP_MS = 300;
const LIMIT = Number(process.env.LIMIT || "200");

// FDA Drug Databases
const FDA_SOURCES = [
  {
    name: "DailyMed SPLs",
    baseUrl: "https://dailymed.nlm.nih.gov/dailymed/services/v2",
    searchByRxcui: (rxcui) => `/spls.json?rxcui=${rxcui}&pagesize=20`,
    searchByName: (name) => `/spls.json?drug_name=${encodeURIComponent(name)}&pagesize=20`,
    fetchXml: (setid) => `/spls/${setid}.xml`
  },
  {
    name: "FDA Orange Book",
    baseUrl: "https://api.fda.gov/drug/label",
    searchByRxcui: (rxcui) => `?search=product_type:"human"+"&search=drug_listing.rxcui:${rxcui}&limit=20`,
    searchByName: (name) => `?search=product_type:"human"+"&search=openfda.product_name:${encodeURIComponent(name)}&limit=20`,
    fetchXml: (setid) => null // Orange Book uses JSON, not XML
  },
  {
    name: "OpenFDA",
    baseUrl: "https://api.fda.gov/drug/label",
    searchByRxcui: (rxcui) => `?search=openfda.rxcui:${rxcui}&limit=20`,
    searchByName: (name) => `?search=openfda.product_name:${encodeURIComponent(name)}&limit=20`,
    fetchXml: (setid) => null // OpenFDA uses JSON, not XML
  },
  {
    name: "NDC Directory",
    baseUrl: "https://api.fda.gov/drug/ndc",
    searchByRxcui: (rxcui) => `?search=openfda.rxcui:${rxcui}&limit=20`,
    searchByName: (name) => `?search=openfda.product_name:${encodeURIComponent(name)}&limit=20`,
    fetchXml: (setid) => null // NDC uses JSON, not XML
  }
];

const parser = new XMLParser({
  ignoreAttributes: false,
  processEntities: true,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cleanSPLText(s = "") {
  return String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\b2\.16\.840\.[0-9.]+\b/g, " ")
    .replace(/\bL[0-9a-f-]{8,}\b/gi, " ")
    .replace(/\b[0-9]{8}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectStrings(node, out = []) {
  if (node == null) return out;
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((x) => collectStrings(x, out));
  else if (typeof node === "object") Object.values(node).forEach((x) => collectStrings(x, out));
  return out;
}

function extractByHeading(big, heading) {
  const U = big.toUpperCase();
  const i = U.indexOf(heading);
  if (i < 0) return null;

  const slice = big.slice(i, i + 3000);
  const cleaned = cleanSPLText(slice);

  const stop = cleaned.toUpperCase().search(/\b(CONTRAINDICATIONS|ADVERSE REACTIONS|PRECAUTIONS|DOSAGE|HOW SUPPLIED|WARNINGS|PRECAUTIONS|SIDE EFFECTS|INTERACTIONS)\b/);
  return (stop > 150 ? cleaned.slice(0, stop) : cleaned).slice(0, 900);
}

function extractSectionsFromSplXml(xmlObj) {
  const raw = collectStrings(xmlObj).join(" ");
  const big = cleanSPLText(raw);

  const indications = extractByHeading(big, "INDICATIONS");
  const warnings = extractByHeading(big, "WARNINGS");
  const dosage = extractByHeading(big, "DOSAGE");
  const contraindications = extractByHeading(big, "CONTRAINDICATIONS");
  const adverseReactions = extractByHeading(big, "ADVERSE REACTIONS");
  const sideEffects = extractByHeading(big, "SIDE EFFECTS");
  const interactions = extractByHeading(big, "DRUG INTERACTIONS");

  return {
    indications: indications ? [indications] : [],
    warnings: warnings ? [warnings] : [],
    dosage: dosage ? [dosage] : [],
    contraindications: contraindications ? [contraindications] : [],
    adverseReactions: adverseReactions ? [adverseReactions] : [],
    sideEffects: sideEffects ? [sideEffects] : [],
    interactions: interactions ? [interactions] : [],
  };
}

function extractFromOpenFDA(data) {
  const results = data.results || [];
  const enriched = [];

  for (const item of results) {
    if (!item.openfda) continue;
    
    const enriched = {
      indications: [],
      warnings: [],
      dosage: [],
      contraindications: [],
      adverseReactions: [],
      sideEffects: [],
      interactions: [],
      openfdaData: {
        product_type: item.product_type,
        application_number: item.application_number,
        brand_name: item.brand_name,
        generic_name: item.generic_name,
        manufacturer: item.openfda.manufacturer_name,
        purpose: item.purpose,
        warnings: item.warnings,
        dosage_and_administration: item.dosage_and_administration,
        drug_interactions: item.drug_interactions,
        adverse_reactions: item.adverse_reactions,
        boxed_warning: item.boxed_warning,
        precautions: item.precautions,
        pregnancy_category: item.pregnancy_category,
        storage_and_handling: item.storage_and_handling,
        effective_date: item.effective_date,
        ndc: item.openfda.product_ndc
      }
    };

    // Extract indications from purpose field
    if (item.purpose) {
      const purposeText = item.purpose.toLowerCase();
      if (purposeText.includes("indicated for") || purposeText.includes("treatment of")) {
        enriched.indications = [item.purpose];
      }
    }

    // Extract warnings
    if (item.warnings) {
      enriched.warnings = Array.isArray(item.warnings) ? item.warnings : [item.warnings];
    }

    enriched.push(enriched);
  }

  return enriched;
}

function extractFromOrangeBook(data) {
  const results = data.results || [];
  const enriched = [];

  for (const item of results) {
    if (!item.openfda) continue;
    
    const enriched = {
      indications: [],
      warnings: [],
      dosage: [],
      contraindications: [],
      adverseReactions: [],
      sideEffects: [],
      interactions: [],
      orangeBookData: {
        product_type: item.product_type,
        application_number: item.application_number,
        brand_name: item.brand_name,
        generic_name: item.generic_name,
        manufacturer: item.openfda.manufacturer_name,
        purpose: item.purpose,
        warnings: item.warnings,
        dosage_and_administration: item.dosage_and_administration,
        drug_interactions: item.drug_interactions,
        adverse_reactions: item.adverse_reactions,
        boxed_warning: item.boxed_warning,
        precautions: item.precautions,
        pregnancy_category: item.pregnancy_category,
        storage_and_handling: item.storage_and_handling,
        effective_date: item.effective_date,
        ndc: item.openfda.product_ndc
      }
    };

    // Extract indications from purpose field
    if (item.purpose) {
      const purposeText = item.purpose.toLowerCase();
      if (purposeText.includes("indicated for") || purposeText.includes("treatment of")) {
        enriched.indications = [item.purpose];
      }
    }

    enriched.push(enriched);
  }

  return enriched;
}

function extractFromNDC(data) {
  const results = data.results || [];
  const enriched = [];

  for (const item of results) {
    if (!item.openfda) continue;
    
    const enriched = {
      indications: [],
      warnings: [],
      dosage: [],
      contraindications: [],
      adverseReactions: [],
      sideEffects: [],
      interactions: [],
      ndcData: {
        product_ndc: item.product_ndc,
        product_type: item.product_type,
        brand_name: item.brand_name,
        generic_name: item.generic_name,
        labeler_name: item.labeler_name,
        dosage_form: item.dosage_form,
        route: item.route,
        marketing_category: item.marketing_category,
        product_code: item.product_code,
        listing_expiration_date: item.listing_expiration_date,
        ndc_exclude_flag: item.ndc_exclude_flag,
        packaging: item.packaging,
        active_ingredients: item.active_ingredients,
        inactive_ingredients: item.inactive_ingredients
      }
    };

    enriched.push(enriched);
  }

  return enriched;
}

function looksLikeRxLabel(fullText = "") {
  const t = fullText.toLowerCase();

  const rxSignals = [
    "rx only",
    "federal law prohibits dispensing without prescription",
    "prescription only",
  ];

  const otcSignals = [
    "drug facts",
    "for external use only",
    "keep out of reach of children",
    "stop use and ask a doctor",
    "hair removal",
    "foam",
    "spray head",
    "armpits",
    "pressure vessel",
  ];

  const hasRx = rxSignals.some(s => t.includes(s));
  const hasOtc = otcSignals.some(s => t.includes(s));

  return hasRx && !hasOtc;
}

function matchesDrugName(drugName, labelTitle = "", fullText = "") {
  const name = drugName.toLowerCase();
  const title = labelTitle.toLowerCase();
  const text = fullText.toLowerCase();

  if (title.includes(name)) return true;
  if (text.includes(name)) return true;

  return false;
}

async function fetchFromSource(source, drug) {
  try {
    // Try RXCUI search first
    if (drug.rxcui) {
      const searchUrl = source.baseUrl + source.searchByRxcui(drug.rxcui);
      const res = await fetch(searchUrl);
      if (res.ok) {
        const data = await res.json();
        const setids = (data?.data || []).map((x) => x.setid).filter(Boolean);
        
        for (const setid of setids) {
          if (source.fetchXml) {
            const xml = await fetch(source.baseUrl + source.fetchXml(setid));
            if (!xml) continue;
            
            const xmlObj = parser.parse(xml);
            const rawText = collectStrings(xmlObj).join(" ");
            
            if (looksLikeRxLabel(rawText) && matchesDrugName(drug.name, "", rawText)) {
              const extracted = extractSectionsFromSplXml(xmlObj);
              return {
                ...drug,
                dailymed: { setid, source: source.name },
                label: extracted,
                enrichedFrom: source.name
              };
            }
          } else {
            // Handle JSON-based sources (OpenFDA, Orange Book, NDC)
            const enriched = source.name === "DailyMed SPLs" ? null :
                           source.name === "OpenFDA" ? extractFromOpenFDA(data) :
                           source.name === "Orange Book" ? extractFromOrangeBook(data) :
                           source.name === "NDC Directory" ? extractFromNDC(data) : [];
            
            if (enriched.length > 0) {
              return {
                ...drug,
                dailymed: { setid: "json-api", source: source.name },
                label: enriched[0] || { indications: [], warnings: [] },
                enrichedFrom: source.name
              };
            }
          }
        }
      }
    }

    // Fallback to name search
    const searchUrl = source.baseUrl + source.searchByName(drug.name);
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    const setids = (data?.data || []).map((x) => x.setid).filter(Boolean);
    
    for (const setid of setids) {
      if (source.fetchXml) {
        const xml = await fetch(source.baseUrl + source.fetchXml(setid));
        if (!xml) continue;
        
        const xmlObj = parser.parse(xml);
        const rawText = collectStrings(xmlObj).join(" ");
        
        if (looksLikeRxLabel(rawText) && matchesDrugName(drug.name, "", rawText)) {
          const extracted = extractSectionsFromSplXml(xmlObj);
          return {
            ...drug,
            dailymed: { setid, source: source.name },
            label: extracted,
            enrichedFrom: source.name
          };
        }
      } else {
        // Handle JSON-based sources
        const enriched = source.name === "DailyMed SPLs" ? null :
                       source.name === "OpenFDA" ? extractFromOpenFDA(data) :
                       source.name === "Orange Book" ? extractFromOrangeBook(data) :
                       source.name === "NDC Directory" ? extractFromNDC(data) : [];
        
        if (enriched.length > 0) {
          return {
            ...drug,
            dailymed: { setid: "json-api", source: source.name },
            label: enriched[0] || { indications: [], warnings: [] },
            enrichedFrom: source.name
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
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

    // Skip if already enriched
    if (d.label?.indications?.length || d.label?.warnings?.length) {
      processed++;
      continue;
    }

    console.log(`\n[${processed + 1}/${Math.min(LIMIT, publishableDrugs.length)}] Processing ${d.name} (${d.rxnormTty}) (RXCUI: ${d.rxcui}) ===`);

    try {
      let enriched = null;

      // Try each FDA source
      for (const source of FDA_SOURCES) {
        enriched = await fetchFromSource(source, d);
        if (enriched) {
          console.log(`  ✓ Found ${source.name} label for ${d.name}`);
          break;
        }
      }

      if (enriched) {
        // Merge enriched data back to original drug
        Object.assign(d, enriched);
        ok++;
      } else {
        console.log(`  ↳ No FDA label found for ${d.name} after trying all sources`);
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
  console.log(`\nSources used: ${FDA_SOURCES.map(s => s.name).join(", ")}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
