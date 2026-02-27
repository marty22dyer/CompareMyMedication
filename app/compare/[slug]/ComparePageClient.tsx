"use client";

import { notFound, redirect } from "next/navigation";
import { allCompareSlugs } from "../../../lib/compare";
import { bySlug, type Drug } from "../../../lib/drugs";
import { useState, useEffect } from "react";
import { addRecentSearch } from "../../../lib/userPreferences";
import { getCompareContent, getDynamicCompareContent } from "../../../lib/compare-content";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

function getCompare(slug: string) {
  const [a, b] = slug.split("-vs-");
  
  const A = bySlug(a);
  const B = bySlug(b);

  if (!A || !B) return null;

  const sameClass = A.class && B.class && A.class === B.class;
  const genericSame = A.generic === B.generic;

  return { slug, A, B, sameClass, genericSame };
}

type Props = { params: { slug: string } };

export default function ComparePage({ params }: Props) {
  const data = getCompare(params.slug);
  if (!data) return notFound();

  const { A, B, sameClass } = data;

  // Track this comparison
  useEffect(() => {
    addRecentSearch(params.slug, `${A.name} vs ${B.name}`, 'comparison');
  }, [params.slug, A.name, B.name]);

  // Get pricing data
  const priceA = A.goodrxData?.current_price ? `$${A.goodrxData.current_price}` : null;
  const priceB = B.goodrxData?.current_price ? `$${B.goodrxData.current_price}` : null;
  const genericPriceA = priceA ? `$${Math.round(A.goodrxData!.current_price! * 0.3)}` : null;
  const genericPriceB = priceB ? `$${Math.round(B.goodrxData!.current_price! * 0.3)}` : null;

  // Get rich content
  const richContent = getCompareContent(params.slug) ?? getDynamicCompareContent(
    A.name, A.class, A.usedFor ?? [],
    B.name, B.class, B.usedFor ?? [],
    !!sameClass, A.generic === B.generic
  );

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="compare-page-new">
      {/* Hero Section */}
      <section className="compare-hero">
        <div className="compare-container">
          <h1 className="compare-title">
            <span className="compare-drug-a">{A.name}</span>
            <span className="compare-vs">vs</span>
            <span className="compare-drug-b">{B.name}</span>
          </h1>
          <p className="compare-subtitle">
            {sameClass ? `Both are ${A.class}` : 'Different drug classes'} • Side-by-side comparison
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="compare-overview-section">
        <div className="compare-container">
          <div className="compare-overview-card">
            <h2 className="compare-overview-title">{A.name} vs {B.name}: Overview</h2>
            <p className="compare-overview-text">{richContent.overview}</p>
            <div className="compare-key-points">
              <h3 className="compare-key-points-title">Key Facts at a Glance</h3>
              <ul className="compare-key-points-list">
                {richContent.keyPoints.map((point, idx) => (
                  <li key={idx} className="compare-key-point-item">
                    <span className="compare-key-point-check">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Cards */}
      <section className="compare-body">
        <div className="compare-container">
          <div className="compare-grid">
            {/* Drug A Card */}
            <div className="compare-card compare-card-a">
              <div className="compare-card-header">
                <h2>{A.name}</h2>
                <span className="compare-badge compare-badge-a">Drug A</span>
              </div>
              
              <div className="compare-info-grid">
                <div className="compare-info-item">
                  <div className="compare-info-label">Generic Name</div>
                  <div className="compare-info-value">{A.generic || 'No generic'}</div>
                </div>
                <div className="compare-info-item">
                  <div className="compare-info-label">Drug Class</div>
                  <div className="compare-info-value">{A.class || '—'}</div>
                </div>
                <div className="compare-info-item">
                  <div className="compare-info-label">Brand Price</div>
                  <div className="compare-info-value compare-price">{priceA || '$$$$'}</div>
                </div>
                <div className="compare-info-item">
                  <div className="compare-info-label">Generic Price</div>
                  <div className="compare-info-value compare-price">{genericPriceA || '$$'}</div>
                </div>
              </div>

              <div className="compare-section">
                <h3 className="compare-section-title">Used For</h3>
                <ul className="compare-list">
                  {A.usedFor?.slice(0, 3).map((use, idx) => (
                    <li key={idx}>✓ {use}</li>
                  )) || <li>Consult your doctor</li>}
                </ul>
              </div>

              <a href={`/drug/${A.slug}`} className="compare-view-btn compare-btn-a">
                View {A.name} Details →
              </a>
            </div>

            {/* VS Divider */}
            <div className="compare-vs-divider">
              <div className="compare-vs-circle">VS</div>
            </div>

            {/* Drug B Card */}
            <div className="compare-card compare-card-b">
              <div className="compare-card-header">
                <h2>{B.name}</h2>
                <span className="compare-badge compare-badge-b">Drug B</span>
              </div>
              
              <div className="compare-info-grid">
                <div className="compare-info-item">
                  <div className="compare-info-label">Generic Name</div>
                  <div className="compare-info-value">{B.generic || 'No generic'}</div>
                </div>
                <div className="compare-info-item">
                  <div className="compare-info-label">Drug Class</div>
                  <div className="compare-info-value">{B.class || '—'}</div>
                </div>
                <div className="compare-info-item">
                  <div className="compare-info-label">Brand Price</div>
                  <div className="compare-info-value compare-price">{priceB || '$$$$'}</div>
                </div>
                <div className="compare-info-item">
                  <div className="compare-info-label">Generic Price</div>
                  <div className="compare-info-value compare-price">{genericPriceB || '$$'}</div>
                </div>
              </div>

              <div className="compare-section">
                <h3 className="compare-section-title">Used For</h3>
                <ul className="compare-list">
                  {B.usedFor?.slice(0, 3).map((use, idx) => (
                    <li key={idx}>✓ {use}</li>
                  )) || <li>Consult your doctor</li>}
                </ul>
              </div>

              <a href={`/drug/${B.slug}`} className="compare-view-btn compare-btn-b">
                View {B.name} Details →
              </a>
            </div>
          </div>

          {/* Key Differences */}
          <div className="compare-differences">
            <h2 className="compare-differences-title">Key Differences</h2>
            <div className="compare-differences-grid">
              {!sameClass && (
                <div className="compare-difference-item">
                  <span className="compare-difference-icon">⚠️</span>
                  <div>
                    <strong>Different drug classes:</strong> {A.name} is a {A.class}, while {B.name} is a {B.class}
                  </div>
                </div>
              )}
              {A.generic && B.generic && A.generic !== B.generic && (
                <div className="compare-difference-item">
                  <span className="compare-difference-icon">💊</span>
                  <div>
                    <strong>Different active ingredients:</strong> {A.generic} vs {B.generic}
                  </div>
                </div>
              )}
              {priceA && priceB && (
                <div className="compare-difference-item">
                  <span className="compare-difference-icon">💰</span>
                  <div>
                    <strong>Price difference:</strong> {A.name} costs {priceA} vs {B.name} at {priceB}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation Section */}
          <div className="compare-recommendation">
            <div className="compare-recommendation-icon">⚕️</div>
            <div>
              <h2 className="compare-recommendation-title">Which Should You Choose?</h2>
              <p className="compare-recommendation-text">{richContent.recommendation}</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="compare-faq">
            <h2 className="compare-faq-title">Frequently Asked Questions</h2>
            <div className="compare-faq-list">
              {richContent.faq.map((item, idx) => (
                <div key={idx} className="compare-faq-item">
                  <button
                    className="compare-faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    aria-expanded={openFaq === idx}
                  >
                    <span>{item.q}</span>
                    <span className="compare-faq-arrow">{openFaq === idx ? '▼' : '▶'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="compare-faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Comparisons */}
          <div className="compare-related">
            <h2 className="compare-related-title">Related Comparisons</h2>
            <div className="compare-related-grid">
              {(A.alternatives ?? []).slice(0, 2).map((altSlug: string) => (
                <a key={altSlug} href={`/compare/${altSlug}-vs-${B.slug}`} className="compare-related-link">
                  {altSlug.replace(/-/g, ' ')} vs {B.name} →
                </a>
              ))}
              {(B.alternatives ?? []).slice(0, 2).map((altSlug: string) => (
                <a key={altSlug} href={`/compare/${A.slug}-vs-${altSlug}`} className="compare-related-link">
                  {A.name} vs {altSlug.replace(/-/g, ' ')} →
                </a>
              ))}
              <a href={`/drug/${A.slug}`} className="compare-related-link">
                Learn more about {A.name} →
              </a>
              <a href={`/drug/${B.slug}`} className="compare-related-link">
                Learn more about {B.name} →
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="compare-disclaimer">
            <strong>⚕️ Medical Disclaimer:</strong> This comparison is for informational purposes only. Always consult your healthcare provider before starting, stopping, or changing any medication. Individual results may vary.
          </div>
        </div>
      </section>
    </main>
  );
}
