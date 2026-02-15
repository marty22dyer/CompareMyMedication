import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const FILE = "./data/common-meds.json";
const SLEEP_MS = 400;
const LIMIT = Number(process.env.LIMIT || "100");

// Focus on high-value medications that users actually search for
const HIGH_VALUE_MEDS = [
  "tylenol", "acetaminophen", "advil", "ibuprofen", "aleve", "naproxen", "aspirin",
  "percocet", "oxycodone", "vicodin", "hydrocodone", "morphine", "tramadol",
  "benadryl", "diphenhydramine", "claritin", "loratadine", "zyrtec", "cetirizine", "allegra", "fexofenadine",
  "prilosec", "omeprazole", "nexium", "esomeprazole", "zantac", "ranitidine", "tagamet", "cimetidine",
  "pepto-bismol", "imodium", "loperamide", "robitussin", "delsym", "mucinex", "sudafed", "pseudoephedrine",
  "nyquil", "dayquil", "ambien", "zolpidem", "xanax", "alprazolam", "ativan", "lorazepam", "valium", "diazepam",
  "buspar", "buspirone", "prozac", "fluoxetine", "zoloft", "sertraline", "lexapro", "escitalopram", "wellbutrin", "bupropion",
  "effexor", "venlafaxine", "cymbalta", "duloxetine", "remeron", "mirtazapine", "trazodone",
  "abilify", "aripiprazole", "seroquel", "quetiapine", "risperdal", "risperidone", "geodon", "ziprasidone",
  "lamictal", "lamotrigine", "topamax", "topiramate", "neurontin", "gabapentin", "lyrica", "pregabalin",
  "adderall", "amphetamine", "ritalin", "methylphenidate", "concerta", "vyvanse", "lisdexamfetamine", "focalin", "dexmethylphenidate",
  "strattera", "atomoxetine", "intuniv", "guanfacine", "clonidine", "catapres", "tenex",
  "lipitor", "atorvastatin", "crestor", "rosuvastatin", "zocor", "simvastatin", "pravachol", "pravastatin",
  "metformin", "glucophage", "januvia", "sitagliptin", "trulicity", "dulaglutide", "ozempic", "semaglutide", "wegovy",
  "lisinopril", "zestril", "prinivil", "norvasc", "amlodipine", "toprol", "metoprolol", "lopressor", "atenolol",
  "synthroid", "levothyroxine", " armour", "thyroid", "prednisone", "prednisolone", "hydrocortisone", "cortisone",
  "plavix", "clopidogrel", "coumadin", "warfarin", "eliquis", "apixaban", "xarelto", "rivaroxaban",
  "viagra", "sildenafil", "cialis", "tadalafil", "levitra", "vardenafil", "flomax", "tamsulosin",
  "propecia", "finasteride", "rogaine", "minoxidil", "accutane", "isotretinoin", "retin-a", "tretinoin",
  "botox", "botulinum", "restasis", "cyclosporine", "xalatan", "latanoprost", "lumigan", "bimatoprost",
  "advair", "symbicort", "spiriva", "albuterol", "ventolin", "proair", "flovent", "pulmicort",
  "singulair", "montelukast", "zyrtec", "cetirizine", "claritin", "loratadine", "allegra", "fexofenadine",
  "tamiflu", "oseltamivir", "relenza", "zanamivir", "xofluza", "baloxavir",
  "humira", "adalimumab", "enbrel", "etanercept", "remicade", "infliximab", "cimzia", "certolizumab",
  "methotrexate", "plaquenil", "hydroxychloroquine", "azulfidine", "sulfasalazine",
  "cellcept", "mycophenolate", "prograf", "tacrolimus", "neoral", "cyclosporine",
  "gleevec", "imatinib", "tasigna", "nilotinib", "sprycel", "dasatinib",
  "arimidex", "anastrozole", "tamoxifen", "nolvadex", "femara", "letrozole", "aromasin", "exemestane",
  "herceptin", "trastuzumab", "perjeta", "pertuzumab", "kadcyla", "ado-trastuzumab",
  "zyprexa", "olanzapine", "risperdal", "risperidone", "seroquel", "quetiapine", "geodon", "ziprasidone",
  "abilify", "aripiprazole", "latuda", "lurasidone", "saphris", "asenapine", "fanapt", "iloperidone",
  "depakote", "divalproex", "valproic", "lamictal", "lamotrigine", "topamax", "topiramate",
  "keppra", "levetiracetam", "dilantin", "phenytoin", "tegretol", "carbamazepine", "trileptal", "oxcarbazepine",
  "clonazepam", "klonopin", "diazepam", "valium", "lorazepam", "ativan", "alprazolam", "xanax",
  "hydroxyzine", "vistaril", "atarax", "promethazine", "phenergan", "compazine", "prochlorperazine",
  "reglan", "metoclopramide", "zofran", "ondansetron", "phenergan", "promethazine",
  "colace", "docusate", "miralax", "polyethylene glycol", "lactulose", "senna", "bisacodyl",
  "nexium", "esomeprazole", "prilosec", "omeprazole", "protonix", "pantoprazole", "aciphex", "rabeprazole",
  "carafate", "sucralfate", "pepcid", "famotidine", "axid", "nizatidine", "tagamet", "cimetidine",
  "imodium", "loperamide", "lomotil", "diphenoxylate", "questran", "cholestyramine", "colestid", "colestipol",
  "metamucil", "psyllium", "benefiber", "wheat dextrin", "citrucel", "methylcellulose",
  "miralax", "polyethylene glycol", "movicol", "macrogol", "colyte", "golytely",
  "dulcolax", "bisacodyl", "senokot", "senna", "fleet", "bisacodyl", "correctol", "bisacodyl",
  "ex-lax", "senna", "fleet", "bisacodyl", "correctol", "bisacodyl", "dulcolax", "bisacodyl",
  "colace", "docusate", "surfak", "docusate", "peri-colace", "docusate", "stool softener", "docusate",
  "miralax", "polyethylene glycol", "movicol", "macrogol", "colyte", "golytely", "nulytely", "polyethylene glycol",
  "metamucil", "psyllium", "benefiber", "wheat dextrin", "citrucel", "methylcellulose", "fiber", "psyllium",
  "imodium", "loperamide", "lomotil", "diphenoxylate", "questran", "cholestyramine", "colestid", "colestipol",
  "pepto-bismol", "bismuth subsalicylate", "kaopectate", "bismuth subsalicylate", "bismatrol", "bismuth subsalicylate",
  "maalox", "aluminum hydroxide", "magnesium hydroxide", "simethicone", "mylanta", "aluminum hydroxide", "magnesium hydroxide", "simethicone",
  "gaviscon", "aluminum hydroxide", "magnesium hydroxide", "sodium bicarbonate", "alginic acid",
  "tums", "calcium carbonate", "rolaids", "calcium carbonate", "magnesium hydroxide", "simethicone",
  "riopan", "magnesium hydroxide", "milk of magnesia", "magnesium hydroxide", "philips", "magnesium hydroxide",
  "epsom salts", "magnesium sulfate", "magnesium sulfate", "magnesium sulfate",
  "aluminum hydroxide", "aluminum hydroxide", "aluminum hydroxide", "aluminum hydroxide",
  "magnesium hydroxide", "magnesium hydroxide", "magnesium hydroxide", "magnesium hydroxide",
  "simethicone", "simethicone", "simethicone", "simethicone",
  "calcium carbonate", "calcium carbonate", "calcium carbonate", "calcium carbonate",
  "sodium bicarbonate", "sodium bicarbonate", "sodium bicarbonate", "sodium bicarbonate",
  "alginic acid", "alginic acid", "alginic acid", "alginic acid",
  "bismuth subsalicylate", "bismuth subsalicylate", "bismuth subsalicylate", "bismuth subsalicylate",
  "magnesium sulfate", "magnesium sulfate", "magnesium sulfate", "magnesium sulfate",
  "magnesium hydroxide", "magnesium hydroxide", "magnesium hydroxide", "magnesium hydroxide",
  "aluminum hydroxide", "aluminum hydroxide", "aluminum hydroxide", "aluminum hydroxide",
  "simethicone", "simethicone", "simethicone", "simethicone",
  "calcium carbonate", "calcium carbonate", "calcium carbonate", "calcium carbonate",
  "sodium bicarbonate", "sodium bicarbonate", "sodium bicarbonate", "sodium bicarbonate",
  "alginic acid", "alginic acid", "alginic acid", "alginic acid"
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

async function findSetIdsByRxcui(rxcui, pagesize = 15) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=${encodeURIComponent(
    rxcui
  )}&pagesize=${pagesize}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data || []).map((x) => x.setid).filter(Boolean);
}

async function findSetIdsByDrugName(drugName, pagesize = 15) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(
    drugName
  )}&pagesize=${pagesize}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data || []).map((x) => x.setid).filter(Boolean);
}

async function fetchSplXmlBySetId(setid) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

async function fetchOpenFDAData(drug) {
  try {
    const searchUrl = `https://api.fda.gov/drug/label.json?search=openfda.product_name:${encodeURIComponent(drug.name)}&limit=10`;
    const res = await fetch(searchUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    
    const result = data.results[0];
    
    return {
      openfdaData: {
        product_type: result.product_type,
        application_number: result.application_number,
        brand_name: result.openfda?.brand_name,
        generic_name: result.openfda?.generic_name,
        manufacturer: result.openfda?.manufacturer_name,
        purpose: result.purpose,
        warnings: result.warnings,
        dosage_and_administration: result.dosage_and_administration,
        drug_interactions: result.drug_interactions,
        adverse_reactions: result.adverse_reactions,
        boxed_warning: result.boxed_warning,
        precautions: result.precautions,
        pregnancy_category: result.pregnancy_category,
        storage_and_handling: result.storage_and_handling,
        effective_date: result.effective_date,
        ndc: result.openfda?.product_ndc
      }
    };
  } catch (error) {
    console.error(`OpenFDA error for ${drug.name}:`, error);
    return null;
  }
}

async function run() {
  const raw = await fs.readFile(FILE, "utf-8");
  const drugs = JSON.parse(raw);

  // Filter for high-value medications
  const highValueDrugs = drugs.filter(d => {
    const name = d.name.toLowerCase();
    return HIGH_VALUE_MEDS.some(med => 
      name.includes(med) || med.includes(name)
    );
  });

  console.log(`Found ${highValueDrugs.length} high-value medications out of ${drugs.length} total`);

  let ok = 0;
  let fail = 0;
  let processed = 0;

  for (let i = 0; i < Math.min(highValueDrugs.length, LIMIT); i++) {
    const d = highValueDrugs[i];

    // Skip if already enriched
    if (d.label?.indications?.length || d.openfdaData) {
      processed++;
      continue;
    }

    console.log(`\n[${processed + 1}/${Math.min(LIMIT, highValueDrugs.length)}] Processing ${d.name} (${d.rxnormTty}) (RXCUI: ${d.rxcui}) ===`);

    try {
      let enriched = false;

      // Try DailyMed first
      let setids = await findSetIdsByRxcui(d.rxcui, 15);
      
      if (!setids.length) {
        console.log("  ↳ RXCUI failed, trying name search");
        setids = await findSetIdsByDrugName(d.name, 15);
      }

      if (setids.length) {
        for (const setid of setids) {
          const xml = await fetchSplXmlBySetId(setid);
          if (!xml) continue;

          const xmlObj = parser.parse(xml);
          const rawText = collectStrings(xmlObj).join(" ");
          
          if (looksLikeRxLabel(rawText) && matchesDrugName(d.name, "", rawText)) {
            const extracted = extractSectionsFromSplXml(xmlObj);
            const indText = extracted.indications?.[0] || "";
            const warnText = extracted.warnings?.[0] || "";
            
            if (indText.length > 120 || warnText.length > 120) {
              d.dailymed = { setid, source: "DailyMed" };
              d.label = extracted;
              ok++;
              enriched = true;
              console.log("  ✓ Found DailyMed Rx label");
              break;
            }
          }
        }
      }

      // If DailyMed failed, try OpenFDA
      if (!enriched) {
        const openfda = await fetchOpenFDAData(d);
        if (openfda) {
          Object.assign(d, openfda);
          ok++;
          enriched = true;
          console.log("  ✓ Found OpenFDA data");
        }
      }

      if (!enriched) {
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
  console.log(`\nHigh-value medications enriched with FDA data!`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
