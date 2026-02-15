import fs from "fs/promises";

const OUT = "./data/drugs.json";

async function getDrugs() {
  console.log("Fetching RxNorm concepts...");

  const res = await fetch(
    "https://rxnav.nlm.nih.gov/REST/allstatus.json"
  );

  const data = await res.json();

  const concepts = data.minConceptGroup.minConcept;

  const cleaned = concepts
    .filter(d => d.tty === "SBD" || d.tty === "SCD") // branded + clinical drugs
    .slice(0, 800) // start safe — later remove limit
    .map(d => ({
      slug: d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: d.name,
      generic: "",
      class: "",
      usedFor: [],
      alternatives: []
    }));

  console.log(`Saving ${cleaned.length} drugs...`);

  await fs.writeFile(OUT, JSON.stringify(cleaned, null, 2));

  console.log("Done.");
}

getDrugs();
