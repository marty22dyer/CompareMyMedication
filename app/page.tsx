"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRecentSearches, addRecentSearch, type RecentSearch } from "../lib/userPreferences";

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
  description: "Compare 238+ prescription medications side-by-side. Find cheaper alternatives, check prices, and save up to 80% on prescriptions. FDA-verified data.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://comparemymedication.com/compare?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is CompareMyMedication free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! CompareMyMedication is 100% free with no sign-up required. You can compare medications, check prices, and find alternatives without creating an account or providing any personal information."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate is the medication pricing information?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our pricing data is sourced from real pharmacy prices and updated regularly. Prices may vary by location, pharmacy, and insurance coverage. We recommend checking with your local pharmacy for the most current pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Where does the drug information come from?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All drug information is sourced from the FDA's official database, including drug labels, indications, warnings, and adverse events. This ensures you receive accurate, government-verified medical information."
      }
    },
    {
      "@type": "Question",
      "name": "Can I save money by switching medications?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many people save 50-80% by switching to generic alternatives or finding lower-cost options in the same drug class. Always consult your doctor before making any medication changes."
      }
    },
    {
      "@type": "Question",
      "name": "Do you store my medical information?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. We do not collect, store, or share any personal medical information. Your searches are private and anonymous. We only use Google Analytics to understand site usage."
      }
    }
  ]
};

const DRUG_CATEGORIES = [
  { name: "Diabetes", icon: "🩸", slug: "diabetes-medications", count: 25 },
  { name: "Weight Loss", icon: "⚖️", slug: "weight-loss-drugs", count: 12 },
  { name: "ADHD", icon: "🧠", slug: "adhd-medications", count: 15 },
  { name: "Depression & Anxiety", icon: "💭", slug: "depression-anxiety", count: 28 },
  { name: "Blood Pressure", icon: "❤️", slug: "blood-pressure", count: 22 },
  { name: "Cholesterol", icon: "📊", slug: "cholesterol", count: 18 },
  { name: "Pain Relief", icon: "💊", slug: "pain-relief", count: 20 },
  { name: "Antibiotics", icon: "🦠", slug: "antibiotics", count: 16 },
  { name: "Heart Medications", icon: "💗", slug: "heart-medications", count: 14 },
  { name: "Thyroid", icon: "🔬", slug: "thyroid", count: 8 },
  { name: "Asthma & COPD", icon: "🫁", slug: "asthma-copd", count: 12 },
  { name: "Birth Control", icon: "💊", slug: "birth-control", count: 10 },
];

export default function Home() {
  const router = useRouter();
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [singleDrug, setSingleDrug] = useState("");
  const [searchMode, setSearchMode] = useState<'single' | 'compare'>('single');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const [suggestionsA, setSuggestionsA] = useState<string[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<string[]>([]);
  const [suggestionsSingle, setSuggestionsSingle] = useState<string[]>([]);
  
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);
  const [showSuggestionsSingle, setShowSuggestionsSingle] = useState(false);
  
  const inputARef = useRef<HTMLDivElement>(null);
  const inputBRef = useRef<HTMLDivElement>(null);
  const inputSingleRef = useRef<HTMLFormElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

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
      addRecentSearch(slug, singleDrug, 'drug');
      setRecentSearches(getRecentSearches());
      router.push(`/drug/${slug}`);
    }
  };

  const handleRecentSearchClick = (search: RecentSearch) => {
    if (search.type === 'drug') {
      router.push(`/drug/${search.slug}`);
    } else {
      router.push(`/compare/${search.slug}`);
    }
  };

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

            <h1 className="home-title">Compare 238+ Medications & Save Up to 80%</h1>
            <p className="home-subtitle">Find cheaper alternatives, compare effectiveness, and check real prices - all backed by FDA data</p>
            
            {/* Stats Bar */}
            <div className="home-stats-bar">
              <div className="home-stat">
                <div className="home-stat-number">238+</div>
                <div className="home-stat-label">Medications</div>
              </div>
              <div className="home-stat">
                <div className="home-stat-number">50K+</div>
                <div className="home-stat-label">Comparisons</div>
              </div>
              <div className="home-stat">
                <div className="home-stat-number">80%</div>
                <div className="home-stat-label">Avg Savings</div>
              </div>
            </div>

            {/* Search Tabs */}
            <div className="home-search-tabs">
              <button 
                className={`home-search-tab ${searchMode === 'single' ? 'active' : ''}`}
                onClick={() => setSearchMode('single')}
              >
                🔍 Search Drug Info
              </button>
              <button 
                className={`home-search-tab ${searchMode === 'compare' ? 'active' : ''}`}
                onClick={() => setSearchMode('compare')}
              >
                ⚖️ Compare Two Drugs
              </button>
            </div>
            
            {/* Single Drug Search (Default/Primary) */}
            {searchMode === 'single' && (
              <div className="home-search-container">
                <form onSubmit={handleSingleSearch} className="home-primary-search" ref={inputSingleRef}>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      className="home-history-btn"
                      onClick={() => setShowHistory(!showHistory)}
                      title="Recent searches"
                    >
                      🕐
                    </button>
                  )}
                  <span className="home-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search any medication (e.g., Ozempic, Lipitor, Adderall)"
                    value={singleDrug}
                    onChange={(e) => handleSingleDrugChange(e.target.value)}
                    onFocus={() => setShowHistory(false)}
                    className="home-search-input-primary"
                    autoComplete="off"
                  />
                  {showSuggestionsSingle && suggestionsSingle.length > 0 && (
                    <div className="home-autocomplete home-autocomplete-primary">
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
                  {showHistory && recentSearches.length > 0 && (
                    <div className="home-history-dropdown">
                      <div className="home-history-header">Recent Searches</div>
                      {recentSearches.map((search) => (
                        <div
                          key={search.slug}
                          className="home-history-item"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <span className="home-history-icon">{search.type === 'drug' ? '💊' : '⚖️'}</span>
                          <span className="home-history-name">{search.name}</span>
                          <span className="home-history-time">{getTimeAgo(search.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="submit" className="home-search-btn-primary">Search</button>
                </form>

                {/* Recent Searches Section */}
                {recentSearches.length > 0 && (
                  <div className="home-recent-searches">
                    <span className="home-popular-label">Recent:</span>
                    <div className="home-popular-pills">
                      {recentSearches.slice(0, 5).map((search) => (
                        <a
                          key={search.slug}
                          href={search.type === 'drug' ? `/drug/${search.slug}` : `/compare/${search.slug}`}
                          className="home-pill home-pill-recent"
                        >
                          {search.type === 'drug' ? '💊' : '⚖️'} {search.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Drug Searches */}
                <div className="home-popular-searches">
                  <span className="home-popular-label">Popular:</span>
                  <div className="home-popular-pills">
                    <a href="/drug/ozempic" className="home-pill">Ozempic</a>
                    <a href="/drug/wegovy" className="home-pill">Wegovy</a>
                    <a href="/drug/zepbound" className="home-pill">Zepbound</a>
                    <a href="/drug/adderall" className="home-pill">Adderall</a>
                    <a href="/drug/metformin" className="home-pill">Metformin</a>
                    <a href="/drug/lexapro" className="home-pill">Lexapro</a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comparison Tool (Secondary) */}
            {searchMode === 'compare' && (
              <div className="home-compare-tool-container">
              <form onSubmit={handleCompare} className="home-compare-tool">
                <div className="home-compare-inputs">
                  <div className="home-drug-input-wrapper" ref={inputARef}>
                    <div className="home-drug-input">
                      <span className="home-drug-icon">�</span>
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
              <div className="home-popular-searches">
                <span className="home-popular-label">Popular:</span>
                <div className="home-popular-pills">
                  <a href="/compare/adderall-vs-vyvanse" className="home-pill">Adderall vs Vyvanse</a>
                  <a href="/compare/ozempic-vs-wegovy" className="home-pill">Ozempic vs Wegovy</a>
                  <a href="/compare/zoloft-vs-lexapro" className="home-pill">Zoloft vs Lexapro</a>
                  <a href="/compare/metformin-vs-ozempic" className="home-pill">Metformin vs Ozempic</a>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="home-how-it-works">
          <div className="home-container">
            <h2 className="home-section-title">How It Works</h2>
            <div className="home-steps">
              <div className="home-step">
                <div className="home-step-number">1</div>
                <div className="home-step-icon">🔍</div>
                <h3 className="home-step-title">Search or Compare</h3>
                <p className="home-step-text">Enter one medication to learn more, or compare two drugs side-by-side</p>
              </div>
              <div className="home-step-arrow">→</div>
              <div className="home-step">
                <div className="home-step-number">2</div>
                <div className="home-step-icon">📊</div>
                <h3 className="home-step-title">View Comparison</h3>
                <p className="home-step-text">See effectiveness, side effects, pricing, and FDA-verified information</p>
              </div>
              <div className="home-step-arrow">→</div>
              <div className="home-step">
                <div className="home-step-number">3</div>
                <div className="home-step-icon">💰</div>
                <h3 className="home-step-title">Save Money</h3>
                <p className="home-step-text">Find cheaper alternatives and save up to 80% on your prescriptions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Drug Categories Section */}
        <section className="home-categories">
          <div className="home-container">
            <h2 className="home-section-title">Browse by Category</h2>
            <p className="home-section-subtitle">Explore medications by condition or drug class</p>
            <div className="home-category-grid">
              {DRUG_CATEGORIES.map((category) => (
                <a key={category.slug} href={`/category/${category.slug}`} className="home-category-card">
                  <div className="home-category-icon">{category.icon}</div>
                  <h3 className="home-category-name">{category.name}</h3>
                  <p className="home-category-count">{category.count} medications</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="home-why-choose">
          <div className="home-container">
            <h2 className="home-section-title">Why Choose CompareMyMedication?</h2>
            <div className="home-benefits-grid">
              <div className="home-benefit">
                <div className="home-benefit-icon">✓</div>
                <h3 className="home-benefit-title">FDA-Verified Data</h3>
                <p className="home-benefit-text">All drug information comes directly from the FDA's official database, ensuring accuracy and reliability</p>
              </div>
              <div className="home-benefit">
                <div className="home-benefit-icon">✓</div>
                <h3 className="home-benefit-title">100% Free Forever</h3>
                <p className="home-benefit-text">No hidden fees, no subscriptions, no credit card required. Compare medications completely free</p>
              </div>
              <div className="home-benefit">
                <div className="home-benefit-icon">✓</div>
                <h3 className="home-benefit-title">Privacy First</h3>
                <p className="home-benefit-text">No sign-up required. We don't collect, store, or share your medical information. Your searches are anonymous</p>
              </div>
              <div className="home-benefit">
                <div className="home-benefit-icon">✓</div>
                <h3 className="home-benefit-title">Real Pricing Data</h3>
                <p className="home-benefit-text">See actual price ranges from pharmacies, not estimates. Find the best deals and save money</p>
              </div>
              <div className="home-benefit">
                <div className="home-benefit-icon">✓</div>
                <h3 className="home-benefit-title">Easy to Understand</h3>
                <p className="home-benefit-text">Complex medical information simplified into clear comparisons anyone can understand</p>
              </div>
              <div className="home-benefit">
                <div className="home-benefit-icon">✓</div>
                <h3 className="home-benefit-title">Always Updated</h3>
                <p className="home-benefit-text">Drug information and pricing updated regularly to ensure you have the latest data</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="home-content">
          <div className="home-container">
            <div className="home-content-wrapper">
              <h2 className="home-content-title">Understanding Medication Comparisons</h2>
              <div className="home-content-text">
                <p>Comparing medications is an essential step in making informed healthcare decisions. With prescription drug costs rising every year, finding the right medication at the right price has never been more important. CompareMyMedication helps you navigate the complex world of prescription drugs by providing side-by-side comparisons of effectiveness, side effects, and pricing.</p>
                
                <h3>Why Compare Medications?</h3>
                <p>When your doctor prescribes a medication, you might wonder if there are alternatives that work just as well but cost less. Generic medications, for example, contain the same active ingredients as brand-name drugs but typically cost 50-80% less. By comparing medications in the same drug class, you can find options that fit your budget without compromising your health.</p>
                
                <h3>How to Find Cheaper Alternatives</h3>
                <p>Finding cheaper medication alternatives doesn't mean settling for lower quality. The FDA requires generic medications to meet the same rigorous standards as brand-name drugs. Our comparison tool shows you all available alternatives, including generics and medications in the same therapeutic class. You can compare prices across different pharmacies and find discount programs that can save you hundreds of dollars per year.</p>
                
                <h3>Generic vs Brand Name: What's the Difference?</h3>
                <p>Generic medications are bioequivalent to brand-name drugs, meaning they work the same way in your body. The main differences are the inactive ingredients (like fillers and dyes) and the price. Brand-name drugs are more expensive because manufacturers invest heavily in research, development, and marketing. Once a drug's patent expires, other companies can produce generic versions at a fraction of the cost.</p>
                
                <h3>Making Informed Decisions</h3>
                <p>Our platform provides comprehensive information including FDA-approved indications, common side effects, drug interactions, and dosing guidelines. This information helps you have more productive conversations with your healthcare provider about which medication is right for you. Remember, while cost is important, the most effective medication for your specific condition should be the primary consideration.</p>
                
                <h3>Save Money on Prescriptions</h3>
                <p>Americans spend over $350 billion on prescription medications annually. By comparing medications and choosing cost-effective alternatives, you can significantly reduce your healthcare expenses. Our tool shows you real pricing data from pharmacies, helping you find the best deals in your area. Many people save $500-$2,000 per year by switching to generic alternatives or finding lower-cost options in the same drug class.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="home-faq">
          <div className="home-container">
            <h2 className="home-section-title">Frequently Asked Questions</h2>
            <div className="home-faq-grid">
              <div className="home-faq-item">
                <h3 className="home-faq-question">Is CompareMyMedication free to use?</h3>
                <p className="home-faq-answer">Yes! CompareMyMedication is 100% free with no sign-up required. You can compare medications, check prices, and find alternatives without creating an account or providing any personal information.</p>
              </div>
              <div className="home-faq-item">
                <h3 className="home-faq-question">How accurate is the medication pricing information?</h3>
                <p className="home-faq-answer">Our pricing data is sourced from real pharmacy prices and updated regularly. Prices may vary by location, pharmacy, and insurance coverage. We recommend checking with your local pharmacy for the most current pricing.</p>
              </div>
              <div className="home-faq-item">
                <h3 className="home-faq-question">Where does the drug information come from?</h3>
                <p className="home-faq-answer">All drug information is sourced from the FDA's official database, including drug labels, indications, warnings, and adverse events. This ensures you receive accurate, government-verified medical information.</p>
              </div>
              <div className="home-faq-item">
                <h3 className="home-faq-question">Can I save money by switching medications?</h3>
                <p className="home-faq-answer">Many people save 50-80% by switching to generic alternatives or finding lower-cost options in the same drug class. Always consult your doctor before making any medication changes.</p>
              </div>
              <div className="home-faq-item">
                <h3 className="home-faq-question">Do you store my medical information?</h3>
                <p className="home-faq-answer">No. We do not collect, store, or share any personal medical information. Your searches are private and anonymous. We only use Google Analytics to understand site usage.</p>
              </div>
              <div className="home-faq-item">
                <h3 className="home-faq-question">How often is the information updated?</h3>
                <p className="home-faq-answer">Drug information is synced with the FDA database regularly. Pricing data is updated weekly to ensure accuracy. We continuously add new medications and comparisons.</p>
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
            <a href="/contact">Contact</a>
            <a href="/about">About</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
          <p className="cmm-footer__copy">
            © 2026 CompareMyMedication by MAD Designs LLC. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
