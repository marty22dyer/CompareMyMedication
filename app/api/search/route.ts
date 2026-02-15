import { NextResponse } from "next/server";
import { searchDrugs } from "../../../lib/drugs-optimized";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim();
  const limit = Math.min(Number(searchParams.get("limit") || "20"), 50);

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  // Use optimized search function
  const allResults = searchDrugs(q, limit * 3); // Get more results to account for duplicates
  
  // Deduplicate by base drug name (remove dosage variations)
  const seen = new Set<string>();
  const uniqueResults = allResults
    .filter(drug => {
      // Extract base name by removing dosage info (numbers, MG, etc.)
      const baseName = drug.name
        .replace(/\d+(\.\d+)?\s*(MG|MCG|G|ML|%)/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      
      if (seen.has(baseName)) {
        return false;
      }
      seen.add(baseName);
      return true;
    })
    .slice(0, limit)
    .map(drug => ({
      slug: drug.slug,
      name: drug.name,
      generic: drug.generic,
      class: drug.class,
      category: drug.category,
      usedFor: drug.usedFor,
      alternatives: drug.alternatives,
      publish: drug.publish,
      rxOnly: drug.rxOnly,
      label: drug.label,
    }));

  return NextResponse.json({ 
    query: q,
    results: uniqueResults,
    count: uniqueResults.length,
  });
}
