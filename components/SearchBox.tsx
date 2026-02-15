"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchResult {
  slug: string;
  name: string;
  generic?: string;
  class?: string;
  category?: string;
  usedFor?: string[];
  alternatives?: string[];
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchDrugs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchDrugs, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Check if it's a comparison query
      const parts = query.toLowerCase().split(/\b(vs|versus|and)\b/i).map(s => s.trim()).filter(Boolean);
      
      if (parts.length === 2) {
        // Redirect to comparison page
        window.location.href = `/compare?q=${encodeURIComponent(query)}`;
      } else {
        // Redirect to search results or first drug
        if (results.length > 0) {
          window.location.href = `/drug/${results[0].slug}`;
        } else {
          window.location.href = `/compare?q=${encodeURIComponent(query)}`;
        }
      }
    }
  };

  const getHighlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div ref={searchRef} className="search-container">
      <form onSubmit={handleSubmit} className="cmm-search">
        <div className="cmm-search__field">
          <span className="cmm-search__icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            name="q"
            className="cmm-search__input"
            placeholder="Compare medications (e.g., ozempic vs wegovy)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            autoComplete="off"
          />
        </div>
        <button className="cmm-search__btn" type="submit">
          Search
        </button>
      </form>

      {isOpen && (
        <div className="search-dropdown">
          {isLoading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <div className="search-results-header">
                Found {results.length} medications
              </div>
              {results.map((drug) => (
                <Link
                  key={drug.slug}
                  href={`/drug/${drug.slug}`}
                  className="search-result-item"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="search-result-name">
                    {getHighlightText(drug.name, query)}
                  </div>
                  <div className="search-result-details">
                    {drug.generic && (
                      <span className="search-result-generic">
                        Generic: {getHighlightText(drug.generic, query)}
                      </span>
                    )}
                    {drug.class && (
                      <span className="search-result-class">
                        Class: {getHighlightText(drug.class, query)}
                      </span>
                    )}
                  </div>
                  {drug.usedFor && drug.usedFor.length > 0 && (
                    <div className="search-result-uses">
                      Used for: {drug.usedFor.slice(0, 2).join(", ")}
                    </div>
                  )}
                </Link>
              ))}
              <div className="search-footer">
                <button
                  onClick={() => {
                    window.location.href = `/compare?q=${encodeURIComponent(query)}`;
                  }}
                  className="search-compare-btn"
                >
                  Compare "{query}" →
                </button>
              </div>
            </>
          ) : query.length >= 2 ? (
            <div className="search-no-results">
              No medications found for "{query}"
              <div className="search-suggestions">
                Try: "ozempic", "metformin", "lisinopril", or "drug1 vs drug2"
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
