import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug } from "../../../lib/drugs";
import Breadcrumbs from "../../../components/Breadcrumbs";

function canonCompare(a: string, b: string) {
  return [a, b].sort().join("-vs-");
}

export default function DrugPage({ params }: { params: { slug: string } }) {
  const drug = bySlug(params.slug);
  if (!drug) return notFound();

  const alts = (drug.alternatives ?? [])
    .map((s) => bySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof bySlug>>[];

  return (
    <main className="comparePage">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: drug.name }
        ]}
      />
      
      {/* SAME HERO STYLE AS COMPARE */}
      <section className="compareHero">
        <h1 className="compareH1">{drug.name}</h1>
        <p className="compareSub">
          Informational tool only; not medical advice. Always consult a healthcare professional.
        </p>

        <div className="compareTopLinks">
          <Link className="comparePill" href="/compare">
            Browse comparisons
          </Link>

          {alts.length > 0 ? (
            <Link
              className="comparePill"
              href={`/compare/${canonCompare(drug.slug, alts[0].slug)}`}
            >
              Compare {drug.name}
            </Link>
          ) : null}
        </div>
      </section>

      {/* SAME BODY STYLE AS COMPARE */}
      <section className="compareBody">
        <div className="cmpTable">
          <div className="cmpHeader">
            <div />
            <div className="cmpHeadCell">{drug.name}</div>
            <div className="cmpHeadCell">Details</div>
          </div>

          <div className="cmpRow">
            <div className="cmpLabel">Generic</div>
            <div className="cmpCell">{drug.generic || "—"}</div>
            <div className="cmpCell">Non-brand name</div>
          </div>

          <div className="cmpRow">
            <div className="cmpLabel">Class</div>
            <div className="cmpCell">{drug.class || "—"}</div>
            <div className="cmpCell">Drug class</div>
          </div>

          <div className="cmpRow">
            <div className="cmpLabel">Category</div>
            <div className="cmpCell">{drug.category || "—"}</div>
            <div className="cmpCell">Therapeutic area</div>
          </div>
        </div>

        {/* Alternatives (styled like pills/buttons) */}
        {alts.length > 0 ? (
          <>
            <h2>Alternatives</h2>
            <div className="compareTopLinks">
              {alts.map((a) => (
                <Link key={a.slug} className="comparePill" href={`/drug/${a.slug}`}>
                  {a.name}
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {/* FDA label sections (only when present) */}
        {drug.label?.indications?.length ? (
          <>
            <h2>What is {drug.name} used for?</h2>
            <p className="compareP">{drug.label.indications[0]}</p>
          </>
        ) : null}

        {drug.label?.warnings?.length ? (
          <>
            <h2>Warnings</h2>
            <p className="compareP">{drug.label.warnings[0]}</p>
          </>
        ) : null}
      </section>
      
      <a href="#top" className="back-to-top" aria-label="Back to top">
        ↑
      </a>
    </main>
  );
}
