import fs from "fs/promises";

const OUT = "./data/rxcui-drugs.json";

async function getRxcuiDrugs() {
  console.log("Fetching RxNorm concepts with RXCUI...");

  const res = await fetch(
    "https://rxnav.nlm.nih.gov/REST/allstatus.json"
  );

  const data = await res.json();
  const concepts = data.minConceptGroup.minConcept;

  const cleaned = concepts
    .filter(d => d.tty === "SBD" || d.tty === "SCD") // branded + clinical drugs
    .slice(0, 500) // reasonable limit
    .map(d => ({
      rxcui: d.rxcui,
      name: d.name,
      slug: d.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, ""),
      tty: d.tty,
      class: "",
      category: "",
      usedFor: [],
      alternatives: [],
      label: null
    }))
    .filter(d => d.name && d.rxcui && d.name.length < 100); // filter out crazy long names

  console.log(`Saving ${cleaned.length} drugs with RXCUI...`);

  await fs.writeFile(OUT, JSON.stringify(cleaned, null, 2));

  console.log("Done.");
}

getRxcuiDrugs();
