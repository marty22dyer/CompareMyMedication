import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const drug = searchParams.get("drug");
  if (!drug) return NextResponse.json({ error: "Missing drug" }, { status: 400 });

  const res = await fetch(
    `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(drug)}` 
  );

  const data = await res.json();
  return NextResponse.json(data);
}
