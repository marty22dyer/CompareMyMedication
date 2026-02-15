import { NextResponse } from "next/server";
import { bySlug } from "../../../lib/drugs";

function canonicalPair(a: string, b: string) {
  const canon = [a.trim().toLowerCase(), b.trim().toLowerCase()].sort();
  return { a: canon[0], b: canon[1], slug: `${canon[0]}-vs-${canon[1]}` };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const aRaw = searchParams.get("a") || "";
  const bRaw = searchParams.get("b") || "";

  if (!aRaw || !bRaw) {
    return NextResponse.json(
      { error: "Missing query params: a and b" },
      { status: 400 }
    );
  }

  const { a, b, slug } = canonicalPair(aRaw, bRaw);

  const A = bySlug(a);
  const B = bySlug(b);

  if (!A || !B) {
    return NextResponse.json(
      { error: "Unknown drug slug(s). Add them to lib/drugs.ts", a, b },
      { status: 404 }
    );
  }

  const sameClass = A.class && B.class && A.class === B.class;
  const genericSame = A.generic === B.generic;

  // simple structured comparison object
  const result = {
    slug,
    a: {
      slug: A.slug,
      name: A.name,
      generic: A.generic,
      class: A.class,
      usedFor: A.usedFor,
    },
    b: {
      slug: B.slug,
      name: B.name,
      generic: B.generic,
      class: B.class,
      usedFor: B.usedFor,
    },
    summary: {
      sameClass,
      genericSame,
      keyDifferences: [
        { field: "generic", a: A.generic || null, b: B.generic || null },
        { field: "class", a: A.class || null, b: B.class || null },
        { field: "usedFor", a: A.usedFor?.slice(0, 5) || [], b: B.usedFor?.slice(0, 5) || [] },
      ],
      disclaimer:
        "Informational only; not medical advice. Consult a healthcare professional.",
    },
  };

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, max-age=3600", // 1 hour
    },
  });
}
