import { NextResponse } from "next/server";

const SITE = "https://comparemymedication.com";

export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
