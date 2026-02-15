import { NextResponse } from "next/server";
import { allCompareSlugs } from "../../../../lib/compare";

export async function GET() {
  const slugs = allCompareSlugs();
  return NextResponse.json({ count: slugs.length, slugs });
}
