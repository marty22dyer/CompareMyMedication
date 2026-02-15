import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const FILE = "./data/drugs.json";
const SLEEP_MS = 350;
const LIMIT = Number(process.env.LIMIT || "200");

const parser = new XMLParser({
  ignoreAttributes: false,
  processEntities: true,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHtml(s = "") {
  return String(s)
    .replace(/<[^>]+>/g, " ")
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

function extractSectionsFromSplXml(xmlObj) {
  const textBlob = stripHtml(collectStrings(xmlObj).join(" "));
  const safeSnippet = (s) => s.slice(0, 600);

  const indicationsIdx = textBlob.toUpperCase().indexOf("INDICATIONS");
  const warningsIdx = textBlob.toUpperCase().indexOf("WARNINGS");

  const indications = [];
  const warnings = [];

  if (indicationsIdx >= 0) indications.push(safeSnippet(textBlob.slice(indicationsIdx, indicationsIdx + 2000)));
  if (warningsIdx >= 0) warnings.push(safeSnippet(textBlob.slice(warningsIdx, warningsIdx + 2000)));

  return { indications, warnings };
}

function hasUsefulSections({ indications, warnings }) {
  const indOk = indications?.some((t) => t && t.length > 120);
  const warnOk = warnings?.some((t) => t && t.length > 120);
  return indOk || warnOk;
}

function normalizeNameForSearch(name = "") {
  return name
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, "")  // remove [Brand]
    .replace(/\([^)]*\)/g, "")   // remove (stuff)
    .replace(/\b(mg|mcg|ml|hr|hour|tablet|capsule|solution|extended|release|oral|injectable|topical)\b/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Try multiple SPL candidates and validate sections
async function findSetIdsByRxcui(rxcui, pagesize = 10) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=${encodeURIComponent(
    rxcui
  )}&pagesize=${pagesize}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data || []).map((x) => x.setid).filter(Boolean);
}

// Fallback: search by drug name when RXCUI fails
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

  let ok = 0;
  let fail = 0;
  let processed = 0;

  for (let i = 0; i < drugs.length; i++) {
    if (processed >= LIMIT) break;

    const d = drugs[i];

    // Skip if already enriched
    if (d.label?.indications?.length || d.label?.warnings?.length) {
      processed++;
      continue;
    }

    console.log(`\n[${processed + 1}/${Math.min(LIMIT, drugs.length)}] Processing ${d.name} (RXCUI: ${d.rxcui}) ===`);

    try {
      let setids = await findSetIdsByRxcui(d.rxcui, 10);
      
      // Fallback to name search if RXCUI yields nothing
      if (!setids.length) {
        const q = normalizeNameForSearch(d.name);
        if (q) {
          console.log("  ↳ RXCUI failed, trying name search:", q);
          setids = await findSetIdsByDrugName(q, 10);
        }
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
        const extracted = extractSectionsFromSplXml(xmlObj);

        if (hasUsefulSections(extracted)) {
          d.dailymed = { setid };
          d.label = {
            indications: (extracted.indications || []).filter(Boolean),
            warnings: (extracted.warnings || []).filter(Boolean),
          };
          ok++;
          enriched = true;
          console.log("  ✓ Found useful sections");
          break;
        } else {
          console.log(`  ✗ SETID ${setid} lacks useful sections`);
        }
      }

      if (!enriched) {
        console.log("  ↳ No valid SPL found after trying all candidates");
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
