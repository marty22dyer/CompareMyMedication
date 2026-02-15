import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const FILE = "./data/drugs.json";
const SLEEP_MS = 350;

const parser = new XMLParser({
  ignoreAttributes: false,
  // DailyMed SPL can contain HTML-ish fragments; keep text best-effort
  processEntities: true,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHtml(s = "") {
  return String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Very small helper: traverse recursively and collect strings
function collectStrings(node, out = []) {
  if (node == null) return out;
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((x) => collectStrings(x, out));
  else if (typeof node === "object") Object.values(node).forEach((x) => collectStrings(x, out));
  return out;
}

// SPL XML is complex; we do a pragmatic extraction:
// find sections whose title contains keywords and pull nearby text.
function extractSectionsFromSplXml(xmlObj) {
  const textBlob = stripHtml(collectStrings(xmlObj).join(" "));
  // Fallback: if we can't locate sections precisely, return short snippets from blob
  const safeSnippet = (s) => s.slice(0, 600);

  // Try to locate by common headings (best-effort)
  const indicationsIdx = textBlob.toUpperCase().indexOf("INDICATIONS");
  const warningsIdx = textBlob.toUpperCase().indexOf("WARNINGS");

  const indications = [];
  const warnings = [];

  if (indicationsIdx >= 0) indications.push(safeSnippet(textBlob.slice(indicationsIdx, indicationsIdx + 2000)));
  if (warningsIdx >= 0) warnings.push(safeSnippet(textBlob.slice(warningsIdx, warningsIdx + 2000)));

  return { indications, warnings };
}

async function findSetIdByRxcui(rxcui) {
  const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=${encodeURIComponent(
    rxcui
  )}&pagesize=1`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const first = data?.data?.[0];
  return first?.setid || null;
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

  for (let i = 0; i < Math.min(drugs.length, 10); i++) { // test with first 10
    const d = drugs[i];

    console.log(`\n=== Processing ${d.name} (RXCUI: ${d.rxcui}) ===`);

    // Skip if already enriched
    if (d.label?.indications?.length || d.label?.warnings?.length) continue;

    try {
      const setid = await findSetIdByRxcui(d.rxcui);
      if (!setid) {
        console.log("  ↳ no DailyMed setid");
        fail++;
        await sleep(SLEEP_MS);
        continue;
      }

      const xml = await fetchSplXmlBySetId(setid);
      if (!xml) {
        console.log("  ↳ could not fetch SPL XML");
        fail++;
        await sleep(SLEEP_MS);
        continue;
      }

      const xmlObj = parser.parse(xml);
      const { indications, warnings } = extractSectionsFromSplXml(xmlObj);

      d.label = {
        indications: (indications || []).filter(Boolean),
        warnings: (warnings || []).filter(Boolean),
      };

      ok++;
    } catch (e) {
      console.log("  ↳ skipped (error)");
      fail++;
    }

    await sleep(SLEEP_MS);
  }

  await fs.writeFile(FILE, JSON.stringify(drugs, null, 2));
  console.log(`\nDone. Enriched: ${ok}, failed: ${fail}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
