"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Common drugs for autocomplete
const COMMON_DRUGS = [
  "Adderall", "Advil", "Albuterol", "Ambien", "Amoxicillin",
  "Atorvastatin", "Azithromycin", "Benadryl", "Cialis", "Claritin",
  "Crestor", "Cymbalta", "Eliquis", "Gabapentin", "Hydrocodone",
  "Ibuprofen", "Lantus", "Lexapro", "Lipitor", "Lisinopril",
  "Losartan", "Lyrica", "Metformin", "Metoprolol", "Nexium",
  "Norco", "Omeprazole", "Ozempic", "Percocet", "Phentermine",
  "Prednisone", "Prozac", "Semaglutide", "Synthroid", "Tramadol",
  "Trazodone", "Tylenol", "Viagra", "Vicodin", "Vyvanse",
  "Wegovy", "Wellbutrin", "Xanax", "Zoloft", "Zyrtec"
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CompareMyMedication",
  url: "https://comparemymedication.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://comparemymedication.com/compare?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  const router = useRouter();
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [singleDrug, setSingleDrug] = useState("");
  
  const [suggestionsA, setSuggestionsA] = useState<string[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<string[]>([]);
  const [suggestionsSingle, setSuggestionsSingle] = useState<string[]>([]);
  
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);
  const [showSuggestionsSingle, setShowSuggestionsSingle] = useState(false);
  
  const inputARef = useRef<HTMLDivElement>(null);
  const inputBRef = useRef<HTMLDivElement>(null);
  const inputSingleRef = useRef<HTMLFormElement>(null);

  const getSuggestions = (query: string) => {
    if (!query) return [];
    return COMMON_DRUGS.filter(drug => 
      drug.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 5);
  };

  const handleDrugAChange = (value: string) => {
    setDrugA(value);
    setSuggestionsA(getSuggestions(value));
    setShowSuggestionsA(value.length > 0);
  };

  const handleDrugBChange = (value: string) => {
    setDrugB(value);
    setSuggestionsB(getSuggestions(value));
    setShowSuggestionsB(value.length > 0);
  };

  const handleSingleDrugChange = (value: string) => {
    setSingleDrug(value);
    setSuggestionsSingle(getSuggestions(value));
    setShowSuggestionsSingle(value.length > 0);
  };

  const selectDrugA = (drug: string) => {
    setDrugA(drug);
    setShowSuggestionsA(false);
  };

  const selectDrugB = (drug: string) => {
    setDrugB(drug);
    setShowSuggestionsB(false);
  };

  const selectSingleDrug = (drug: string) => {
    setSingleDrug(drug);
    setShowSuggestionsSingle(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputARef.current && !inputARef.current.contains(event.target as Node)) {
        setShowSuggestionsA(false);
      }
      if (inputBRef.current && !inputBRef.current.contains(event.target as Node)) {
        setShowSuggestionsB(false);
      }
      if (inputSingleRef.current && !inputSingleRef.current.contains(event.target as Node)) {
        setShowSuggestionsSingle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (drugA && drugB) {
      const slugA = drugA.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const slugB = drugB.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const compareSlug = [slugA, slugB].sort().join('-vs-');
      router.push(`/compare/${compareSlug}`);
    }
  };

  const handleSingleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleDrug) {
      const slug = singleDrug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      router.push(`/drug/${slug}`);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="home-page">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-container">
            {/* Trust Badges */}
            <div className="home-trust-badges">
              <span className="home-badge">✓ 100% Free</span>
              <span className="home-badge">✓ No Sign-up</span>
              <span className="home-badge">✓ FDA Data</span>
            </div>

            <h1 className="home-title">Compare Medications</h1>
            <p className="home-subtitle">What works better & how much will I pay?</p>
            
            {/* Value Proposition */}
            <h2 className="home-value-prop">
              Find cheaper alternatives & save up to 80% on prescriptions
            </h2>
            
            {/* Comparison Tool */}
            <form onSubmit={handleCompare} className="home-compare-tool">
              <div className="home-compare-inputs">
                <div className="home-drug-input-wrapper" ref={inputARef}>
                  <div className="home-drug-input">
                    <span className="home-drug-icon">💊</span>
                    <input
                      type="text"
                      placeholder="Adderall"
                      value={drugA}
                      onChange={(e) => handleDrugAChange(e.target.value)}
                      className="home-input"
                      autoComplete="off"
                    />
                  </div>
                  {showSuggestionsA && suggestionsA.length > 0 && (
                    <div className="home-autocomplete">
                      {suggestionsA.map((drug) => (
                        <div
                          key={drug}
                          className="home-autocomplete-item"
                          onClick={() => selectDrugA(drug)}
                        >
                          💊 {drug}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="home-vs">vs</span>
                <div className="home-drug-input-wrapper" ref={inputBRef}>
                  <div className="home-drug-input">
                    <span className="home-drug-icon">💊</span>
                    <input
                      type="text"
                      placeholder="Vyvanse"
                      value={drugB}
                      onChange={(e) => handleDrugBChange(e.target.value)}
                      className="home-input"
                      autoComplete="off"
                    />
                  </div>
                  {showSuggestionsB && suggestionsB.length > 0 && (
                    <div className="home-autocomplete">
                      {suggestionsB.map((drug) => (
                        <div
                          key={drug}
                          className="home-autocomplete-item"
                          onClick={() => selectDrugB(drug)}
                        >
                          💊 {drug}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="home-compare-btn">
                Compare
              </button>
            </form>

            {/* Popular Comparisons */}
            <div className="home-popular">
              <span className="home-popular-label">Popular comparisons</span>
              <div className="home-popular-pills">
                <a href="/compare/adderall-vs-vyvanse" className="home-pill">
                  <span className="home-pill-dot"></span>
                  Adderall vs Vyvanse
                </a>
                <a href="/compare/ozempic-vs-wegovy" className="home-pill">
                  <span className="home-pill-dot"></span>
                  Ozempic vs Wegovy
                </a>
                <a href="/compare/zoloft-vs-lexapro" className="home-pill">
                  <span className="home-pill-dot"></span>
                  Zoloft vs Lexapro
                </a>
                <a href="/compare/metformin-vs-ozempic" className="home-pill">
                  <span className="home-pill-dot"></span>
                  Metformin vs Ozempic
                </a>
                <button className="home-pill-nav">♡</button>
                <button className="home-pill-nav">→</button>
              </div>
            </div>

            {/* Single Drug Search */}
            <form onSubmit={handleSingleSearch} className="home-single-search" ref={inputSingleRef}>
              <span className="home-search-icon">🔍</span>
              <span className="home-search-text">Just researching one medication?</span>
              <div className="home-single-input-wrapper">
                <input
                  type="text"
                  placeholder="Search drug information"
                  value={singleDrug}
                  onChange={(e) => handleSingleDrugChange(e.target.value)}
                  className="home-search-input"
                  autoComplete="off"
                />
                {showSuggestionsSingle && suggestionsSingle.length > 0 && (
                  <div className="home-autocomplete home-autocomplete-single">
                    {suggestionsSingle.map((drug) => (
                      <div
                        key={drug}
                        className="home-autocomplete-item"
                        onClick={() => selectSingleDrug(drug)}
                      >
                        💊 {drug}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="home-search-btn">Search</button>
            </form>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="home-features">
          <div className="home-container">
            <div className="home-feature-grid">
              <div className="home-feature-card">
                <div className="home-feature-icon home-icon-green">✓</div>
                <h3 className="home-feature-title">Which works better?</h3>
                <p className="home-feature-text">Side-by-side effectiveness & duration</p>
              </div>
              
              <div className="home-feature-card">
                <div className="home-feature-icon home-icon-yellow">$</div>
                <h3 className="home-feature-title">What will I pay?</h3>
                <p className="home-feature-text">Realistic price ranges & savings options</p>
              </div>
              
              <div className="home-feature-card">
                <div className="home-feature-icon home-icon-blue">💊</div>
                <h3 className="home-feature-title">Are there cheaper alternatives?</h3>
                <p className="home-feature-text">Generics & equivalent medications</p>
              </div>
            </div>
          </div>
        </section>

        {/* We Help You Section */}
        <section className="home-help">
          <div className="home-container">
            <div className="home-help-content">
              <div className="home-help-main">
                <h2 className="home-help-title">We help you:</h2>
                <ul className="home-help-list">
                  <li>
                    <span className="home-check">✓</span>
                    <strong>Understand</strong> medication differences
                  </li>
                  <li>
                    <span className="home-check">✓</span>
                    <strong>Compare</strong> realistic costs
                  </li>
                  <li>
                    <span className="home-check">✓</span>
                    <strong>Find</strong> savings options
                  </li>
                </ul>
              </div>
              
              <div className="home-help-side">
                <div className="home-help-badge">
                  <span className="home-check">✓</span>
                  No sign-up <strong>required</strong>
                </div>
                <div className="home-help-badge">
                  <span className="home-check">✓</span>
                  No medical <strong>records</strong> stored
                </div>
              </div>
            </div>

            <div className="home-help-footer">
              <span className="home-help-note">◉ No sign-up required</span>
              <span className="home-help-note">◉ No medical records stored</span>
            </div>

            <a href="/compare/adderall-vs-vyvanse" className="home-cta-banner">
              <span className="home-cta-icon">💰</span>
              Save on prescriptions
              <strong>Adderall $12</strong> | <strong>Vyvanse from $85</strong>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="cmm-footer">
          <p className="cmm-footer__disclaimer">
            This tool provides general information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <div className="cmm-footer__links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="#">Contact</a>
            <a href="#">About</a>
          </div>
          <p className="cmm-footer__copy">
            © 2024 CompareMyMedication. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
