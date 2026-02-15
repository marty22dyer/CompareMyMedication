import { NextResponse } from "next/server";
import { bySlug } from "../../../../lib/drugs";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const drug = bySlug(params.slug);
  if (!drug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(drug, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
