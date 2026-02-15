import base from "../data/drugs.json";
import overrides from "../data/overrides.json";
import comprehensive from "../data/comprehensive-drugs.json";
import commonMeds from "../data/common-meds.json";

export type Drug = {
  slug: string;
  name: string;
  rxcui?: string;
  rxnormTty?: string;
  publish?: boolean;
  rxOnly?: boolean;
  generic?: string;
  class?: string;
  category?: string;
  usedFor?: string[];
  alternatives?: string[];
  dailymed?: { setid?: string; source?: string };
  label?: { 
    indications?: string[]; 
    warnings?: string[];
    dosage?: string[];
    contraindications?: string[];
    adverseReactions?: string[];
    sideEffects?: string[];
    interactions?: string[];
  };
  // FDA enrichment data
  openfdaData?: any;
  orangeBookData?: any;
  ndcData?: any;
  // Pricing data
  goodrxData?: any;
  iodineData?: any;
  rxpriceData?: any;
  medicareData?: any;
  // Interaction data
  drugbankData?: any;
  fdaInteractionsData?: any;
  drugsComData?: any;
  medlinePlusData?: any;
  enrichedFrom?: string;
};

// Create lightweight indexes for fast lookups
const createIndexes = (drugs: Drug[]) => {
  const bySlug = new Map<string, Drug>();
  const byName = new Map<string, Drug[]>();
  const byGeneric = new Map<string, Drug[]>();
  const byClass = new Map<string, Drug[]>();
  const byCategory = new Map<string, Drug[]>();
  const enriched = new Set<string>();
  
  for (const drug of drugs) {
    // Slug index
    bySlug.set(drug.slug, drug);
    
    // Name index (lowercase for case-insensitive search)
    const nameLower = drug.name.toLowerCase();
    if (!byName.has(nameLower)) {
      byName.set(nameLower, []);
    }
    byName.get(nameLower)!.push(drug);
    
    // Generic index
    if (drug.generic) {
      const genericLower = drug.generic.toLowerCase();
      if (!byGeneric.has(genericLower)) {
        byGeneric.set(genericLower, []);
      }
      byGeneric.get(genericLower)!.push(drug);
    }
    
    // Class index
    if (drug.class) {
      const classLower = drug.class.toLowerCase();
      if (!byClass.has(classLower)) {
        byClass.set(classLower, []);
      }
      byClass.get(classLower)!.push(drug);
    }
    
    // Category index
    if (drug.category) {
      const categoryLower = drug.category.toLowerCase();
      if (!byCategory.has(categoryLower)) {
        byCategory.set(categoryLower, []);
      }
      byCategory.get(categoryLower)!.push(drug);
    }
    
    // Track enriched drugs
    if (drug.label?.indications?.length || drug.openfdaData || drug.goodrxData || drug.drugbankData) {
      enriched.add(drug.slug);
    }
  }
  
  return { bySlug, byName, byGeneric, byClass, byCategory, enriched };
};

// Safe data loading with error handling
const safeLoadData = (data: any, source: string): Drug[] => {
  try {
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error loading data from ${source}:`, error);
    return [];
  }
};

// Load and merge data
const baseList = safeLoadData(base, "base");
const comprehensiveList = safeLoadData(comprehensive, "comprehensive");
const overrideList = safeLoadData(overrides, "overrides");
const commonMedsList = safeLoadData(commonMeds, "common-meds");

// Merge all datasets (overrides win)
const map = new Map<string, Drug>();
for (const d of comprehensiveList) map.set(d.slug, d);
for (const d of baseList) map.set(d.slug, { ...map.get(d.slug), ...d });
for (const d of commonMedsList) map.set(d.slug, { ...map.get(d.slug), ...d });
for (const d of overrideList) map.set(d.slug, { ...map.get(d.slug), ...d });

export const drugs: Drug[] = Array.from(map.values());

// Create performance indexes
const indexes = createIndexes(drugs);

// Optimized search function with scoring
export function searchDrugs(query: string, limit: number = 20): Drug[] {
  if (!query || query.length < 2) return [];
  
  const q = query.toLowerCase();
  const results = new Map<string, { drug: Drug; score: number }>();
  
  // Search in name index
  Array.from(indexes.byName.entries()).forEach(([name, drugs]) => {
    if (name.includes(q)) {
      const score = name === q ? 100 : name.startsWith(q) ? 80 : 60;
      for (const drug of drugs) {
        const existing = results.get(drug.slug);
        if (!existing || existing.score < score) {
          results.set(drug.slug, { drug, score });
        }
      }
    }
  });
  
  // Search in generic index
  Array.from(indexes.byGeneric.entries()).forEach(([generic, drugs]) => {
    if (generic.includes(q)) {
      const score = generic === q ? 90 : generic.startsWith(q) ? 70 : 50;
      for (const drug of drugs) {
        const existing = results.get(drug.slug);
        if (!existing || existing.score < score) {
          results.set(drug.slug, { drug, score });
        }
      }
    }
  });
  
  // Search in class index
  Array.from(indexes.byClass.entries()).forEach(([className, drugs]) => {
    if (className.includes(q)) {
      const score = 30;
      for (const drug of drugs) {
        const existing = results.get(drug.slug);
        if (!existing || existing.score < score) {
          results.set(drug.slug, { drug, score });
        }
      }
    }
  });
  
  // Search in category index
  Array.from(indexes.byCategory.entries()).forEach(([category, drugs]) => {
    if (category.includes(q)) {
      const score = 25;
      for (const drug of drugs) {
        const existing = results.get(drug.slug);
        if (!existing || existing.score < score) {
          results.set(drug.slug, { drug, score });
        }
      }
    }
  });
  
  // Search in usedFor
  for (const drug of drugs) {
    if (drug.usedFor) {
      for (const use of drug.usedFor) {
        if (use.toLowerCase().includes(q)) {
          const score = 20;
          const existing = results.get(drug.slug);
          if (!existing || existing.score < score) {
            results.set(drug.slug, { drug, score });
          }
        }
      }
    }
  }
  
  // Search in alternatives
  for (const drug of drugs) {
    if (drug.alternatives) {
      for (const alt of drug.alternatives) {
        if (alt.toLowerCase().includes(q)) {
          const score = 15;
          const existing = results.get(drug.slug);
          if (!existing || existing.score < score) {
            results.set(drug.slug, { drug, score });
          }
        }
      }
    }
  }
  
  // Boost enriched drugs
  Array.from(results.entries()).forEach(([slug, result]) => {
    if (indexes.enriched.has(slug)) {
      result.score += 10;
    }
  });
  
  // Sort by score and limit results
  return Array.from(results.entries())
    .map(([slug, result]) => result.drug)
    .sort((a, b) => {
      const scoreA = results.get(a.slug)?.score || 0;
      const scoreB = results.get(b.slug)?.score || 0;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

// Optimized slug lookup
export function bySlug(slug: string): Drug | undefined {
  return indexes.bySlug.get(slug);
}

// Get enriched drugs only
export function getEnrichedDrugs(): Drug[] {
  return Array.from(indexes.enriched).map(slug => indexes.bySlug.get(slug)!).filter(Boolean);
}

// Get drugs by class
export function byClass(className: string): Drug[] {
  return indexes.byClass.get(className.toLowerCase()) || [];
}

// Get drugs by category
export function byCategory(category: string): Drug[] {
  return indexes.byCategory.get(category.toLowerCase()) || [];
}

// Get popular drugs (enriched + high-value)
export function getPopularDrugs(limit: number = 50): Drug[] {
  const popular = [
    "ozempic", "wegovy", "mounjaro", "zepbound", "saxenda",
    "tylenol", "advil", "aleve", "aspirin", "motrin",
    "benadryl", "claritin", "zyrtec", "allegra",
    "prilosec", "nexium", "zantac", "tagamet",
    "xanax", "prozac", "zoloft", "lexapro", "adderall",
    "lipitor", "crestor", "zocor", "norvasc",
    "metformin", "insulin", "glucophage", "januvia"
  ];
  
  const results: Drug[] = [];
  const seen = new Set<string>();
  
  // First add enriched drugs
  Array.from(indexes.enriched).forEach(slug => {
    if (results.length >= limit) return;
    const drug = indexes.bySlug.get(slug);
    if (drug && !seen.has(slug)) {
      results.push(drug);
      seen.add(slug);
    }
  });
  
  // Then add popular drugs
  popular.forEach(name => {
    if (results.length >= limit) return;
    const drugs = indexes.byName.get(name.toLowerCase());
    if (drugs) {
      for (const drug of drugs) {
        if (!seen.has(drug.slug)) {
          results.push(drug);
          seen.add(drug.slug);
          break;
        }
      }
    }
  });
  
  return results.slice(0, limit);
}

// Lightweight comparison targets
export function comparisonTargets(slug: string): Drug[] {
  const drug = indexes.bySlug.get(slug);
  if (!drug) return [];
  
  const targets: Drug[] = [];
  const seen = new Set<string>();
  
  // Add alternatives
  if (drug.alternatives) {
    for (const alt of drug.alternatives) {
      const altDrug = indexes.bySlug.get(alt);
      if (altDrug && !seen.has(alt)) {
        targets.push(altDrug);
        seen.add(alt);
      }
    }
  }
  
  // Add drugs from same class
  if (drug.class) {
    const classDrugs = indexes.byClass.get(drug.class.toLowerCase()) || [];
    for (const classDrug of classDrugs) {
      if (classDrug.slug !== slug && !seen.has(classDrug.slug) && targets.length < 10) {
        targets.push(classDrug);
        seen.add(classDrug.slug);
      }
    }
  }
  
  // Add drugs from same category
  if (drug.category) {
    const categoryDrugs = indexes.byCategory.get(drug.category.toLowerCase()) || [];
    for (const categoryDrug of categoryDrugs) {
      if (categoryDrug.slug !== slug && !seen.has(categoryDrug.slug) && targets.length < 15) {
        targets.push(categoryDrug);
        seen.add(categoryDrug.slug);
      }
    }
  }
  
  return targets;
}

// Export legacy compatibility
export { drugs as allDrugs };
