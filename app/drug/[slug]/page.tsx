"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug } from "../../../lib/drugs";
import { useState } from "react";

export default function DrugPage({ params }: { params: { slug: string } }) {
  const drug = bySlug(params.slug);
  if (!drug) return notFound();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const name = drug.name;
  const generic = drug.generic || "—";
  const drugClass = drug.class || "—";
  const conditions = drug.conditions || [];
  
  const alts = (drug.alternatives ?? [])
    .map((s: string) => bySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof bySlug>>[];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="drug-page-new">
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
                <span className="drug-category">{drug.category || "ADHD"}</span>
                <span className="drug-meta-separator">•</span>
                <span className="drug-class">{drugClass}</span>
                <span className="drug-rating">
                  ⭐⭐⭐⭐☆
                </span>
                <span className="drug-price-tier">$$$ price tier</span>
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
              <div className="drug-snapshot-label">Duration</div>
              <div className="drug-snapshot-value">4–6 hr (IR) / 10–12 hr (XR)</div>
            </div>
            <div className="drug-snapshot-row">
              <div className="drug-snapshot-label">Controlled</div>
              <div className="drug-snapshot-value">Schedule II</div>
            </div>
            <div className="drug-snapshot-row">
              <div className="drug-snapshot-label">Forms</div>
              <div className="drug-snapshot-value">tablet, capsule</div>
            </div>
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
                  <span className="drug-cost-tier-label">$$$$ Brand</span>
                </div>
                <div className="drug-cost-tier">
                  <span className="drug-cost-tier-label">$$ Generic</span>
                </div>
              </div>
            </div>
            <div className="drug-cost-right">
              <p className="drug-cost-subtitle">Typical pharmacy range:</p>
              <p className="drug-cost-range">$12 – $85</p>
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
              <p>Information about drug effectiveness will be displayed here.</p>
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
              {drug.label?.warnings?.length ? (
                <p>{drug.label.warnings[0]}</p>
              ) : (
                <p>Side effect information will be displayed here.</p>
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
              <p>Dosing information will be displayed here.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="drug-action-buttons">
          <button className="drug-action-btn drug-action-btn-primary">
            <span className="drug-action-icon">💊</span>
            Compare Drugs
          </button>
          <button className="drug-action-btn drug-action-btn-secondary">
            <span className="drug-action-icon">💰</span>
            Find Cheaper Alternative
          </button>
        </div>
      </div>
    </div>
  );
}
