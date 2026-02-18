// OpenFDA API utilities for drug information and adverse events

const FDA_BASE_URL = 'https://api.fda.gov';

export interface DrugLabel {
  brand_name?: string[];
  generic_name?: string[];
  purpose?: string[];
  indications_and_usage?: string[];
  warnings?: string[];
  adverse_reactions?: string[];
  dosage_and_administration?: string[];
  active_ingredient?: string[];
  inactive_ingredient?: string[];
  when_using?: string[];
  stop_use?: string[];
  pregnancy_or_breast_feeding?: string[];
  ask_doctor?: string[];
}

export interface AdverseEvent {
  patient: {
    drug: Array<{
      medicinalproduct: string;
      drugcharacterization?: string;
    }>;
    reaction?: Array<{
      reactionmeddrapt: string;
    }>;
  };
  receivedate?: string;
  serious?: string;
  seriousnessdeath?: string;
  seriousnesshospitalization?: string;
}

export interface AdverseEventSummary {
  term: string;
  count: number;
}

/**
 * Fetch drug label information from OpenFDA
 */
export async function getDrugLabel(drugName: string): Promise<DrugLabel | null> {
  try {
    const searchTerm = encodeURIComponent(drugName);
    const url = `${FDA_BASE_URL}/drug/label.json?search=openfda.brand_name:"${searchTerm}"+openfda.generic_name:"${searchTerm}"&limit=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    return data.results[0];
  } catch (error) {
    console.error('Error fetching drug label:', error);
    return null;
  }
}

/**
 * Fetch adverse events for a specific drug
 */
export async function getAdverseEvents(drugName: string, limit: number = 100): Promise<AdverseEvent[]> {
  try {
    const searchTerm = encodeURIComponent(drugName);
    const url = `${FDA_BASE_URL}/drug/event.json?search=patient.drug.medicinalproduct:"${searchTerm}"&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    return data.results || [];
  } catch (error) {
    console.error('Error fetching adverse events:', error);
    return [];
  }
}

/**
 * Get summarized adverse event reactions for a drug
 */
export async function getAdverseEventSummary(drugName: string): Promise<AdverseEventSummary[]> {
  try {
    const searchTerm = encodeURIComponent(drugName);
    const url = `${FDA_BASE_URL}/drug/event.json?search=patient.drug.medicinalproduct:"${searchTerm}"&count=patient.reaction.reactionmeddrapt.exact`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }
    
    // Return top 20 most common reactions
    return data.results
      .slice(0, 20)
      .map((item: any) => ({
        term: item.term,
        count: item.count
      }));
  } catch (error) {
    console.error('Error fetching adverse event summary:', error);
    return [];
  }
}

/**
 * Clean and format FDA text (removes extra whitespace, formatting)
 */
export function cleanFDAText(text: string | string[] | undefined): string {
  if (!text) return '';
  
  const textStr = Array.isArray(text) ? text.join(' ') : text;
  
  return textStr
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * Get the first available text from an array of possible fields
 */
export function getFirstAvailable(...fields: (string | string[] | undefined)[]): string {
  for (const field of fields) {
    const cleaned = cleanFDAText(field);
    if (cleaned) return cleaned;
  }
  return '';
}
