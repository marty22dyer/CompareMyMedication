"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug } from "../../../lib/drugs";
import { useState } from "react";
import FDADrugInfo from "../../../components/FDADrugInfo";
import FDADrugData from "../../../components/FDADrugData";
import { cleanFDAText, type DrugLabel, type AdverseEventSummary } from "../../../lib/openFDA";

export default function DrugPage({ params }: { params: { slug: string } }) {
  const drug = bySlug(params.slug);
  if (!drug) return notFound();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [fdaLabel, setFdaLabel] = useState<DrugLabel | null>(null);
  const [fdaEvents, setFdaEvents] = useState<AdverseEventSummary[]>([]);

  const handleFDAData = (data: { label: DrugLabel | null; events: AdverseEventSummary[] }) => {
    setFdaLabel(data.label);
    setFdaEvents(data.events);
  };

  const name = drug.name;
  const generic = drug.generic || "—";
  const drugClass = drug.class || "—";
  const category = drug.category || "Medication";
  const usedFor = drug.usedFor || [];
  
  // Pricing data
  const hasGoodRxData = drug.goodrxData?.current_price;
  const brandPrice = hasGoodRxData ? `$${drug.goodrxData?.current_price}` : "$$$$";
  const genericPrice = hasGoodRxData && drug.goodrxData?.current_price ? `$${Math.round(drug.goodrxData.current_price * 0.3)}` : "$$";
  const priceRange = hasGoodRxData ? `$${Math.round(drug.goodrxData.current_price * 0.3)} – $${drug.goodrxData.current_price}` : "Varies by pharmacy";
  
  // Drug information
  const indications = drug.label?.indications || (drug.openfdaData?.purpose ? [drug.openfdaData.purpose] : []);
  const warnings = drug.label?.warnings || drug.openfdaData?.warnings || [];
  const dosageInfo = drug.label?.dosage || (drug.openfdaData?.dosage_and_administration ? [drug.openfdaData.dosage_and_administration] : []);
  const sideEffects = drug.label?.sideEffects || drug.label?.adverseReactions || drug.openfdaData?.adverse_reactions || [];
  const interactions = drug.label?.interactions || drug.openfdaData?.drug_interactions || [];
  
  // Additional info
  const dosageForm = drug.ndcData?.dosage_form || drug.goodrxData?.dosage_form || "tablet, capsule";
  const manufacturer = drug.ndcData?.labeler_name || drug.openfdaData?.manufacturer || null;
  
  const alts = (drug.alternatives ?? [])
    .map((s: string) => bySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof bySlug>>[];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="drug-page-new">
      {/* Fetch FDA Data */}
      <FDADrugData drugName={name} onDataLoaded={handleFDAData} />
      
      {/* Header Section */}
      <div className="drug-header">
        <div className="drug-header-content">
          <div className="drug-header-top">
            <div className="drug-header-left">
              <h1 className="drug-name">{name}</h1>
              <p className="drug-generic-name">
                Generic: <Link href="#" className="drug-generic-link">{generic}</Link>
              </p>
              <div className="drug-meta">
                <span className="drug-category">{category}</span>
                <span className="drug-meta-separator">•</span>
                <span className="drug-class">{drugClass}</span>
                {drug.rxOnly && (
                  <>
                    <span className="drug-meta-separator">•</span>
                    <span className="drug-rx-badge">Rx Only</span>
                  </>
                )}
              </div>
            </div>
            <div className="drug-header-right">
              <button className="drug-compare-btn">Compare</button>
            </div>
          </div>

          {/* Similar Drugs Pills */}
          {alts.length > 0 && (
            <div className="drug-similar-pills">
              {alts.slice(0, 3).map((alt: any) => (
                <Link key={alt.slug} href={`/drug/${alt.slug}`} className="drug-pill">
                  <span className="drug-pill-icon">💊</span>
                  {alt.name}
                </Link>
              ))}
              {alts.length > 3 && (
                <button className="drug-pill drug-pill-more">+</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="drug-main-content">
        {/* Snapshot Section */}
        <div className="drug-section">
          <h2 className="drug-section-title">
            <span className="drug-section-icon">📊</span>
            Snapshot
          </h2>
          <div className="drug-snapshot-table">
            <div className="drug-snapshot-row">
              <div className="drug-snapshot-label">Generic name</div>
              <div className="drug-snapshot-value">{generic}</div>
            </div>
            <div className="drug-snapshot-row">
              <div className="drug-snapshot-label">Drug class</div>
              <div className="drug-snapshot-value">{drugClass}</div>
            </div>
            <div className="drug-snapshot-row">
              <div className="drug-snapshot-label">Category</div>
              <div className="drug-snapshot-value">{category}</div>
            </div>
            <div className="drug-snapshot-row">
              <div className="drug-snapshot-label">Forms Available</div>
              <div className="drug-snapshot-value">{dosageForm}</div>
            </div>
            {manufacturer && (
              <div className="drug-snapshot-row">
                <div className="drug-snapshot-label">Manufacturer</div>
                <div className="drug-snapshot-value">{manufacturer}</div>
              </div>
            )}
          </div>
        </div>

        {/* Cost Section */}
        <div className="drug-section drug-section-cost">
          <h2 className="drug-section-title">
            <span className="drug-section-icon">💰</span>
            Cost
          </h2>
          <div className="drug-cost-content">
            <div className="drug-cost-left">
              <p className="drug-cost-subtitle">Estimated monthly cost:</p>
              <div className="drug-cost-tiers">
                <div className="drug-cost-tier">
                  <span className="drug-cost-tier-label">{brandPrice} Brand</span>
                </div>
                {generic !== "—" && (
                  <div className="drug-cost-tier">
                    <span className="drug-cost-tier-label">{genericPrice} Generic</span>
                  </div>
                )}
              </div>
            </div>
            <div className="drug-cost-right">
              <p className="drug-cost-subtitle">Typical pharmacy range:</p>
              <p className="drug-cost-range">{priceRange}</p>
              <a href={`https://www.goodrx.com/${drug.slug}`} target="_blank" rel="noopener noreferrer" className="drug-cost-link">
                Compare Prices →
              </a>
            </div>
          </div>
        </div>

        {/* Effectiveness Section */}
        <div className="drug-section drug-section-expandable">
          <button 
            className="drug-section-header"
            onClick={() => toggleSection('effectiveness')}
          >
            <div className="drug-section-header-left">
              <span className="drug-section-icon drug-section-icon-pink">➕</span>
              <h2 className="drug-section-title-inline">Effectiveness</h2>
            </div>
            <span className="drug-section-arrow">{expandedSection === 'effectiveness' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'effectiveness' && (
            <div className="drug-section-content">
              <p className="drug-info-text" style={{ fontStyle: 'italic', color: '#666', marginBottom: '16px' }}>
                ⚕️ Consult your healthcare provider for information about how {name} may be effective for your condition.
              </p>
              
              {fdaLabel?.indications_and_usage && fdaLabel.indications_and_usage.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">FDA-Approved Indications:</h3>
                  <p className="drug-info-text">{cleanFDAText(fdaLabel.indications_and_usage)}</p>
                </>
              )}
              
              {fdaLabel?.purpose && fdaLabel.purpose.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">Purpose:</h3>
                  <p className="drug-info-text">{cleanFDAText(fdaLabel.purpose)}</p>
                </>
              )}
              
              {usedFor.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">Common Uses:</h3>
                  <ul className="drug-list">
                    {usedFor.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {indications.length > 0 && !fdaLabel?.indications_and_usage && (
                <>
                  <h3 className="drug-subsection-title">What is {name} used for?</h3>
                  {indications.map((indication, idx) => (
                    <p key={idx} className="drug-info-text">{indication}</p>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Side Effects Section */}
        <div className="drug-section drug-section-expandable">
          <button 
            className="drug-section-header"
            onClick={() => toggleSection('sideEffects')}
          >
            <div className="drug-section-header-left">
              <span className="drug-section-icon drug-section-icon-warning">⚠️</span>
              <h2 className="drug-section-title-inline">Side Effects</h2>
            </div>
            <span className="drug-section-arrow">{expandedSection === 'sideEffects' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'sideEffects' && (
            <div className="drug-section-content">
              <p className="drug-info-text" style={{ fontStyle: 'italic', color: '#666', marginBottom: '16px' }}>
                ⚕️ Always discuss potential side effects with your healthcare provider before starting {name}.
              </p>
              
              {fdaLabel?.warnings && fdaLabel.warnings.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">⚠️ Important Warnings:</h3>
                  <p className="drug-warning-text">{cleanFDAText(fdaLabel.warnings)}</p>
                </>
              )}
              
              {fdaLabel?.adverse_reactions && fdaLabel.adverse_reactions.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">Adverse Reactions:</h3>
                  <p className="drug-info-text">{cleanFDAText(fdaLabel.adverse_reactions)}</p>
                </>
              )}
              
              {fdaEvents.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">Most Reported Side Effects:</h3>
                  <ul className="drug-list">
                    {fdaEvents.slice(0, 10).map((event, idx) => (
                      <li key={idx} style={{ textTransform: 'capitalize' }}>
                        {event.term.toLowerCase()} <span style={{ color: '#666', fontSize: '14px' }}>({event.count.toLocaleString()} reports)</span>
                      </li>
                    ))}
                  </ul>
                  <p className="drug-info-text" style={{ fontSize: '13px', color: '#666', marginTop: '12px' }}>
                    Based on FDA adverse event reports. These are reported side effects and do not necessarily indicate causation.
                  </p>
                </>
              )}
              
              {warnings.length > 0 && !fdaLabel?.warnings && (
                <>
                  <h3 className="drug-subsection-title">⚠️ Important Warnings:</h3>
                  {warnings.map((warning, idx) => (
                    <p key={idx} className="drug-warning-text">{warning}</p>
                  ))}
                </>
              )}
              
              {sideEffects.length > 0 && !fdaLabel?.adverse_reactions && fdaEvents.length === 0 && (
                <>
                  <h3 className="drug-subsection-title">Common Side Effects:</h3>
                  <ul className="drug-list">
                    {sideEffects.slice(0, 10).map((effect, idx) => (
                      <li key={idx}>{effect}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {interactions.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">Drug Interactions:</h3>
                  <p className="drug-info-text">May interact with: {interactions.slice(0, 5).join(", ")}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dosing Section */}
        <div className="drug-section drug-section-expandable">
          <button 
            className="drug-section-header"
            onClick={() => toggleSection('dosing')}
          >
            <div className="drug-section-header-left">
              <span className="drug-section-icon drug-section-icon-blue">💊</span>
              <h2 className="drug-section-title-inline">Dosing</h2>
            </div>
            <span className="drug-section-arrow">{expandedSection === 'dosing' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'dosing' && (
            <div className="drug-section-content">
              <div className="drug-dosing-disclaimer" style={{ marginBottom: '16px' }}>
                <p><strong>⚕️ Important:</strong> Never adjust your dosage without consulting your doctor. Dosing varies based on age, weight, condition severity, and other medications.</p>
              </div>
              
              {fdaLabel?.dosage_and_administration && fdaLabel.dosage_and_administration.length > 0 && (
                <>
                  <h3 className="drug-subsection-title">FDA Dosage Guidelines:</h3>
                  <p className="drug-info-text">{cleanFDAText(fdaLabel.dosage_and_administration)}</p>
                </>
              )}
              
              {dosageInfo.length > 0 && !fdaLabel?.dosage_and_administration && (
                <>
                  <h3 className="drug-subsection-title">Dosage Information:</h3>
                  {dosageInfo.map((info, idx) => (
                    <p key={idx} className="drug-info-text">{info}</p>
                  ))}
                </>
              )}
              
              {!fdaLabel?.dosage_and_administration && dosageInfo.length === 0 && (
                <p className="drug-info-text">Dosing for {name} should be determined by your healthcare provider based on your individual needs and medical condition.</p>
              )}
            </div>
          )}
        </div>

        {/* Brand Names / Generic Versions Section */}
        {((drug.brandNames && drug.brandNames.length > 0) || (drug.genericVersions && drug.genericVersions.length > 0)) && (
          <div className="drug-section">
            <h2 className="drug-section-title">
              <span className="drug-section-icon">🔗</span>
              Related Medications
            </h2>
            <div className="drug-section-content">
              {drug.brandNames && drug.brandNames.length > 0 && (
                <div className="drug-related-group">
                  <h3 className="drug-subsection-title">Brand Names:</h3>
                  <div className="drug-pills">
                    {drug.brandNames.slice(0, 10).map((brandName: string, idx: number) => {
                      const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <Link key={idx} href={`/drug/${brandSlug}`} className="drug-pill">
                          {brandName}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
              {drug.genericVersions && drug.genericVersions.length > 0 && (
                <div className="drug-related-group">
                  <h3 className="drug-subsection-title">Generic Versions:</h3>
                  <div className="drug-pills">
                    {drug.genericVersions.slice(0, 10).map((slug: string, idx: number) => {
                      const relatedDrug = bySlug(slug);
                      if (!relatedDrug) return null;
                      return (
                        <Link key={idx} href={`/drug/${slug}`} className="drug-pill">
                          {relatedDrug.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="drug-action-buttons">
          <Link href="/compare" className="drug-action-btn drug-action-btn-primary">
            <span className="drug-action-icon">💊</span>
            Compare Drugs
          </Link>
          <a href={`https://www.goodrx.com/${drug.slug}`} target="_blank" rel="noopener noreferrer" className="drug-action-btn drug-action-btn-secondary">
            <span className="drug-action-icon">💰</span>
            Find Cheaper Alternative
          </a>
        </div>

        {/* FDA Drug Information */}
        <FDADrugInfo drugName={name} />
        
        {/* SEO Disclaimer */}
        <div className="drug-seo-disclaimer">
          <p><strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not be used as a substitute for professional medical advice. Always consult your healthcare provider before starting, stopping, or changing any medication. Prices shown are estimates and may vary by location and pharmacy.</p>
        </div>
      </div>
    </div>
  );
}
