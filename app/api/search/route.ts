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
  const results = searchDrugs(q, limit).map(drug => ({
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
    results,
    count: results.length,
  });
}
