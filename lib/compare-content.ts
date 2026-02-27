// Rich SEO content for top comparison pages
// Each entry has an overview, key differences, and recommendation section

export type CompareContent = {
  overview: string;
  keyPoints: string[];
  recommendation: string;
  faq: { q: string; a: string }[];
};

const content: Record<string, CompareContent> = {
  "ozempic-vs-wegovy": {
    overview: `Ozempic and Wegovy are both brand-name medications containing semaglutide, a GLP-1 receptor agonist manufactured by Novo Nordisk. Despite sharing the same active ingredient, they are FDA-approved for different conditions and come in different doses. Ozempic was approved in 2017 for type 2 diabetes management and cardiovascular risk reduction, while Wegovy received FDA approval in 2021 specifically for chronic weight management in adults with obesity or overweight with at least one weight-related condition. Both medications work by mimicking the GLP-1 hormone to regulate blood sugar, slow gastric emptying, and reduce appetite — but Wegovy is prescribed at a higher maximum dose (2.4 mg weekly) compared to Ozempic (2 mg weekly), which contributes to its greater average weight loss outcomes in clinical trials.`,
    keyPoints: [
      "Same active ingredient (semaglutide) — different FDA-approved uses",
      "Wegovy approved for weight loss; Ozempic approved for type 2 diabetes",
      "Wegovy max dose is 2.4 mg/week; Ozempic max dose is 2 mg/week",
      "Clinical trials show Wegovy produces ~15% average body weight loss vs ~6% for Ozempic",
      "Both are weekly subcutaneous injections with similar side effect profiles",
      "Ozempic is often covered by insurance for diabetes; Wegovy coverage varies",
    ],
    recommendation: `If your primary goal is weight loss and you do not have type 2 diabetes, Wegovy is the FDA-approved choice. If you have type 2 diabetes and also want to benefit from weight loss effects, Ozempic is typically prescribed and may have better insurance coverage. Some doctors prescribe Ozempic off-label for weight loss when Wegovy is unavailable or unaffordable. Always discuss your specific health goals with your doctor before choosing between these medications.`,
    faq: [
      { q: "Is Ozempic the same as Wegovy?", a: "They contain the same active ingredient (semaglutide) but are different products approved for different uses. Wegovy is dosed higher and is specifically FDA-approved for weight loss, while Ozempic is approved for type 2 diabetes." },
      { q: "Which causes more weight loss, Ozempic or Wegovy?", a: "Wegovy typically produces greater weight loss — about 15% of body weight on average compared to 6-8% with Ozempic — largely because it is prescribed at a higher dose." },
      { q: "Can I use Ozempic for weight loss instead of Wegovy?", a: "Some doctors prescribe Ozempic off-label for weight loss, but Wegovy is the FDA-approved option for this use. Insurance coverage may differ based on the indication." },
      { q: "What are the side effects of Ozempic vs Wegovy?", a: "Both have similar side effects since they share the same active ingredient: nausea, vomiting, diarrhea, constipation, and stomach pain are most common. These are usually mild and improve over time." },
    ],
  },

  "adderall-vs-vyvanse": {
    overview: `Adderall and Vyvanse are both central nervous system stimulants prescribed for ADHD (Attention-Deficit/Hyperactivity Disorder) and are among the most commonly prescribed medications for this condition. Adderall contains a mixture of amphetamine salts (75% dextroamphetamine and 25% levoamphetamine) and is available in both immediate-release (IR) and extended-release (XR) formulations. Vyvanse contains lisdexamfetamine, a prodrug that is converted to dextroamphetamine in the body, providing a smoother onset and longer duration of action lasting up to 14 hours. Vyvanse is also FDA-approved for binge eating disorder in adults, making it unique among ADHD stimulants. While both are Schedule II controlled substances, Vyvanse carries a lower potential for abuse due to its prodrug mechanism — it must be metabolized before becoming active.`,
    keyPoints: [
      "Adderall contains mixed amphetamine salts; Vyvanse contains lisdexamfetamine (prodrug)",
      "Vyvanse lasts 10-14 hours; Adderall IR lasts 4-6 hours; Adderall XR lasts 8-12 hours",
      "Vyvanse has lower abuse potential due to its prodrug design",
      "Adderall has a generic (amphetamine salts) — significantly cheaper; Vyvanse recently went generic",
      "Vyvanse is also FDA-approved for binge eating disorder",
      "Both are Schedule II controlled substances requiring a prescription",
    ],
    recommendation: `For most adults seeking all-day coverage with smoother onset and offset, Vyvanse is often preferred. For children or patients who need flexible dosing or shorter duration, Adderall IR offers more control. Cost is a major factor — generic Adderall is significantly cheaper than brand-name Vyvanse, though Vyvanse generics are now available. Your doctor will consider your specific ADHD symptom pattern, lifestyle, and history of substance use when choosing between these medications.`,
    faq: [
      { q: "Is Vyvanse stronger than Adderall?", a: "They are not directly comparable in strength. Vyvanse is a prodrug that converts to dextroamphetamine, while Adderall is a mixed amphetamine salt. Vyvanse's effects are generally described as smoother and longer-lasting rather than stronger." },
      { q: "Which is better for ADHD, Adderall or Vyvanse?", a: "Both are effective FDA-approved treatments for ADHD. Vyvanse is often preferred for its longer duration and lower abuse potential. Adderall IR offers more dosing flexibility. Your doctor will determine which suits you best." },
      { q: "Is there a generic for Vyvanse?", a: "Yes, generic lisdexamfetamine became available in 2023, making it significantly more affordable than brand-name Vyvanse." },
      { q: "Can you take Adderall and Vyvanse together?", a: "No. Taking two stimulant medications simultaneously is not recommended and can cause dangerous cardiovascular effects. Only take these as prescribed by your doctor." },
    ],
  },

  "zoloft-vs-lexapro": {
    overview: `Zoloft (sertraline) and Lexapro (escitalopram) are both selective serotonin reuptake inhibitors (SSRIs) and are among the most widely prescribed antidepressants in the United States. Both work by blocking the reabsorption of serotonin in the brain, increasing serotonin availability in the synaptic cleft. Zoloft is FDA-approved for depression, panic disorder, OCD, PTSD, social anxiety disorder, and premenstrual dysphoric disorder (PMDD). Lexapro is FDA-approved for depression and generalized anxiety disorder (GAD). Both have generic versions available, making them affordable options. Head-to-head studies suggest Lexapro may have a slight edge in tolerability with fewer drug interactions, while Zoloft is often preferred for PTSD and OCD. Both typically take 4-6 weeks to reach full therapeutic effect.`,
    keyPoints: [
      "Both are SSRIs — same mechanism of action, different molecular structures",
      "Zoloft approved for 6 conditions; Lexapro approved for depression and GAD",
      "Lexapro has fewer drug interactions and is considered highly selective",
      "Both have affordable generics (sertraline and escitalopram)",
      "Lexapro may cause slightly less nausea; Zoloft may cause more GI upset initially",
      "Typical onset of effect: 4-6 weeks for both medications",
    ],
    recommendation: `Lexapro is often considered a first-line choice for generalized anxiety disorder and depression due to its clean interaction profile and good tolerability. Zoloft is strongly preferred for PTSD, OCD, and PMDD due to specific FDA approvals and clinical trial data. Both are effective and affordable with generics available. The best choice depends on your specific diagnosis, other medications you take, and how you respond to treatment. Many patients try one before the other.`,
    faq: [
      { q: "Is Lexapro or Zoloft better for anxiety?", a: "Both are effective for anxiety. Lexapro is FDA-approved specifically for generalized anxiety disorder, while Zoloft is approved for social anxiety, panic disorder, and PTSD. For general anxiety, either can be appropriate first-line treatment." },
      { q: "Which has fewer side effects, Zoloft or Lexapro?", a: "Lexapro is generally considered to have a slightly better tolerability profile with fewer drug interactions. Zoloft may cause more initial GI side effects. Both have similar overall side effect rates." },
      { q: "Can I switch from Zoloft to Lexapro?", a: "Yes, switching is common and can be done under medical supervision. Your doctor will guide the transition to minimize discontinuation symptoms and ensure a safe switch." },
      { q: "How long do Zoloft and Lexapro take to work?", a: "Both typically take 2-4 weeks to notice initial effects and 4-8 weeks for full therapeutic benefit. It's important not to stop taking them early if you don't feel immediate results." },
    ],
  },

  "metformin-vs-ozempic": {
    overview: `Metformin and Ozempic (semaglutide) represent two different generations of type 2 diabetes treatment. Metformin is a biguanide that has been the cornerstone of type 2 diabetes management for decades — it's typically the first medication prescribed after diagnosis due to its safety record, low cost, and extensive evidence base. Ozempic is a GLP-1 receptor agonist that was approved in 2017 and works through a completely different mechanism: it mimics the GLP-1 hormone to stimulate insulin release, slow digestion, and significantly reduce appetite. While metformin primarily lowers blood sugar, Ozempic delivers multiple benefits including substantial weight loss (average 6-8% of body weight) and proven cardiovascular risk reduction. Many patients with type 2 diabetes are prescribed both medications together for complementary effects.`,
    keyPoints: [
      "Metformin is oral (pill); Ozempic is a weekly subcutaneous injection",
      "Metformin is generic — costs under $10/month; Ozempic costs $800-1,000/month without insurance",
      "Ozempic produces significant weight loss (6-8% average); metformin is weight-neutral",
      "Ozempic has proven cardiovascular benefits; metformin has some cardiovascular evidence",
      "Metformin is typically first-line; Ozempic often added when A1C goals aren't met",
      "Both can be used together — they have complementary mechanisms",
    ],
    recommendation: `For most newly diagnosed type 2 diabetes patients, metformin is the standard first-line treatment due to its safety, affordability, and decades of evidence. Ozempic is typically added when blood sugar isn't adequately controlled with metformin alone, or when cardiovascular risk reduction and weight loss are priorities. Ozempic's high cost can be a barrier. Your endocrinologist or primary care doctor will guide the best approach based on your A1C levels, cardiovascular health, weight, and insurance coverage.`,
    faq: [
      { q: "Is Ozempic better than metformin for weight loss?", a: "Yes, Ozempic produces significantly more weight loss — an average of 6-8% of body weight — compared to metformin, which is considered weight-neutral or causes only modest weight loss." },
      { q: "Can you take metformin and Ozempic together?", a: "Yes, many patients take both. They work through different mechanisms and are often combined for complementary blood sugar control." },
      { q: "Is metformin cheaper than Ozempic?", a: "Significantly cheaper. Generic metformin costs under $10/month at most pharmacies. Brand-name Ozempic costs $800-1,000/month without insurance coverage." },
      { q: "Which is safer, metformin or Ozempic?", a: "Both have good safety profiles when used appropriately. Metformin has decades of real-world safety data. Ozempic's main risks include GI side effects and a theoretical thyroid cancer risk noted in animal studies. Your doctor will assess which is appropriate for you." },
    ],
  },

  "lipitor-vs-crestor": {
    overview: `Lipitor (atorvastatin) and Crestor (rosuvastatin) are both high-intensity statins prescribed to lower LDL (bad) cholesterol and reduce cardiovascular risk. They are among the most widely prescribed medications in the world. Both work by inhibiting HMG-CoA reductase, the enzyme responsible for cholesterol production in the liver. Crestor is considered more potent on a milligram-for-milligram basis — a 10 mg dose of Crestor roughly matches a 20 mg dose of Lipitor in LDL reduction. Both have proven cardiovascular benefits in large clinical trials, reducing the risk of heart attacks, strokes, and cardiovascular death. Lipitor went generic in 2011 (atorvastatin) and is now extremely affordable, while Crestor went generic in 2016 (rosuvastatin) and is also inexpensive.`,
    keyPoints: [
      "Crestor is more potent — lower doses achieve similar LDL reduction",
      "Both reduce LDL cholesterol by 45-55% at maximum doses",
      "Both have gone generic — atorvastatin and rosuvastatin are very affordable",
      "Lipitor has a longer evidence base; both have proven cardiovascular outcomes data",
      "Crestor has fewer drug interactions than Lipitor",
      "Both carry a small risk of muscle problems (myopathy) — report muscle pain to your doctor",
    ],
    recommendation: `Both are excellent high-intensity statins with strong evidence. Atorvastatin (generic Lipitor) is often the first choice due to its extensive track record and extremely low cost. Rosuvastatin (generic Crestor) may be preferred in patients with significant drug interactions or who need maximum LDL reduction at lower doses. The choice often comes down to individual response, tolerability, and cost. Many patients do equally well on either medication.`,
    faq: [
      { q: "Which is stronger, Lipitor or Crestor?", a: "Crestor (rosuvastatin) is more potent per milligram. However, both achieve similar maximum LDL reductions at their respective highest doses (around 50-55% LDL reduction)." },
      { q: "Is there a generic for Lipitor and Crestor?", a: "Yes, both have affordable generics. Atorvastatin (generic Lipitor) and rosuvastatin (generic Crestor) are available at most pharmacies for $10-20/month or less." },
      { q: "Can Lipitor or Crestor cause muscle pain?", a: "Both statins carry a risk of myopathy (muscle pain/weakness). This is more common at higher doses. Report any unexplained muscle pain to your doctor immediately, as it can rarely progress to rhabdomyolysis." },
      { q: "Which statin has fewer side effects?", a: "Both have similar side effect profiles. Some studies suggest rosuvastatin may cause slightly less muscle-related side effects, but individual responses vary. If you experience side effects on one statin, your doctor may try the other." },
    ],
  },

  "xanax-vs-ativan": {
    overview: `Xanax (alprazolam) and Ativan (lorazepam) are both benzodiazepines prescribed for anxiety disorders and panic disorder. They work by enhancing the effect of GABA, the brain's primary inhibitory neurotransmitter, producing sedative, anxiolytic, and muscle-relaxant effects. Xanax acts faster (onset within 15-30 minutes) but has a shorter half-life (6-12 hours), making it commonly prescribed for acute panic attacks. Ativan has a slightly longer duration (10-20 hours) and is preferred in clinical settings for procedures, status epilepticus, and alcohol withdrawal. Both are Schedule IV controlled substances with significant potential for dependence and withdrawal — they should not be stopped abruptly after prolonged use. Both have generic versions available.`,
    keyPoints: [
      "Both are benzodiazepines — same class, different potency and duration",
      "Xanax acts faster (15-30 min) with shorter duration (6-12 hrs)",
      "Ativan has longer duration (10-20 hrs) — often preferred for procedures",
      "Xanax is more potent — alprazolam 0.5 mg ≈ lorazepam 1 mg",
      "Both carry significant dependence and withdrawal risk",
      "Ativan is more commonly used in hospital/clinical settings",
    ],
    recommendation: `Both are short-term treatments for anxiety — neither should be used long-term due to dependence risk. Xanax is often preferred for acute panic attacks due to its rapid onset. Ativan is preferred in medical/clinical settings and for patients who need slightly longer duration. Long-term anxiety management should involve therapy (CBT) and/or SSRIs/SNRIs rather than benzodiazepines. Always work with your doctor to use these medications safely and for the shortest time necessary.`,
    faq: [
      { q: "Is Xanax stronger than Ativan?", a: "Xanax (alprazolam) is more potent on a per-milligram basis. Approximately 0.5 mg of Xanax is equivalent to 1 mg of Ativan. However, potency doesn't mean one is 'better' — the right choice depends on your specific needs." },
      { q: "Which works faster, Xanax or Ativan?", a: "Xanax generally works faster, with effects felt within 15-30 minutes. Ativan also works quickly (within 30-60 minutes) but Xanax's onset is typically slightly faster." },
      { q: "Are Xanax and Ativan addictive?", a: "Yes, both benzodiazepines carry significant risk of physical and psychological dependence, especially with regular use over several weeks. They should only be used as prescribed and not stopped abruptly." },
      { q: "Can you switch from Xanax to Ativan?", a: "Yes, switching is possible under medical supervision. Your doctor will calculate equivalent doses and may taper one while introducing the other to minimize withdrawal symptoms." },
    ],
  },

  "prozac-vs-zoloft": {
    overview: `Prozac (fluoxetine) and Zoloft (sertraline) are both selective serotonin reuptake inhibitors (SSRIs) and two of the most prescribed antidepressants worldwide. Prozac was the first SSRI approved by the FDA in 1987 and revolutionized depression treatment, while Zoloft followed in 1991. Both work by preventing the reabsorption of serotonin in the brain, but they differ in their half-life, approved indications, and side effect profiles. Prozac has an exceptionally long half-life (1-4 days, active metabolite up to 16 days), making it more forgiving if doses are missed and reducing discontinuation syndrome. Zoloft has a shorter half-life (26 hours) and is approved for more conditions, including PTSD and PMDD. Both have inexpensive generic versions.`,
    keyPoints: [
      "Prozac has an extremely long half-life (days) — very forgiving if doses are missed",
      "Zoloft is approved for more conditions: depression, OCD, PTSD, panic, PMDD, social anxiety",
      "Prozac approved for: depression, OCD, panic disorder, bulimia, bipolar depression (with olanzapine)",
      "Zoloft causes more GI side effects initially; Prozac may cause more insomnia/agitation",
      "Both have very affordable generics (fluoxetine and sertraline)",
      "Prozac least likely of SSRIs to cause discontinuation syndrome due to long half-life",
    ],
    recommendation: `Prozac is often preferred when patients have concerns about missing doses or stopping abruptly, due to its long half-life. Zoloft's broader range of FDA approvals makes it versatile for patients with comorbid anxiety disorders or PTSD. Both are first-line treatments for depression and anxiety. The best choice is highly individual — many patients switch between SSRIs before finding the one that works best for them with the fewest side effects.`,
    faq: [
      { q: "Is Prozac or Zoloft better for depression?", a: "Both are equally effective for depression in clinical trials. The best choice depends on individual factors like other conditions being treated, side effect tolerance, and how you respond to each medication." },
      { q: "Which is better for anxiety, Prozac or Zoloft?", a: "Zoloft has more FDA-approved anxiety indications (social anxiety, PTSD, panic disorder). However, Prozac is also widely used for anxiety off-label. Your diagnosis will help guide the choice." },
      { q: "Can you switch from Prozac to Zoloft?", a: "Yes, switching SSRIs is common. Due to Prozac's long half-life, the transition may be simpler — you can sometimes switch directly without a taper. Your doctor will guide the safest approach." },
      { q: "Does Prozac or Zoloft cause more weight gain?", a: "Both can cause modest weight gain with long-term use, though this is less pronounced than older antidepressants. Zoloft may cause slightly more weight gain on average, but individual responses vary significantly." },
    ],
  },

  "cialis-vs-viagra": {
    overview: `Cialis (tadalafil) and Viagra (sildenafil) are both PDE5 inhibitors prescribed for erectile dysfunction (ED) and are the two most widely recognized ED medications in the world. Both work by relaxing smooth muscle and increasing blood flow to the penis, enabling an erection in response to sexual stimulation. The key practical difference is duration: Viagra typically works for 4-6 hours and should be taken 30-60 minutes before sexual activity, while Cialis lasts up to 36 hours — earning it the nickname "the weekend pill" — and is also available as a once-daily low-dose option. Both have affordable generic versions. Tadalafil (generic Cialis) is also FDA-approved for benign prostatic hyperplasia (BPH) and pulmonary arterial hypertension.`,
    keyPoints: [
      "Cialis lasts up to 36 hours; Viagra lasts 4-6 hours",
      "Cialis available as daily low-dose (2.5-5 mg) for spontaneous use",
      "Viagra typically taken 30-60 min before; Cialis 30 min to 2 hrs before",
      "Both have affordable generics: sildenafil and tadalafil",
      "Tadalafil (Cialis) also treats enlarged prostate (BPH)",
      "Food does not significantly affect Cialis; high-fat meals can reduce Viagra effectiveness",
    ],
    recommendation: `Cialis is often preferred for its flexibility — the 36-hour window allows for spontaneity without timing a pill precisely. The daily low-dose option is popular for men who have sex more than twice weekly or want to avoid planning around a dose. Viagra works faster and may be preferred by men who want a shorter duration. Both are highly effective. The choice often comes down to personal preference, lifestyle, and how the medication fits into your routine. Generics for both are now available at very low cost.`,
    faq: [
      { q: "How long does Cialis last compared to Viagra?", a: "Cialis (tadalafil) lasts up to 36 hours, while Viagra (sildenafil) lasts 4-6 hours. This longer window gives Cialis its reputation as the 'weekend pill.'" },
      { q: "Is there a generic for Cialis and Viagra?", a: "Yes, both have affordable generics. Sildenafil (generic Viagra) and tadalafil (generic Cialis) are widely available and significantly cheaper than brand-name versions." },
      { q: "Can I take Cialis daily?", a: "Yes, Cialis is available in a daily low-dose formulation (2.5 mg or 5 mg) that is taken every day at the same time, eliminating the need to plan around sexual activity." },
      { q: "Which is more effective, Cialis or Viagra?", a: "Both are approximately equally effective, with clinical trials showing 60-80% success rates. The 'better' medication is highly individual — some men respond better to one over the other." },
    ],
  },

  "synthroid-vs-levothyroxine": {
    overview: `Synthroid and levothyroxine are both thyroid hormone replacement medications used to treat hypothyroidism (underactive thyroid) and thyroid cancer. They contain the same active ingredient — synthetic T4 (thyroxine) — but Synthroid is the brand-name version manufactured by AbbVie, while levothyroxine is the generic. This makes Synthroid one of the relatively rare cases where a brand-name drug and its generic contain literally identical active ingredients, yet some patients and physicians have historically reported differences in clinical outcomes. The FDA considers all levothyroxine products bioequivalent, though slight variations in inactive ingredients between manufacturers can sometimes affect absorption. Consistency of brand or manufacturer is considered important for stable thyroid hormone levels.`,
    keyPoints: [
      "Same active ingredient (synthetic T4/thyroxine) — brand vs generic",
      "The FDA considers them bioequivalent, but inactive ingredients differ between manufacturers",
      "Synthroid costs significantly more than generic levothyroxine",
      "Thyroid specialists often recommend staying consistent with one brand/manufacturer",
      "Taken on an empty stomach, 30-60 minutes before breakfast for best absorption",
      "Dosing requires regular TSH blood tests to ensure optimal levels",
    ],
    recommendation: `For most patients, generic levothyroxine works just as well as Synthroid and costs significantly less. The key is consistency — if you start on Synthroid, stay on it; if you start on generic, stay with the same manufacturer. Switching between products can cause fluctuations in TSH levels. If your thyroid levels are well-controlled on generic levothyroxine, there is typically no need to switch to the more expensive brand-name Synthroid. Your endocrinologist can advise based on your specific response to treatment.`,
    faq: [
      { q: "Is Synthroid better than generic levothyroxine?", a: "The FDA considers them bioequivalent. Most patients do equally well on generic levothyroxine. Some patients report better symptom control on Synthroid, though this is not consistently proven in clinical trials." },
      { q: "Why do some doctors prefer Synthroid over generic?", a: "Some endocrinologists prefer Synthroid for its consistent manufacturing standards and because the inactive ingredients have not changed over time, reducing variability between refills." },
      { q: "Can I switch from Synthroid to generic levothyroxine?", a: "You can switch, but your doctor should recheck your TSH levels 6-8 weeks after switching to ensure your thyroid levels remain stable. Don't switch without medical supervision." },
      { q: "How much cheaper is levothyroxine than Synthroid?", a: "Generic levothyroxine can cost as little as $10-15/month at most pharmacies, while brand-name Synthroid can cost $50-100/month or more without insurance." },
    ],
  },

  "lisinopril-vs-losartan": {
    overview: `Lisinopril and losartan are both first-line antihypertensive (blood pressure-lowering) medications widely prescribed for hypertension, heart failure, and kidney disease protection in diabetics. Lisinopril is an ACE inhibitor that works by blocking the angiotensin-converting enzyme, preventing the production of angiotensin II. Losartan is an angiotensin receptor blocker (ARB) that works by directly blocking angiotensin II receptors. While their clinical outcomes for blood pressure reduction and cardiovascular protection are similar, their tolerability profiles differ: ACE inhibitors like lisinopril commonly cause a persistent dry cough in 10-15% of patients, while ARBs like losartan generally do not. Losartan is often prescribed as an alternative when patients cannot tolerate the cough from lisinopril. Both are available as very affordable generics.`,
    keyPoints: [
      "Lisinopril is an ACE inhibitor; losartan is an ARB — different mechanisms, similar outcomes",
      "Lisinopril causes a persistent dry cough in 10-15% of patients; losartan does not",
      "Both protect kidneys in diabetic patients — key reason for use in diabetes",
      "Losartan additionally has evidence for reducing gout attacks (uricosuric effect)",
      "Both are very affordable as generics — often under $10/month",
      "Both are contraindicated in pregnancy (can cause fetal harm)",
    ],
    recommendation: `Lisinopril is often tried first due to its long track record and extremely low cost. If you develop a persistent dry cough (a common side effect), your doctor will typically switch you to losartan or another ARB. For patients with gout alongside high blood pressure, losartan may be preferred as it also has uric acid-lowering properties. Both are excellent first-line options for hypertension, heart failure, and diabetic kidney protection. The decision often comes down to side effects rather than effectiveness.`,
    faq: [
      { q: "Which is better for blood pressure, lisinopril or losartan?", a: "Both are equally effective for blood pressure reduction. They are considered interchangeable in terms of cardiovascular outcomes. The main difference is their side effect profiles." },
      { q: "Why does lisinopril cause a cough but losartan doesn't?", a: "Lisinopril (ACE inhibitor) blocks an enzyme that breaks down bradykinin, causing bradykinin to accumulate and irritate the throat — leading to a dry cough. Losartan (ARB) works at a different point in the pathway and does not cause bradykinin accumulation." },
      { q: "Can I switch from lisinopril to losartan?", a: "Yes, this is a very common switch when patients develop ACE-inhibitor cough. Your doctor will start you on an equivalent dose and monitor your blood pressure response." },
      { q: "Are lisinopril and losartan safe for kidney disease?", a: "Yes, both are specifically recommended for patients with diabetic kidney disease as they reduce proteinuria and slow progression of kidney damage. However, they require monitoring of kidney function and potassium levels." },
    ],
  },
};

export function getCompareContent(slug: string): CompareContent | null {
  return content[slug] ?? null;
}

// Generate dynamic content for pairs not in the static list
export function getDynamicCompareContent(
  nameA: string, classA: string | undefined, usedForA: string[],
  nameB: string, classB: string | undefined, usedForB: string[],
  sameClass: boolean, sameGeneric: boolean
): CompareContent {
  const sameClassText = sameClass
    ? `Both ${nameA} and ${nameB} belong to the ${classA} drug class and work through similar mechanisms.`
    : `${nameA} (${classA ?? "medication"}) and ${nameB} (${classB ?? "medication"}) belong to different drug classes and work through different mechanisms.`;

  const usesA = usedForA.slice(0, 3).join(", ") || "various conditions";
  const usesB = usedForB.slice(0, 3).join(", ") || "various conditions";

  return {
    overview: `${nameA} and ${nameB} are both prescription medications used in clinical practice. ${sameClassText} ${nameA} is commonly used for ${usesA}, while ${nameB} is used for ${usesB}. ${sameGeneric ? "Both medications contain the same active ingredient." : "They differ in their active ingredients and may have different side effect profiles, dosing schedules, and drug interactions."} As with all medications, your doctor will determine which is most appropriate based on your medical history, other medications, and specific health goals.`,
    keyPoints: [
      sameClass ? `Same drug class: ${classA}` : `${nameA} class: ${classA ?? "—"} | ${nameB} class: ${classB ?? "—"}`,
      `${nameA} used for: ${usesA}`,
      `${nameB} used for: ${usesB}`,
      sameGeneric ? "Same active ingredient — brand vs generic or different formulations" : "Different active ingredients",
      "Consult your doctor before switching between these medications",
      "Individual response, tolerability, and cost affect the best choice",
    ],
    recommendation: `The best choice between ${nameA} and ${nameB} depends on your specific diagnosis, medical history, other medications, and individual response to treatment. ${sameClass ? `Since both are ${classA} medications, your doctor may try one before the other based on your profile.` : "Since they belong to different drug classes, your doctor will recommend one based on your specific condition and health goals."} Always work with your healthcare provider to find the medication that gives you the best results with the fewest side effects.`,
    faq: [
      { q: `What is the difference between ${nameA} and ${nameB}?`, a: `${nameA} and ${nameB} differ in their ${sameClass ? "specific indications, dosing, and side effect profiles" : "drug class, mechanism of action, and approved uses"}. Your doctor can explain which is more appropriate for your condition.` },
      { q: `Can I switch from ${nameA} to ${nameB}?`, a: `Switching between medications should always be done under medical supervision. Your doctor will guide the transition and monitor your response to ensure your condition remains well-managed.` },
      { q: `Which is cheaper, ${nameA} or ${nameB}?`, a: `Pricing varies by pharmacy, insurance, and whether generic versions are available. Use the GoodRx or cost-comparison tools above to find the best price in your area.` },
      { q: `Are ${nameA} and ${nameB} safe to take together?`, a: `Whether these medications can be taken together depends on their mechanisms and your medical conditions. Never combine prescription medications without explicit guidance from your doctor or pharmacist.` },
    ],
  };
}
