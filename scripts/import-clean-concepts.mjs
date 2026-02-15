import fs from "fs/promises";

const OUT = "./data/clean-drugs.json";

async function getCleanConcepts() {
  console.log("Fetching clean RxNorm concepts...");

  // Try prescribable names (more user-facing)
  const res = await fetch(
    "https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=PSN"
  );

  const data = await res.json();

  if (!data?.minConceptGroup?.minConcept) {
    console.log("No concepts found");
    return;
  }

  const concepts = data.minConceptGroup.minConcept;

  const cleaned = concepts
    .slice(0, 1000) // start safe
    .map(d => ({
      rxcui: d.rxcui,
      name: d.name,
      slug: d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      tty: d.tty,
      class: "",
      category: "",
      usedFor: [],
      alternatives: [],
      label: null
    }))
    .filter(d => d.name && d.rxcui); // ensure we have both

  console.log(`Saving ${cleaned.length} clean concepts...`);

  await fs.writeFile(OUT, JSON.stringify(cleaned, null, 2));

  console.log("Done.");
}

getCleanConcepts();
