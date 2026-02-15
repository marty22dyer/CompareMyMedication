import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const FILE = "./data/rxcui-drugs.json";

const parser = new XMLParser({ ignoreAttributes: false });

async function fetchSplByRxcui(rxcui) {
  console.log(`Fetching SPL for RXCUI ${rxcui}...`);
  
  try {
    // Get SPL SETID by RXCUI
    const splsUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=${rxcui}&pagesize=1`;
    const splsRes = await fetch(splsUrl);
    const splsData = await splsRes.json();

    if (!splsData?.data?.length) {
      console.log(`No SPL found for RXCUI ${rxcui}`);
      return null;
    }

    const setid = splsData.data[0].setid;
    console.log(`Found SETID: ${setid}`);

    // Fetch SPL XML
    const splXmlUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`;
    const splXmlRes = await fetch(splXmlUrl);
    const splXml = await splXmlRes.text();
    
    const spl = parser.parse(splXml);
    return spl;
  } catch (e) {
    console.log(`Error fetching SPL for ${rxcui}:`, e.message);
    return null;
  }
}

function extractSections(spl) {
  if (!spl) return {};

  let indications = [];
  let warnings = [];

  // Try to navigate SPL structure - console.log to debug first
  try {
    // SPL structure is complex, let's try common paths
    const document = spl.document || spl;
    const section = document?.section || [];
    
    if (Array.isArray(section)) {
      for (const sec of section) {
        const title = sec.title?.toLowerCase() || "";
        
        if (title.includes("indication")) {
          const text = sec.text || "";
          indications.push(text.replace(/<[^>]+>/g, "").slice(0, 500));
        }
        
        if (title.includes("warning")) {
          const text = sec.text || "";
          warnings.push(text.replace(/<[^>]+>/g, "").slice(0, 500));
        }
      }
    }
  } catch (e) {
    console.log("Error parsing sections:", e.message);
  }

  return { indications, warnings };
}

async function run() {
  const raw = await fs.readFile(FILE, "utf-8");
  const drugs = JSON.parse(raw);

  for (let i = 0; i < Math.min(drugs.length, 10); i++) { // test with first 10
    const drug = drugs[i];

    console.log(`\n=== Processing ${drug.name} (RXCUI: ${drug.rxcui}) ===`);

    try {
      const spl = await fetchSplByRxcui(drug.rxcui);
      if (!spl) continue;

      // Debug: log structure
      console.log("SPL keys:", Object.keys(spl));

      const sections = extractSections(spl);

      drug.label = sections;

      await new Promise(r => setTimeout(r, 1000)); // respect API
    } catch (e) {
      console.log("Skipped", drug.name, e.message);
    }
  }

  await fs.writeFile("./data/rxcui-enriched.json", JSON.stringify(drugs.slice(0, 10), null, 2));
  console.log("\nEnrichment complete.");
}

run();
