"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { drugs, type Drug } from "../../../lib/drugs";
import "./category-styles.css";

const CATEGORY_CONFIG: Record<string, {
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  keywords: string[];
  classes: string[];
  categories: string[];
  featuredSlugs: string[];
  faqs: { q: string; a: string }[];
}> = {
  "diabetes-medications": {
    name: "Diabetes Medications",
    icon: "🩸",
    description: "Compare diabetes medications including insulin, GLP-1 agonists, metformin, and more. Find the most effective and affordable options for managing blood sugar.",
    color: "#e53e3e",
    gradient: "linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)",
    keywords: ["diabetes", "blood sugar", "insulin", "glucose"],
    classes: ["biguanide", "GLP-1 agonist", "SGLT2 inhibitor", "DPP-4 inhibitor", "sulfonylurea", "insulin", "thiazolidinedione"],
    categories: ["diabetes"],
    featuredSlugs: ["metformin", "ozempic", "wegovy", "jardiance", "januvia", "trulicity", "victoza", "farxiga"],
    faqs: [
      { q: "What is the most commonly prescribed diabetes medication?", a: "Metformin is the most commonly prescribed first-line medication for type 2 diabetes. It's affordable, effective, and has a long safety record." },
      { q: "How do GLP-1 agonists like Ozempic work?", a: "GLP-1 agonists mimic a natural hormone that stimulates insulin release, suppresses glucagon, and slows digestion — helping lower blood sugar and often causing weight loss." },
      { q: "Can I switch between diabetes medications?", a: "Always consult your doctor before switching medications. Different drugs work through different mechanisms and your doctor will consider your full health picture." },
    ],
  },
  "weight-loss-drugs": {
    name: "Weight Loss Drugs",
    icon: "⚖️",
    description: "Compare FDA-approved weight loss medications including GLP-1 agonists, appetite suppressants, and more. Find options that fit your health goals and budget.",
    color: "#38a169",
    gradient: "linear-gradient(135deg, #68d391 0%, #38a169 100%)",
    keywords: ["weight loss", "obesity", "appetite", "GLP-1"],
    classes: ["GLP-1 agonist", "appetite suppressant", "lipase inhibitor"],
    categories: ["weight-loss", "obesity"],
    featuredSlugs: ["ozempic", "wegovy", "zepbound", "saxenda", "qsymia", "contrave", "phentermine"],
    faqs: [
      { q: "What is the most effective prescription weight loss medication?", a: "GLP-1 agonists like Wegovy (semaglutide) and Zepbound (tirzepatide) have shown the highest weight loss results in clinical trials, with patients losing 15-22% of body weight." },
      { q: "Is Ozempic the same as Wegovy?", a: "Both contain semaglutide, but Wegovy is FDA-approved specifically for weight loss at a higher dose, while Ozempic is approved for type 2 diabetes." },
      { q: "Are weight loss medications covered by insurance?", a: "Coverage varies widely. Many insurers cover diabetes medications like Ozempic but not weight-loss-specific drugs like Wegovy. Check with your insurer and ask your doctor about alternatives." },
    ],
  },
  "adhd-medications": {
    name: "ADHD Medications",
    icon: "🧠",
    description: "Compare ADHD medications including stimulants like Adderall and Vyvanse, and non-stimulants like Strattera. Find the right treatment for focus and attention.",
    color: "#805ad5",
    gradient: "linear-gradient(135deg, #b794f4 0%, #805ad5 100%)",
    keywords: ["ADHD", "attention", "focus", "stimulant"],
    classes: ["CNS stimulant", "SNRI", "alpha-2 agonist"],
    categories: ["adhd"],
    featuredSlugs: ["adderall", "vyvanse", "ritalin", "concerta", "strattera", "intuniv", "methylphenidate", "lisdexamfetamine"],
    faqs: [
      { q: "What is the difference between Adderall and Vyvanse?", a: "Both treat ADHD but Vyvanse is a prodrug (converted to active form in the body), which may provide smoother, longer-lasting effects and lower abuse potential than Adderall." },
      { q: "Are there non-stimulant ADHD medications?", a: "Yes — Strattera (atomoxetine), Intuniv (guanfacine), and Kapvay (clonidine) are non-stimulant options that work differently and may be preferred for some patients." },
      { q: "How long do ADHD medications last?", a: "Immediate-release formulas last 4-6 hours. Extended-release versions like Vyvanse, Concerta, and Adderall XR can last 10-14 hours." },
    ],
  },
  "depression-anxiety": {
    name: "Depression & Anxiety",
    icon: "💭",
    description: "Compare antidepressants and anti-anxiety medications including SSRIs, SNRIs, and benzodiazepines. Find the right treatment for mental health support.",
    color: "#3182ce",
    gradient: "linear-gradient(135deg, #63b3ed 0%, #3182ce 100%)",
    keywords: ["depression", "anxiety", "SSRI", "SNRI", "antidepressant"],
    classes: ["SSRI", "SNRI", "NDRI", "benzodiazepine", "tetracyclic antidepressant", "anxiolytic"],
    categories: ["depression", "anxiety"],
    featuredSlugs: ["lexapro", "zoloft", "prozac", "wellbutrin", "cymbalta", "xanax", "ativan", "buspar", "escitalopram", "sertraline"],
    faqs: [
      { q: "What is the most prescribed antidepressant?", a: "SSRIs like sertraline (Zoloft) and escitalopram (Lexapro) are the most commonly prescribed due to their effectiveness and relatively mild side effect profile." },
      { q: "How long does it take for antidepressants to work?", a: "Most antidepressants take 4-6 weeks to reach full effectiveness. Some patients notice improvements in sleep and energy within 1-2 weeks." },
      { q: "What is the difference between SSRIs and SNRIs?", a: "SSRIs target serotonin only, while SNRIs target both serotonin and norepinephrine. SNRIs may be more effective for anxiety and chronic pain in addition to depression." },
    ],
  },
  "blood-pressure": {
    name: "Blood Pressure",
    icon: "❤️",
    description: "Compare blood pressure medications including ACE inhibitors, ARBs, beta-blockers, and calcium channel blockers. Find affordable options to manage hypertension.",
    color: "#e53e3e",
    gradient: "linear-gradient(135deg, #feb2b2 0%, #e53e3e 100%)",
    keywords: ["blood pressure", "hypertension", "ACE inhibitor", "ARB"],
    classes: ["ACE inhibitor", "ARB", "beta-blocker", "calcium channel blocker", "thiazide diuretic", "loop diuretic"],
    categories: ["blood-pressure", "hypertension"],
    featuredSlugs: ["lisinopril", "losartan", "amlodipine", "metoprolol", "atenolol", "hydrochlorothiazide", "valsartan", "ramipril"],
    faqs: [
      { q: "What is the most commonly prescribed blood pressure medication?", a: "Lisinopril (an ACE inhibitor) is one of the most prescribed blood pressure medications due to its effectiveness, low cost, and once-daily dosing." },
      { q: "Can I take generic blood pressure medications?", a: "Yes — most blood pressure medications have affordable generic versions that are equally effective. Generics can save 50-80% compared to brand names." },
      { q: "Do I need to take blood pressure medication forever?", a: "Many people need long-term treatment, but lifestyle changes (diet, exercise, weight loss) can sometimes allow dose reduction. Never stop without consulting your doctor." },
    ],
  },
  "cholesterol": {
    name: "Cholesterol",
    icon: "📊",
    description: "Compare cholesterol-lowering medications including statins, fibrates, and newer options. Find the most effective treatment to reduce cardiovascular risk.",
    color: "#d69e2e",
    gradient: "linear-gradient(135deg, #f6e05e 0%, #d69e2e 100%)",
    keywords: ["cholesterol", "statin", "LDL", "triglycerides"],
    classes: ["statin", "fibrate", "bile acid sequestrant", "PCSK9 inhibitor"],
    categories: ["cholesterol"],
    featuredSlugs: ["lipitor", "crestor", "zocor", "pravachol", "rosuvastatin", "atorvastatin", "simvastatin", "lovastatin"],
    faqs: [
      { q: "What is the strongest statin medication?", a: "Rosuvastatin (Crestor) and atorvastatin (Lipitor) are among the most potent statins, capable of reducing LDL cholesterol by 50-60%." },
      { q: "Are generic statins as effective as brand name?", a: "Yes — generic atorvastatin and rosuvastatin are identical to Lipitor and Crestor and cost a fraction of the price." },
      { q: "What are the side effects of statins?", a: "The most common side effect is muscle aches (myalgia). Serious side effects are rare. Your doctor may adjust your dose or switch medications if side effects occur." },
    ],
  },
  "pain-relief": {
    name: "Pain Relief",
    icon: "💊",
    description: "Compare pain relief medications including NSAIDs, opioids, and nerve pain treatments. Find safe and effective options for acute and chronic pain management.",
    color: "#dd6b20",
    gradient: "linear-gradient(135deg, #fbd38d 0%, #dd6b20 100%)",
    keywords: ["pain", "NSAID", "opioid", "analgesic"],
    classes: ["NSAID", "opioid", "anticonvulsant", "muscle relaxant", "COX-2 inhibitor"],
    categories: ["pain"],
    featuredSlugs: ["ibuprofen", "naproxen", "tramadol", "gabapentin", "lyrica", "meloxicam", "celebrex", "tylenol"],
    faqs: [
      { q: "What is the safest over-the-counter pain reliever?", a: "Acetaminophen (Tylenol) is generally considered safest for most people when used as directed. NSAIDs like ibuprofen are effective but can affect the stomach and kidneys." },
      { q: "What is the difference between ibuprofen and naproxen?", a: "Both are NSAIDs but naproxen lasts longer (8-12 hours vs 4-6 hours for ibuprofen). Naproxen may be better for chronic pain while ibuprofen works faster for acute pain." },
      { q: "Are opioid pain medications addictive?", a: "Opioids carry a risk of dependence and addiction. They are typically reserved for severe pain when other treatments have failed, and should be used under close medical supervision." },
    ],
  },
  "antibiotics": {
    name: "Antibiotics",
    icon: "🦠",
    description: "Compare antibiotic medications for bacterial infections. Find the right antibiotic for your condition and understand differences in spectrum and side effects.",
    color: "#2f855a",
    gradient: "linear-gradient(135deg, #9ae6b4 0%, #2f855a 100%)",
    keywords: ["antibiotic", "bacterial", "infection", "penicillin"],
    classes: ["penicillin", "macrolide", "fluoroquinolone", "cephalosporin", "tetracycline", "sulfonamide"],
    categories: ["antibiotic", "antibiotics"],
    featuredSlugs: ["amoxicillin", "azithromycin", "doxycycline", "ciprofloxacin", "augmentin", "cephalexin", "clindamycin", "trimethoprim"],
    faqs: [
      { q: "What is the most commonly prescribed antibiotic?", a: "Amoxicillin is one of the most prescribed antibiotics for common infections like ear infections, strep throat, and respiratory infections." },
      { q: "What is the difference between amoxicillin and azithromycin?", a: "Amoxicillin is a penicillin-type antibiotic taken multiple times daily. Azithromycin (Z-Pack) is a macrolide taken once daily for 5 days, often used for atypical infections." },
      { q: "Should I always finish my antibiotic course?", a: "Yes — always complete the full course even if you feel better. Stopping early can allow bacteria to survive and develop resistance." },
    ],
  },
  "heart-medications": {
    name: "Heart Medications",
    icon: "💗",
    description: "Compare heart medications including anticoagulants, antiarrhythmics, and heart failure treatments. Understand your options for cardiovascular health.",
    color: "#c53030",
    gradient: "linear-gradient(135deg, #fc8181 0%, #c53030 100%)",
    keywords: ["heart", "cardiac", "anticoagulant", "arrhythmia"],
    classes: ["anticoagulant", "antiplatelet", "antiarrhythmic", "cardiac glycoside", "nitrate"],
    categories: ["heart", "blood-thinner", "cardiac"],
    featuredSlugs: ["eliquis", "xarelto", "warfarin", "plavix", "digoxin", "amiodarone", "apixaban", "rivaroxaban"],
    faqs: [
      { q: "What is the difference between Eliquis and Xarelto?", a: "Both are newer anticoagulants (blood thinners) that don't require regular blood monitoring like warfarin. Eliquis is taken twice daily; Xarelto once daily. Your doctor will choose based on your specific condition." },
      { q: "Is warfarin still used?", a: "Yes — warfarin is still widely used, especially for mechanical heart valves. It requires regular INR monitoring but is very effective and inexpensive." },
      { q: "Can heart medications interact with other drugs?", a: "Yes — heart medications have many potential interactions. Always tell your doctor and pharmacist about all medications, supplements, and vitamins you take." },
    ],
  },
  "thyroid": {
    name: "Thyroid",
    icon: "🔬",
    description: "Compare thyroid medications for hypothyroidism and hyperthyroidism. Find the right levothyroxine dose or alternative thyroid hormone replacement therapy.",
    color: "#6b46c1",
    gradient: "linear-gradient(135deg, #d6bcfa 0%, #6b46c1 100%)",
    keywords: ["thyroid", "hypothyroidism", "levothyroxine", "TSH"],
    classes: ["thyroid hormone", "antithyroid"],
    categories: ["thyroid"],
    featuredSlugs: ["levothyroxine", "synthroid", "armour-thyroid", "cytomel", "methimazole", "levoxyl"],
    faqs: [
      { q: "Is Synthroid better than generic levothyroxine?", a: "Both contain the same active ingredient. Some patients prefer brand-name Synthroid for consistency, but generic levothyroxine is equally effective and much cheaper for most people." },
      { q: "How long does it take for thyroid medication to work?", a: "It typically takes 6-8 weeks to see the full effect of a thyroid medication dose. Your doctor will check TSH levels and adjust as needed." },
      { q: "When should I take my thyroid medication?", a: "Most thyroid medications should be taken on an empty stomach, 30-60 minutes before breakfast, for best absorption. Avoid calcium, iron, and antacids within 4 hours." },
    ],
  },
  "asthma-copd": {
    name: "Asthma & COPD",
    icon: "🫁",
    description: "Compare inhalers and medications for asthma and COPD including bronchodilators, corticosteroids, and combination therapies. Breathe easier with the right treatment.",
    color: "#2b6cb0",
    gradient: "linear-gradient(135deg, #90cdf4 0%, #2b6cb0 100%)",
    keywords: ["asthma", "COPD", "inhaler", "bronchodilator"],
    classes: ["beta-2 agonist", "corticosteroid", "leukotriene receptor antagonist", "anticholinergic", "LABA", "SABA"],
    categories: ["asthma", "copd", "respiratory"],
    featuredSlugs: ["albuterol", "advair", "symbicort", "spiriva", "singulair", "flovent", "montelukast", "budesonide"],
    faqs: [
      { q: "What is the difference between a rescue inhaler and a controller inhaler?", a: "Rescue inhalers (like albuterol) provide quick relief during an attack. Controller inhalers (like Flovent or Advair) are taken daily to prevent symptoms and reduce inflammation." },
      { q: "Is Advair better than Symbicort?", a: "Both are combination inhalers (corticosteroid + long-acting bronchodilator). They're similarly effective; the choice often comes down to cost, insurance coverage, and personal preference." },
      { q: "Can asthma medications be used for COPD?", a: "Some overlap exists — bronchodilators are used for both. However, COPD treatment often emphasizes long-acting bronchodilators differently than asthma treatment." },
    ],
  },
  "birth-control": {
    name: "Birth Control",
    icon: "💊",
    description: "Compare birth control options including combination pills, progestin-only pills, patches, and rings. Find the right contraceptive for your lifestyle and health needs.",
    color: "#d53f8c",
    gradient: "linear-gradient(135deg, #fbb6ce 0%, #d53f8c 100%)",
    keywords: ["birth control", "contraceptive", "estrogen", "progestin"],
    classes: ["combined oral contraceptive", "progestin-only", "hormonal contraceptive"],
    categories: ["birth-control", "contraceptive"],
    featuredSlugs: ["yaz", "lo-loestrin", "ortho-tri-cyclen", "nuvaring", "nexplanon", "mirena", "sprintec", "norethindrone"],
    faqs: [
      { q: "What is the most effective birth control pill?", a: "When taken correctly, all combination birth control pills are over 99% effective. The best pill depends on your health history, side effect tolerance, and convenience preferences." },
      { q: "What is the difference between combination and progestin-only pills?", a: "Combination pills contain estrogen and progestin. Progestin-only pills (mini-pills) are an option for those who can't take estrogen, such as breastfeeding mothers or those with certain health conditions." },
      { q: "Can birth control pills cause weight gain?", a: "Modern low-dose pills rarely cause significant weight gain. Some people experience minor fluid retention initially, but large weight changes are not typically caused by the pill itself." },
    ],
  },
};

function getDrugsForCategory(slug: string): Drug[] {
  const config = CATEGORY_CONFIG[slug];
  if (!config) return [];

  const seen = new Set<string>();
  const results: Drug[] = [];

  // First add featured slugs in order
  for (const featuredSlug of config.featuredSlugs) {
    const drug = drugs.find(d => d.slug === featuredSlug);
    if (drug && !seen.has(drug.slug)) {
      seen.add(drug.slug);
      results.push(drug);
    }
  }

  // Then add drugs matching category or class
  for (const drug of drugs) {
    if (seen.has(drug.slug)) continue;
    const matchesCategory = drug.category && config.categories.some(c =>
      drug.category!.toLowerCase().includes(c.toLowerCase())
    );
    const matchesClass = drug.class && config.classes.some(c =>
      drug.class!.toLowerCase().includes(c.toLowerCase())
    );
    const matchesKeyword = drug.usedFor && config.keywords.some(kw =>
      drug.usedFor!.some(u => u.toLowerCase().includes(kw.toLowerCase()))
    );
    if (matchesCategory || matchesClass || matchesKeyword) {
      seen.add(drug.slug);
      results.push(drug);
    }
  }

  return results.slice(0, 30);
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const config = CATEGORY_CONFIG[params.slug];
  if (!config) return notFound();

  const categoryDrugs = getDrugsForCategory(params.slug);

  return (
    <div className="cat-page">
      {/* Hero */}
      <div className="cat-hero" style={{ background: config.gradient }}>
        <div className="cat-hero-inner">
          <div className="cat-hero-icon">{config.icon}</div>
          <h1 className="cat-hero-title">{config.name}</h1>
          <p className="cat-hero-desc">{config.description}</p>
          <div className="cat-hero-stats">
            <div className="cat-hero-stat">
              <span className="cat-hero-stat-num">{categoryDrugs.length}+</span>
              <span className="cat-hero-stat-label">Medications</span>
            </div>
            <div className="cat-hero-stat">
              <span className="cat-hero-stat-num">FDA</span>
              <span className="cat-hero-stat-label">Verified Data</span>
            </div>
            <div className="cat-hero-stat">
              <span className="cat-hero-stat-num">Free</span>
              <span className="cat-hero-stat-label">No Sign-up</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cat-body">
        {/* Breadcrumb */}
        <div className="cat-breadcrumb">
          <Link href="/" className="cat-breadcrumb-link">Home</Link>
          <span className="cat-breadcrumb-sep">›</span>
          <span className="cat-breadcrumb-current">{config.name}</span>
        </div>

        {/* Drug Grid */}
        <section className="cat-section">
          <h2 className="cat-section-title">
            {config.icon} {config.name} Medications
          </h2>
          <p className="cat-section-sub">
            Click any medication to view full details, pricing, side effects, and comparisons.
          </p>

          {categoryDrugs.length > 0 ? (
            <div className="cat-drug-grid">
              {categoryDrugs.map((drug) => (
                <Link key={drug.slug} href={`/drug/${drug.slug}`} className="cat-drug-card">
                  <div className="cat-drug-card-top">
                    <div className="cat-drug-icon">{config.icon}</div>
                    <div className="cat-drug-info">
                      <h3 className="cat-drug-name">{drug.name}</h3>
                      {drug.generic && drug.generic !== drug.name.toLowerCase() && (
                        <p className="cat-drug-generic">Generic: {drug.generic}</p>
                      )}
                    </div>
                  </div>
                  {drug.class && (
                    <span className="cat-drug-class">{drug.class}</span>
                  )}
                  {drug.usedFor && drug.usedFor.length > 0 && (
                    <p className="cat-drug-used">
                      {drug.usedFor.slice(0, 2).join(" • ")}
                    </p>
                  )}
                  {drug.goodrxData?.current_price && (
                    <div className="cat-drug-price">
                      From ${Math.round(drug.goodrxData.current_price * 0.3)}/mo
                    </div>
                  )}
                  <div className="cat-drug-cta">View Details →</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cat-empty">
              <p>We're adding more medications to this category soon. <Link href="/">Search all medications →</Link></p>
            </div>
          )}
        </section>

        {/* Compare CTA */}
        <section className="cat-compare-cta">
          <div className="cat-compare-cta-inner" style={{ background: config.gradient }}>
            <h2>Compare {config.name}</h2>
            <p>See which medication is right for you with our side-by-side comparison tool.</p>
            <Link href="/?mode=compare" className="cat-compare-btn">
              Compare Two Drugs →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        {config.faqs.length > 0 && (
          <section className="cat-section">
            <h2 className="cat-section-title">❓ Frequently Asked Questions</h2>
            <div className="cat-faq-list">
              {config.faqs.map((faq, i) => (
                <div key={i} className="cat-faq-item">
                  <h3 className="cat-faq-q">{faq.q}</h3>
                  <p className="cat-faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back to categories */}
        <div className="cat-back">
          <Link href="/" className="cat-back-link">← Back to all categories</Link>
        </div>
      </div>
    </div>
  );
}
