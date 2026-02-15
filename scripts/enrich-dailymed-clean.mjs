import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const FILE = "./data/drugs.json";
const SLEEP_MS = 350;
const LIMIT = Number(process.env.LIMIT || "100");

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

  const stop = cleaned.toUpperCase().search(/\b(CONTRAINDICATIONS|ADVERSE REACTIONS|PRECAUTIONS|DOSAGE|HOW SUPPLIED)\b/);
  return (stop > 150 ? cleaned.slice(0, stop) : cleaned).slice(0, 900);
}

function extractSectionsFromSplXml(xmlObj) {
  const raw = collectStrings(xmlObj).join(" ");
  const big = cleanSPLText(raw);

  const ind = extractByHeading(big, "INDICATIONS");
  const warn = extractByHeading(big, "WARNINGS");

  return {
    indications: ind ? [ind] : [],
    warnings: warn ? [warn] : [],
  };
}

function looksLikeRxLabel(fullText = "") {
  const t = fullText.toLowerCase();

  // Rx-only signals
  const rxSignals = [
    "rx only",
    "federal law prohibits dispensing without prescription",
    "prescription only",
  ];

  // Reject OTC/cosmetic signals
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
    "avoid direct sunlight",
    "away from fire",
    "dense and smooth foam",
    "silky and beautiful skin",
  ];

  const hasRx = rxSignals.some(s => t.includes(s));
  const hasOtc = otcSignals.some(s => t.includes(s));

  return hasRx && !hasOtc;
}

function matchesDrugName(drugName, labelTitle = "", fullText = "") {
  const name = drugName.toLowerCase();
  const title = labelTitle.toLowerCase();
  const text = fullText.toLowerCase();

  // Exact match in title
  if (title.includes(name)) return true;

  // Brand name in text
  if (text.includes(name)) return true;

  return false;
}

async function findSetIdsByRxcui(rxcui, pagesize = 10) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=${encodeURIComponent(
    rxcui
  )}&pagesize=${pagesize}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data || []).map((x) => x.setid).filter(Boolean);
}

async function findSetIdsByDrugName(drugName, pagesize = 10) {
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

async function run() {
  const raw = await fs.readFile(FILE, "utf-8");
  const drugs = JSON.parse(raw);

  // Only process publishable drugs
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
      let setids = await findSetIdsByRxcui(d.rxcui, 10);
      
      // Fallback to name search if RXCUI yields nothing
      if (!setids.length) {
        console.log("  ↳ RXCUI failed, trying name search");
        setids = await findSetIdsByDrugName(d.name, 10);
      }

      if (!setids.length) {
        console.log("  ↳ no DailyMed entries found");
        fail++;
        await sleep(SLEEP_MS);
        processed++;
        continue;
      }

      // Try candidates until one passes validation
      let enriched = false;
      for (const setid of setids) {
        const xml = await fetchSplXmlBySetId(setid);
        if (!xml) continue;

        const xmlObj = parser.parse(xml);
        const rawText = collectStrings(xmlObj).join(" ");
        
        // Validate Rx label
        if (!looksLikeRxLabel(rawText)) {
          console.log(`  ✗ SETID ${setid} failed Rx validation`);
          continue;
        }

        // Check if this matches our drug
        const extracted = extractSectionsFromSplXml(xmlObj);
        const indText = extracted.indications?.[0] || "";
        const warnText = extracted.warnings?.[0] || "";
        
        if (!matchesDrugName(d.name, "", rawText)) {
          console.log(`  ✗ SETID ${setid} doesn't match drug name`);
          continue;
        }
        
        if (indText.length > 120 || warnText.length > 120) {
          d.dailymed = { setid };
          d.label = {
            indications: (extracted.indications || []).filter(Boolean),
            warnings: (extracted.warnings || []).filter(Boolean),
          };
          ok++;
          enriched = true;
          console.log("  ✓ Found matching Rx label");
          break;
        } else {
          console.log(`  ✗ SETID ${setid} insufficient content`);
        }
      }

      if (!enriched) {
        console.log("  ↳ No valid Rx label found after trying all candidates");
        fail++;
      }

    } catch (e) {
      console.log("  ↳ skipped (error):", e.message);
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
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
