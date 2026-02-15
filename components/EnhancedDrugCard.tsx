"use client";

import React from "react";

interface Drug {
  slug: string;
  name: string;
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
  enrichedFrom?: string;
}

interface EnhancedDrugCardProps {
  drug: Drug;
  showFullDetails?: boolean;
}

export default function EnhancedDrugCard({ drug, showFullDetails = false }: EnhancedDrugCardProps) {
  const hasEnrichedData = drug.label?.indications?.length || drug.openfdaData || drug.goodrxData || drug.drugbankData;

  return (
    <div className="enhanced-drug-card">
      <div className="drug-header">
        <h3 className="drug-name">{drug.name}</h3>
        {drug.generic && <span className="generic-name">{drug.generic}</span>}
        {hasEnrichedData && <span className="enriched-badge">✓ Enriched</span>}
      </div>

      <div className="drug-basics">
        {drug.class && <div className="drug-class"><strong>Class:</strong> {drug.class}</div>}
        {drug.category && <div className="drug-category"><strong>Category:</strong> {drug.category}</div>}
        {drug.usedFor && drug.usedFor.length > 0 && (
          <div className="drug-uses">
            <strong>Used for:</strong>
            <ul className="uses-list">
              {drug.usedFor.slice(0, showFullDetails ? drug.usedFor.length : 3).map((use, index) => (
                <li key={index}>{use}</li>
              ))}
              {!showFullDetails && drug.usedFor.length > 3 && (
                <li className="more-uses">+{drug.usedFor.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {showFullDetails && (
        <div className="drug-details">
          {/* FDA Label Information */}
          {drug.label?.indications && drug.label.indications.length > 0 && (
            <div className="drug-section">
              <h4>Indications</h4>
              <p>{drug.label.indications[0]}</p>
            </div>
          )}

          {drug.label?.warnings && drug.label.warnings.length > 0 && (
            <div className="drug-section">
              <h4>Warnings</h4>
              <p>{drug.label.warnings[0]}</p>
            </div>
          )}

          {drug.label?.dosage && drug.label.dosage.length > 0 && (
            <div className="drug-section">
              <h4>Dosage</h4>
              <p>{drug.label.dosage[0]}</p>
            </div>
          )}

          {drug.label?.contraindications && drug.label.contraindications.length > 0 && (
            <div className="drug-section">
              <h4>Contraindications</h4>
              <p>{drug.label.contraindications[0]}</p>
            </div>
          )}

          {drug.label?.adverseReactions && drug.label.adverseReactions.length > 0 && (
            <div className="drug-section">
              <h4>Adverse Reactions</h4>
              <p>{drug.label.adverseReactions[0]}</p>
            </div>
          )}

          {/* OpenFDA Data */}
          {drug.openfdaData && (
            <div className="drug-section">
              <h4>FDA Information</h4>
              {drug.openfdaData.manufacturer && <p><strong>Manufacturer:</strong> {drug.openfdaData.manufacturer}</p>}
              {drug.openfdaData.pregnancy_category && <p><strong>Pregnancy Category:</strong> {drug.openfdaData.pregnancy_category}</p>}
              {drug.openfdaData.boxed_warning && (
                <div className="boxed-warning">
                  <strong>Boxed Warning:</strong> {drug.openfdaData.boxed_warning}
                </div>
              )}
            </div>
          )}

          {/* GoodRx Pricing */}
          {drug.goodrxData && (
            <div className="drug-section">
              <h4>Pricing Information</h4>
              {drug.goodrxData.current_price && (
                <p><strong>Current Price:</strong> ${drug.goodrxData.current_price}</p>
              )}
              {drug.goodrxData.manufacturer && <p><strong>Manufacturer:</strong> {drug.goodrxData.manufacturer}</p>}
              {drug.goodrxData.dosage_strength && <p><strong>Dosage:</strong> {drug.goodrxData.dosage_strength}</p>}
              {drug.goodrxData.form && <p><strong>Form:</strong> {drug.goodrxData.form}</p>}
              {drug.goodrxData.has_coupons && <p className="coupons-available">✓ Coupons Available</p>}
            </div>
          )}

          {/* DrugBank Data */}
          {drug.drugbankData && (
            <div className="drug-section">
              <h4>Pharmacology</h4>
              {drug.drugbankData.description && <p>{drug.drugbankData.description}</p>}
              {drug.drugbankData.mechanism_of_action && (
                <div>
                  <strong>Mechanism of Action:</strong>
                  <p>{drug.drugbankData.mechanism_of_action}</p>
                </div>
              )}
              {drug.drugbankData.half_life && <p><strong>Half-life:</strong> {drug.drugbankData.half_life}</p>}
              {drug.drugbankData.metabolism && <p><strong>Metabolism:</strong> {drug.drugbankData.metabolism}</p>}
              {drug.drugbankData.protein_binding && <p><strong>Protein Binding:</strong> {drug.drugbankData.protein_binding}</p>}
            </div>
          )}

          {/* Alternatives */}
          {drug.alternatives && drug.alternatives.length > 0 && (
            <div className="drug-section">
              <h4>Alternatives</h4>
              <div className="alternatives-list">
                {drug.alternatives.slice(0, showFullDetails ? drug.alternatives.length : 5).map((alt, index) => (
                  <span key={index} className="alternative-tag">{alt}</span>
                ))}
                {!showFullDetails && drug.alternatives.length > 5 && (
                  <span className="more-alternatives">+{drug.alternatives.length - 5} more</span>
                )}
              </div>
            </div>
          )}

          {/* Data Source */}
          {drug.enrichedFrom && (
            <div className="data-source">
              <small>Data source: {drug.enrichedFrom}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
