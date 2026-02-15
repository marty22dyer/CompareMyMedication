import fs from "fs/promises";

const FILE = "./data/common-meds.json";

// Basic categorization for common medications
const CATEGORIES = {
  "pain-relievers": ["tylenol", "acetaminophen", "advil", "ibuprofen", "aleve", "naproxen", "aspirin", "motrin", "excedrin", "percocet", "oxycodone", "vicodin", "hydrocodone", "morphine"],
  "allergy": ["benadryl", "diphenhydramine", "claritin", "loratadine", "zyrtec", "cetirizine", "allegra", "fexofenadine"],
  "gi": ["pepto-bismol", "imodium", "loperamide", "prilosec", "omeprazole", "nexium", "esomeprazole", "zantac", "ranitidine", "tagamet", "cimetidine"],
  "cold-flu": ["robitussin", "delsym", "mucinex", "sudafed", "nyquil", "dayquil", "tylenol cold", "advil cold"],
  "sleep": ["ambien", "zolpidem", "tylenol pm", "nyquil"],
  "anxiety": ["xanax", "alprazolam", "ativan", "lorazepam", "valium", "diazepam", "buspar", "buspirone"],
  "depression": ["prozac", "fluoxetine", "zoloft", "sertraline", "lexapro", "escitalopram", "wellbutrin", "bupropion", "effexor", "venlafaxine", "cymbalta", "duloxetine", "remeron", "mirtazapine", "trazodone"],
  "antipsychotic": ["abilify", "aripiprazole", "seroquel", "quetiapine", "risperdal", "risperidone", "geodon", "ziprasidone"],
  "seizure": ["lamictal", "lamotrigine", "topamax", "topiramate", "neurontin", "gabapentin", "lyrica", "pregabalin"],
  "adhd": ["adderall", "amphetamine", "ritalin", "methylphenidate", "concerta", "vyvanse", "lisdexamfetamine", "focalin", "dexmethylphenidate", "strattera", "atomoxetine", "intuniv", "guanfacine", "clonidine"],
  "blood-pressure": ["clonidine", "guanfacine", "catapres", "tenex"]
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function categorizeDrug(name) {
  const n = name.toLowerCase();
  
  for (const [category, meds] of Object.entries(CATEGORIES)) {
    if (meds.some(med => n.includes(med))) {
      return category;
    }
  }
  
  return "other";
}

function getGenericName(name) {
  const n = name.toLowerCase();
  
  // Map common brand names to generics
  const generics = {
    "tylenol": "acetaminophen",
    "advil": "ibuprofen", 
    "aleve": "naproxen",
    "motrin": "ibuprofen",
    "benadryl": "diphenhydramine",
    "claritin": "loratadine",
    "zyrtec": "cetirizine",
    "allegra": "fexofenadine",
    "prilosec": "omeprazole",
    "nexium": "esomeprazole",
    "zantac": "ranitidine",
    "tagamet": "cimetidine",
    "robitussin": "dextromethorphan",
    "delsym": "dextromethorphan",
    "mucinex": "guaifenesin",
    "sudafed": "pseudoephedrine",
    "nyquil": "acetaminophen/dextromethorphan/doxylamine",
    "dayquil": "acetaminophen/dextromethorphan/phenylephrine",
    "ambien": "zolpidem",
    "xanax": "alprazolam",
    "ativan": "lorazepam",
    "valium": "diazepam",
    "buspar": "buspirone",
    "prozac": "fluoxetine",
    "zoloft": "sertraline",
    "lexapro": "escitalopram",
    "wellbutrin": "bupropion",
    "effexor": "venlafaxine",
    "cymbalta": "duloxetine",
    "remeron": "mirtazapine",
    "trazodone": "trazodone",
    "abilify": "aripiprazole",
    "seroquel": "quetiapine",
    "risperdal": "risperidone",
    "geodon": "ziprasidone",
    "lamictal": "lamotrigine",
    "topamax": "topiramate",
    "neurontin": "gabapentin",
    "lyrica": "pregabalin",
    "adderall": "amphetamine/dextroamphetamine",
    "ritalin": "methylphenidate",
    "concerta": "methylphenidate",
    "vyvanse": "lisdexamfetamine",
    "focalin": "dexmethylphenidate",
    "strattera": "atomoxetine",
    "intuniv": "guanfacine",
    "kapvay": "guanfacine",
    "tenex": "guanfacine",
    "catapres": "clonidine"
  };
  
  return generics[n] || "";
}

function getUses(category) {
  const uses = {
    "pain-relievers": ["Pain relief", "Fever reduction", "Anti-inflammatory"],
    "allergy": ["Allergy relief", "Hay fever", "Itching", "Hives"],
    "gi": ["Acid reflux", "Heartburn", "Stomach ulcers", "Diarrhea"],
    "cold-flu": ["Cold symptoms", "Flu symptoms", "Cough relief", "Congestion"],
    "sleep": ["Insomnia", "Sleep aid", "Nighttime cold/flu relief"],
    "anxiety": ["Anxiety", "Panic disorder", "Insomnia", "Muscle relaxation"],
    "depression": ["Depression", "Anxiety", "Bipolar disorder", "Smoking cessation"],
    "antipsychotic": ["Schizophrenia", "Bipolar disorder", "Psychosis", "Mania"],
    "seizure": ["Seizures", "Epilepsy", "Nerve pain", "Fibromyalgia"],
    "adhd": ["ADHD", "Narcolepsy", "Concentration", "Hyperactivity"],
    "blood-pressure": ["High blood pressure", "ADHD", "Anxiety", "Opioid withdrawal"]
  };
  
  return uses[category] || [];
}

async function run() {
  console.log("Enhancing common medications with categorization...");
  
  const raw = await fs.readFile(FILE, "utf-8");
  const drugs = JSON.parse(raw);
  
  const enhanced = drugs.map(drug => {
    const category = categorizeDrug(drug.name);
    const generic = getGenericName(drug.name);
    const usedFor = getUses(category);
    
    return {
      ...drug,
      category,
      generic: generic || drug.generic,
      usedFor,
      class: category === "other" ? "Medication" : category.charAt(0).toUpperCase() + category.slice(1),
      publish: true,
      rxOnly: !["pain-relievers", "allergy", "gi", "cold-flu", "sleep", "blood-pressure"].includes(category)
    };
  });
  
  console.log(`Enhanced ${enhanced.length} common medications`);
  await fs.writeFile(FILE, JSON.stringify(enhanced, null, 2));
  console.log("Common medications enhancement complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
