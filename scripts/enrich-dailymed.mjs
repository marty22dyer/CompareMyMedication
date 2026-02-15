import fs from "fs/promises";

const FILE = "./data/brand-test.json";

async function fetchLabel(drugName) {
  const url =
    "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=" +
    encodeURIComponent(drugName);

  const res = await fetch(url);
  const data = await res.json();

  if (!data?.data?.length) return null;

  // get first SPL ID
  const spl = data.data[0].setid;

  const labelUrl =
    "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/" +
    spl +
    ".json";

  const labelRes = await fetch(labelUrl);
  const labelData = await labelRes.json();

  return labelData;
}

function extractSections(label) {
  if (!label?.data?.sections) return {};

  let indications = [];
  let warnings = [];

  for (const sec of label.data.sections) {
    const title = sec.title?.toLowerCase() || "";

    if (title.includes("indications")) {
      indications.push(sec.text?.replace(/<[^>]+>/g, "").slice(0, 500));
    }

    if (title.includes("warning")) {
      warnings.push(sec.text?.replace(/<[^>]+>/g, "").slice(0, 500));
    }
  }

  return { indications, warnings };
}

async function run() {
  const raw = await fs.readFile(FILE, "utf-8");
  const drugs = JSON.parse(raw);

  for (let i = 0; i < drugs.length; i++) {
    const drug = drugs[i];

    console.log(`Enriching ${drug.name}...`);

    try {
      const label = await fetchLabel(drug.generic || drug.name);
      if (!label) continue;

      const sections = extractSections(label);

      drug.label = sections;

      await new Promise(r => setTimeout(r, 350)); // respect API
    } catch (e) {
      console.log("Skipped", drug.name);
    }
  }

  await fs.writeFile(FILE, JSON.stringify(drugs, null, 2));
  console.log("Enrichment complete.");
}

run();
