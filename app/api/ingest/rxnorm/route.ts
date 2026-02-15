import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const res = await fetch(
    `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(name)}` 
  );

  const data = await res.json();
  return NextResponse.json(data);
}
