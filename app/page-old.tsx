const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CompareMyMedication",
  url: "https://comparemymedication.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://comparemymedication.com/compare?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

import SearchBox from "../components/SearchBox";

export default function Home() {
  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Hero Section */}
        <section className="cmm-hero">
        <div className="cmm-hero__inner">
          <h1 className="cmm-h1">Compare medications, generics & alternatives</h1>
          <p className="cmm-sub">
            Informational tool only; not medical advice. Always consult a healthcare professional.
          </p>
          <SearchBox />
          <div className="cmm-chips">
            <a className="cmm-chip" href="/drug/ozempic">
              <span className="cmm-chip__dot" aria-hidden="true"></span>
              <span>Ozempic</span>
            </a>
            <a className="cmm-chip" href="/drug/wegovy">
              <span className="cmm-chip__dot" aria-hidden="true"></span>
              <span>Wegovy</span>
            </a>
            <a className="cmm-chip" href="/drug/adderall">
              <span className="cmm-chip__dot" aria-hidden="true"></span>
              <span>Adderall</span>
            </a>
            <a className="cmm-chip" href="/drug/vyvanse">
              <span className="cmm-chip__dot" aria-hidden="true"></span>
              <span>Vyvanse</span>
            </a>
          </div>
        </div>
      </section>

      <section className="cardsWrap">
  <div className="cards">
    <article className="card">
      <h3>Find Generic<br/>Medications</h3>
      <p>See cheaper, equivalent<br/>generic versions of brand-<br/>name drugs.</p>
      <div className="cardArt" aria-hidden="true">💊</div>
      <a className="cardBtn" href="/compare">View Options</a>
    </article>

    <article className="card">
      <h3>Compare Similar<br/>Drugs</h3>
      <p>Review alternative<br/>medications with similar<br/>uses and effects.</p>
      <div className="cardArt" aria-hidden="true">🧪</div>
      <a className="cardBtn" href="/compare">View Options</a>
    </article>

    <article className="card">
      <h3>Compare<br/>Medication Costs</h3>
      <p>Compare typical costs<br/>of brand-name and generic<br/>drugs.</p>
      <div className="cardArt" aria-hidden="true">💵</div>
      <a className="cardBtn" href="/compare">View Options</a>
    </article>
  </div>
</section>

<section className="popular">
  <div className="popularInner">
    <h2 className="sectionTitle">Popular Drug Comparisons</h2>
    <p>See how these commonly compared medications stack up.</p>

    <div className="popularGrid">
      <div className="popBox">
        <a className="popItem" href="/compare/adderall-vs-vyvanse">💊 Adderall <span>vs</span> Vyvanse</a>
        <div className="popDiv" />
        <a className="popItem" href="/compare/zoloft-vs-lexapro">⚪ Zoloft <span>vs</span> Lexapro</a>
      </div>

      <div className="popBox">
        <a className="popItem" href="/compare/ozempic-vs-wegovy">🧪 Ozempic <span>vs</span> Wegovy</a>
        <div className="popDiv" />
        <a className="popItem" href="/compare/zoloft-vs-lexapro">🟢 Zoloft <span>vs</span> Lexapro</a>
      </div>

      <div className="popBox">
        <a className="popItem" href="/drug/ozempic/generic">✅ Generic for Ozempic</a>
      </div>

      <div className="popBox">
        <a className="popItem" href="/drug/wegovy/generic">💊 Generic for Wegovy</a>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="cmm-footer">
        <p className="cmm-footer__disclaimer">
          This tool provides general information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
        <div className="cmm-footer__links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="#">Contact</a>
          <a href="#">About</a>
        </div>
        <p className="cmm-footer__copy">
          © 2024 CompareMyMedication. All rights reserved.
        </p>
      </footer>
      </main>
    </>
  );
}
