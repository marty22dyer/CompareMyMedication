import base from "../data/drugs.json";
import overrides from "../data/overrides.json";
import comprehensive from "../data/comprehensive-drugs.json";
import commonMeds from "../data/common-meds-enriched.json";

export type Drug = {
  slug: string;
  name: string;
  technicalName?: string;
  rxcui?: string;
  rxnormTty?: string;
  publish?: boolean;
  rxOnly?: boolean;
  generic?: string;
  class?: string;
  category?: string;
  usedFor?: string[];
  alternatives?: string[];
  brandNames?: string[];
  genericVersions?: string[];
  sameClass?: string[];
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
  openfdaData?: {
    product_type?: string;
    application_number?: string;
    brand_name?: string;
    generic_name?: string;
    manufacturer?: string;
    purpose?: string;
    warnings?: string[];
    dosage_and_administration?: string;
    drug_interactions?: string[];
    adverse_reactions?: string[];
    boxed_warning?: string;
    precautions?: string;
    pregnancy_category?: string;
    storage_and_handling?: string;
    effective_date?: string;
    ndc?: string[];
  };
  orangeBookData?: {
    product_type?: string;
    application_number?: string;
    brand_name?: string;
    generic_name?: string;
    manufacturer?: string;
    purpose?: string;
    warnings?: string[];
    dosage_and_administration?: string;
    drug_interactions?: string[];
    adverse_reactions?: string[];
    boxed_warning?: string;
    precautions?: string;
    pregnancy_category?: string;
    storage_and_handling?: string;
    effective_date?: string;
    ndc?: string[];
  };
  ndcData?: {
    product_ndc?: string;
    product_type?: string;
    brand_name?: string;
    generic_name?: string;
    labeler_name?: string;
    dosage_form?: string;
    route?: string;
    marketing_category?: string;
    product_code?: string;
    listing_expiration_date?: string;
    ndc_exclude_flag?: boolean;
    packaging?: any[];
    active_ingredients?: any[];
    inactive_ingredients?: any[];
  };
  // Pricing data
  goodrxData?: {
    drug_name?: string;
    generic_name?: string;
    brand_name?: string;
    drug_class?: string;
    manufacturer?: string;
    form?: string;
    dosage_strength?: string;
    route?: string;
    image_url?: string;
    quantity?: number;
    unit?: string;
    display_name?: string;
    has_coupons?: boolean;
    current_price?: number;
    price_history?: any[];
    dosage_form?: string;
    related_drugs?: any[];
    alternatives?: any[];
    reviews?: any[];
    ratings?: any[];
  };
  iodineData?: {
    drug_name?: string;
    generic_name?: string;
    brand_name?: string;
    drug_class?: string;
    description?: string;
    fda_label?: string;
    indications?: string[];
    contraindications?: string[];
    side_effects?: string[];
    interactions?: string[];
    pregnancy_category?: string;
    controlled_substance?: boolean;
    alcohol_interactions?: string[];
    food_interactions?: string[];
    other_interactions?: string[];
    dosage_forms?: string[];
    strengths?: string[];
    route?: string;
    images?: string[];
    reviews?: any[];
    ratings?: any[];
  };
  rxpriceData?: {
    drug_name?: string;
    generic_name?: string;
    ndc?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    pharmacy?: string;
    dosage?: string;
    form?: string;
    manufacturer?: string;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
  };
  medicareData?: {
    brand_name?: string;
    generic_name?: string;
    ndc?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    pharmacy?: string;
    dosage?: string;
    form?: string;
    manufacturer?: string;
    effective_date?: string;
    expiration_date?: string;
    marketing_status?: string;
  };
  // Interaction data
  drugbankData?: {
    drug_id?: string;
    drug_name?: string;
    description?: string;
    state?: string;
    groups?: string[];
    synonyms?: string[];
    products?: any[];
    drug_interactions?: any[];
    food_interactions?: any[];
    experimental_properties?: any[];
    approved?: boolean;
    withdrawn?: boolean;
    international_brands?: string[];
    mixtures?: any[];
    packagers?: any[];
    manufacturers?: any[];
    prices?: any[];
    categories?: any[];
    dosages?: any[];
    atc_codes?: string[];
    ahfs_codes?: string[];
    pharmacology?: string;
    mechanism_of_action?: string;
    toxicity?: string;
    metabolism?: string;
    absorption?: string;
    half_life?: string;
    route_of_elimination?: string;
    volume_of_distribution?: string;
    clearance?: string;
    protein_binding?: string;
    external_links?: string[];
  };
  fdaInteractionsData?: {
    drug_name?: string;
    interactions?: string[];
    total_interactions?: number;
    source?: string;
  };
  drugsComData?: {
    drug_name?: string;
    interactions?: any[];
    total_interactions?: number;
    severity_levels?: any[];
    source?: string;
  };
  medlinePlusData?: {
    drug_name?: string;
    title?: string;
    summary?: string;
    url?: string;
    source?: string;
    topics?: any[];
    related_topics?: any[];
  };
  enrichedFrom?: string;
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

export function bySlug(slug: string) {
  return drugs.find(d => d.slug === slug);
}

export function comparisonTargets(slug: string): Drug[] {
  const drug = bySlug(slug);
  if (!drug) return [];

  return drugs.filter(d =>
    d.slug !== slug &&
    (
      (drug.class && d.class === drug.class) ||
        (drug.category && d.category === drug.category) ||
        (drug.alternatives?.includes(d.slug) ?? false)
    )
  );
}

export function displayName(slug: string) {
  return bySlug(slug)?.name ?? slug;
}

export function sameClass(slug: string) {
  const drug = bySlug(slug);
  if (!drug) return [];
  return drugs.filter(d => d.class === drug.class && d.slug !== slug);
}
