// Rich SEO content for top drug pages

export type DrugContent = {
  overview: string;
  howItWorks: string;
  keyFacts: string[];
  whoIsItFor: string;
};

const content: Record<string, DrugContent> = {
  ozempic: {
    overview: `Ozempic (semaglutide) is a once-weekly injectable prescription medication manufactured by Novo Nordisk. It belongs to the GLP-1 receptor agonist class and was FDA-approved in 2017 for improving blood sugar control in adults with type 2 diabetes, alongside diet and exercise. In 2021, the FDA also approved it to reduce the risk of major cardiovascular events — such as heart attack and stroke — in adults with type 2 diabetes and established cardiovascular disease. Ozempic has gained widespread recognition due to its notable weight loss side effect, which led to the development of Wegovy (a higher-dose semaglutide) specifically for obesity treatment.`,
    howItWorks: `Ozempic mimics the GLP-1 hormone that is naturally released after eating. It stimulates the pancreas to release insulin when blood sugar is high, suppresses glucagon (which raises blood sugar), slows the rate at which food leaves the stomach (gastric emptying), and signals the brain to reduce appetite. Together, these effects lower blood sugar levels and contribute to weight loss.`,
    keyFacts: [
      "Once-weekly subcutaneous injection — same day each week",
      "Starting dose: 0.25 mg/week for 4 weeks, then 0.5 mg/week",
      "Maximum dose: 2 mg/week",
      "Average A1C reduction: 1.5-2.0 percentage points",
      "Average weight loss: 6-8% of body weight",
      "Pen injected into abdomen, thigh, or upper arm",
    ],
    whoIsItFor: `Ozempic is prescribed for adults with type 2 diabetes who need better blood sugar control, particularly those who also have cardiovascular disease or risk factors. It is not for type 1 diabetes. It may be used alone or with other diabetes medications like metformin. People who have a personal or family history of medullary thyroid carcinoma or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2) should not use Ozempic.`,
  },

  wegovy: {
    overview: `Wegovy (semaglutide 2.4 mg) is a once-weekly injectable prescription medication FDA-approved in June 2021 for chronic weight management in adults with obesity (BMI ≥30) or overweight (BMI ≥27) with at least one weight-related health condition such as high blood pressure, type 2 diabetes, or high cholesterol. Manufactured by Novo Nordisk, it contains the same active ingredient as Ozempic but at a higher dose. In the landmark STEP clinical trial program, patients on Wegovy lost an average of 15% of their body weight over 68 weeks — the most significant weight loss seen with any approved medication at the time of its approval.`,
    howItWorks: `Wegovy activates GLP-1 receptors in the brain's appetite-regulation centers, dramatically reducing hunger and food cravings. It also slows gastric emptying, meaning food stays in the stomach longer and you feel full faster. At the higher 2.4 mg dose approved for weight management, these appetite-suppressing effects are more pronounced than at the lower doses used for diabetes treatment.`,
    keyFacts: [
      "Once-weekly subcutaneous injection",
      "Dose escalates over 16-20 weeks to minimize GI side effects",
      "Maximum dose: 2.4 mg/week",
      "Average weight loss in trials: ~15% of body weight over 68 weeks",
      "Must be combined with reduced-calorie diet and increased activity",
      "FDA-approved for adults with BMI ≥30, or ≥27 with weight-related condition",
    ],
    whoIsItFor: `Wegovy is for adults struggling with obesity or overweight who have not achieved adequate weight loss through diet and exercise alone, and who have a BMI of 30 or higher, or 27 or higher with a weight-related condition. It is not a substitute for lifestyle changes — it works best alongside a reduced-calorie diet and increased physical activity. It is not indicated for type 1 diabetes or cosmetic weight loss.`,
  },

  adderall: {
    overview: `Adderall is a brand-name prescription medication containing a mixture of amphetamine salts — specifically 75% dextroamphetamine and 25% levoamphetamine. It is FDA-approved for the treatment of Attention-Deficit/Hyperactivity Disorder (ADHD) in children (aged 3 and older) and adults, and for narcolepsy. As one of the most prescribed ADHD medications in the United States, Adderall is available in two formulations: immediate-release (IR) tablets lasting 4-6 hours, and extended-release capsules (Adderall XR) lasting 8-12 hours. It is classified as a Schedule II controlled substance due to its high potential for abuse and dependence.`,
    howItWorks: `Adderall increases the levels of dopamine and norepinephrine in the brain by stimulating their release and blocking their reabsorption. In people with ADHD, this helps normalize activity in the prefrontal cortex — the brain region responsible for attention, impulse control, and executive function. The result is improved focus, reduced impulsivity, and better ability to organize and complete tasks.`,
    keyFacts: [
      "Available as immediate-release (4-6 hrs) and XR extended-release (8-12 hrs)",
      "Schedule II controlled substance — requires written prescription",
      "Generic available: amphetamine mixed salts (significantly cheaper)",
      "FDA-approved for ADHD starting at age 3; also approved for narcolepsy",
      "Should not be taken with MAOIs or within 14 days of stopping an MAOI",
      "Common side effects: decreased appetite, insomnia, increased heart rate",
    ],
    whoIsItFor: `Adderall is prescribed for children (3+), adolescents, and adults with ADHD. It is also used for narcolepsy. It is not appropriate for people with heart conditions, hyperthyroidism, glaucoma, agitated states, or history of drug abuse. A thorough medical evaluation including cardiovascular assessment is required before starting Adderall.`,
  },

  vyvanse: {
    overview: `Vyvanse (lisdexamfetamine dimesylate) is a prescription central nervous system stimulant that is FDA-approved for ADHD in children (aged 6 and older) and adults, and for moderate-to-severe binge eating disorder (BED) in adults — the only ADHD stimulant with this second approval. Made by Takeda Pharmaceuticals, Vyvanse is a prodrug, meaning it is pharmacologically inactive until the body converts it to dextroamphetamine through enzymatic activity in red blood cells. This design provides a smooth, gradual onset and extended duration of 10-14 hours, and significantly reduces the potential for abuse compared to traditional amphetamines since it cannot be crushed and snorted to get an immediate rush.`,
    howItWorks: `After ingestion, lisdexamfetamine is hydrolyzed (broken down) in the bloodstream to produce active dextroamphetamine. This gradual conversion results in a steady increase in dopamine and norepinephrine levels in the brain, improving attention, impulse control, and executive function in ADHD. The smooth pharmacokinetic profile means fewer peaks and crashes compared to immediate-release stimulants.`,
    keyFacts: [
      "Prodrug design: converts to dextroamphetamine in the body",
      "Duration: 10-14 hours — longest among common ADHD stimulants",
      "Schedule II controlled substance",
      "Generic (lisdexamfetamine) now available as of 2023",
      "Also FDA-approved for binge eating disorder (BED) in adults",
      "Lower abuse potential than traditional amphetamines due to prodrug design",
    ],
    whoIsItFor: `Vyvanse is prescribed for children aged 6 and older and adults with ADHD who need all-day symptom control. It is also prescribed for adults with moderate-to-severe binge eating disorder. It is not appropriate for people with heart disease, structural heart abnormalities, hyperthyroidism, glaucoma, or history of substance abuse. The long duration makes it particularly suitable for students, professionals, and others needing focus throughout a full work or school day.`,
  },

  metformin: {
    overview: `Metformin is a biguanide oral medication and the most widely prescribed drug for type 2 diabetes worldwide. Available as an affordable generic since the 1990s, it has been a cornerstone of type 2 diabetes management for decades and is recommended as first-line therapy by the American Diabetes Association (ADA), the American Association of Clinical Endocrinologists, and most international diabetes guidelines. Beyond blood sugar control, metformin has shown benefits for weight management (weight-neutral to modest weight loss), cardiovascular outcomes, and has been studied for potential roles in cancer prevention and longevity. It comes in regular and extended-release (XR) formulations.`,
    howItWorks: `Metformin primarily works by reducing glucose production in the liver (hepatic gluconeogenesis), which is often elevated in type 2 diabetes. It also improves the sensitivity of muscle and fat cells to insulin (insulin sensitization), allowing more glucose to enter cells rather than accumulating in the bloodstream. Unlike some diabetes medications, metformin does not stimulate insulin secretion, which means it does not cause hypoglycemia (low blood sugar) when used alone.`,
    keyFacts: [
      "First-line medication for type 2 diabetes per ADA guidelines",
      "Very affordable generic — often under $10/month",
      "Does not cause hypoglycemia when used alone",
      "Weight-neutral or modest weight loss effect",
      "Must be stopped before contrast dye procedures (CT scans)",
      "Available in regular and extended-release formulations",
    ],
    whoIsItFor: `Metformin is the standard first-line medication for most newly diagnosed type 2 diabetes patients, particularly those who are overweight or obese. It is also used for prediabetes and polycystic ovary syndrome (PCOS). It is not appropriate for people with severe kidney disease (eGFR <30), liver disease, or conditions that increase lactic acidosis risk. It should be used cautiously in people over 65 and those with heart failure.`,
  },

  lisinopril: {
    overview: `Lisinopril is an ACE (angiotensin-converting enzyme) inhibitor and one of the most prescribed medications in the United States. It is used to treat high blood pressure (hypertension), heart failure, and to protect the kidneys in patients with diabetic nephropathy. It is also used after heart attacks to improve survival. Available as an inexpensive generic, lisinopril has a strong evidence base accumulated over more than 30 years of widespread use. It is taken once daily and provides 24-hour blood pressure control.`,
    howItWorks: `Lisinopril blocks the angiotensin-converting enzyme (ACE), which is responsible for converting angiotensin I to angiotensin II — a potent vasoconstrictor. By reducing angiotensin II levels, lisinopril causes blood vessels to relax and widen (vasodilation), which lowers blood pressure and reduces the workload on the heart. This mechanism also reduces fluid retention and decreases protein leakage in the kidneys.`,
    keyFacts: [
      "Once-daily dosing for 24-hour blood pressure control",
      "Very affordable generic — often $4-10/month",
      "10-15% of patients develop a persistent dry cough (ACE inhibitor cough)",
      "Contraindicated in pregnancy — can cause fetal harm",
      "Protects kidneys in diabetic patients",
      "Can rarely cause angioedema — seek emergency care if throat/face swells",
    ],
    whoIsItFor: `Lisinopril is prescribed for adults with high blood pressure, heart failure, post-heart attack recovery, and diabetic kidney disease. It is especially valuable in patients with both diabetes and hypertension due to its kidney-protective effects. People who are pregnant, have a history of angioedema, or cannot tolerate the ACE-inhibitor cough should not use lisinopril — an ARB like losartan is typically the alternative.`,
  },

  atorvastatin: {
    overview: `Atorvastatin is a high-intensity statin and one of the most prescribed medications globally. Sold under the brand name Lipitor (now widely available as a generic), it is used to lower LDL (bad) cholesterol, raise HDL (good) cholesterol, lower triglycerides, and most importantly, reduce the risk of cardiovascular events — heart attacks, strokes, and cardiovascular death — in high-risk patients. Atorvastatin is highly effective, with the ability to reduce LDL cholesterol by 40-60% depending on dose. It has decades of clinical trial evidence supporting its cardiovascular benefits.`,
    howItWorks: `Atorvastatin inhibits HMG-CoA reductase, the enzyme that controls the rate of cholesterol production in the liver. By reducing cholesterol synthesis, it forces liver cells to increase the number of LDL receptors on their surface, which removes more LDL from the bloodstream. This dual effect — less production and more clearance — results in substantially lower LDL levels.`,
    keyFacts: [
      "Can reduce LDL by 40-60% depending on dose (10-80 mg)",
      "Available as affordable generic atorvastatin",
      "Taken once daily — can be taken at any time of day",
      "Cardiovascular benefits beyond cholesterol lowering (pleiotropic effects)",
      "Small risk of muscle pain (myopathy) — report to doctor immediately",
      "Rare risk of liver problems — liver function monitored periodically",
    ],
    whoIsItFor: `Atorvastatin is recommended for people with high LDL cholesterol, cardiovascular disease, diabetes with cardiovascular risk factors, or a high 10-year cardiovascular risk score. It is prescribed based on risk assessment rather than cholesterol numbers alone. It is not appropriate for people with active liver disease or pregnancy. People over 75 are assessed individually for risk vs benefit.`,
  },

  sertraline: {
    overview: `Sertraline, sold under the brand name Zoloft, is a selective serotonin reuptake inhibitor (SSRI) and one of the most commonly prescribed antidepressants in the United States. It is FDA-approved for six conditions: major depressive disorder (MDD), obsessive-compulsive disorder (OCD), panic disorder, post-traumatic stress disorder (PTSD), social anxiety disorder, and premenstrual dysphoric disorder (PMDD). Available as an affordable generic, sertraline is considered a first-line treatment for depression and anxiety disorders. It typically takes 4-6 weeks of consistent use to experience the full therapeutic benefit.`,
    howItWorks: `Sertraline selectively blocks the serotonin transporter (SERT), preventing the reuptake (reabsorption) of serotonin from the synaptic cleft back into the presynaptic neuron. This increases the concentration of serotonin available to bind to receptors on the postsynaptic neuron. The increased serotonin activity in relevant brain circuits is believed to improve mood, reduce anxiety, and normalize emotional regulation over time.`,
    keyFacts: [
      "FDA-approved for 6 conditions — broadest approval of any SSRI",
      "Typically takes 4-6 weeks for full antidepressant effect",
      "Available as very affordable generic sertraline",
      "Do not stop abruptly — taper under medical supervision",
      "Common side effects: nausea (often improves), insomnia, diarrhea, sexual dysfunction",
      "Take with food to reduce nausea",
    ],
    whoIsItFor: `Sertraline is prescribed for adults and children (6+ for OCD; 18+ for other conditions) with depression, anxiety disorders, OCD, PTSD, or PMDD. It is often a first choice due to its broad approvals, good tolerability, and affordability. It is not appropriate for people taking MAOIs, pimozide, or disulfiram oral solution. People with bipolar disorder should be evaluated carefully before starting any antidepressant.`,
  },

  escitalopram: {
    overview: `Escitalopram, sold under the brand name Lexapro, is a selective serotonin reuptake inhibitor (SSRI) widely prescribed for major depressive disorder (MDD) and generalized anxiety disorder (GAD). It is the S-enantiomer of citalopram (Celexa) and is considered the most selective SSRI available, meaning it acts very specifically on the serotonin transporter with minimal off-target effects. This selectivity is associated with fewer drug interactions and good tolerability. Available as a generic, it is considered one of the top first-line treatments for depression and anxiety in multiple clinical guidelines.`,
    howItWorks: `Like other SSRIs, escitalopram blocks the serotonin reuptake transporter (SERT), increasing the amount of serotonin available in synaptic gaps between neurons. Its high selectivity for SERT means it has minimal effects on other receptors, contributing to its favorable side effect profile compared to older antidepressants and even some other SSRIs.`,
    keyFacts: [
      "FDA-approved for depression and generalized anxiety disorder",
      "Considered most selective SSRI — fewer drug interactions",
      "Available as affordable generic escitalopram",
      "Once-daily dosing: 10-20 mg",
      "Typically takes 2-4 weeks for initial effects, 4-8 weeks for full benefit",
      "Avoid abrupt discontinuation — taper under medical supervision",
    ],
    whoIsItFor: `Escitalopram is prescribed for adults and adolescents (12+) with major depressive disorder, and adults with generalized anxiety disorder. Its clean drug interaction profile makes it a preferred choice for elderly patients or those taking multiple medications. It is not appropriate for people currently taking MAOIs or with a QT prolongation history at higher doses.`,
  },

  alprazolam: {
    overview: `Alprazolam, sold under the brand name Xanax, is a benzodiazepine prescribed for anxiety disorders and panic disorder. It is one of the most prescribed psychiatric medications in the United States. Alprazolam acts quickly (onset within 15-30 minutes) and provides short-term relief from anxiety symptoms. It is available in immediate-release and extended-release (Xanax XR) formulations. As a Schedule IV controlled substance, it carries significant potential for dependence and withdrawal, and is intended for short-term use. Long-term anxiety management should involve non-benzodiazepine treatments such as SSRIs and cognitive behavioral therapy (CBT).`,
    howItWorks: `Alprazolam enhances the effect of gamma-aminobutyric acid (GABA), the brain's primary inhibitory neurotransmitter. It binds to GABA-A receptors and increases the frequency of chloride channel opening, resulting in enhanced inhibitory signaling throughout the central nervous system. This produces anxiolytic (anti-anxiety), sedative, muscle-relaxant, and anticonvulsant effects.`,
    keyFacts: [
      "Fast-acting: onset within 15-30 minutes",
      "Duration: 4-6 hours (IR), 11 hours (XR)",
      "Schedule IV controlled substance — significant dependence risk",
      "Should not be stopped abruptly after prolonged use — taper required",
      "Available as affordable generic",
      "Dangerous when combined with alcohol or opioids",
    ],
    whoIsItFor: `Alprazolam is prescribed for short-term management of anxiety disorders and panic disorder in adults. It may be used situationally for acute anxiety. It is not appropriate for long-term anxiety management, for people with a history of substance use disorder, during pregnancy, or for people with acute narrow-angle glaucoma. It requires caution in the elderly due to fall risk and cognitive effects.`,
  },

  atorvastatin_lipitor: {
    overview: `Lipitor (atorvastatin) revolutionized cardiovascular medicine when it launched in 1996 and became the best-selling drug in history before going generic in 2011. As a high-intensity statin, it has an unmatched evidence base for reducing cardiovascular events. The landmark ASCOT-LLA and CARDS trials established its benefits not just in secondary prevention (after a heart attack) but also in primary prevention for high-risk patients. Today, affordable generic atorvastatin has made this life-saving medication accessible to nearly everyone who needs it.`,
    howItWorks: `Atorvastatin inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis in the liver. By reducing endogenous cholesterol production, it upregulates LDL receptors on hepatocytes, clearing more LDL from the bloodstream. Beyond lipid effects, statins have pleiotropic benefits including anti-inflammatory effects and plaque stabilization.`,
    keyFacts: [
      "Reduces LDL by 40-60% — highest potency among common statins",
      "Once daily — can be taken at any time with or without food",
      "Available as generic atorvastatin — under $10/month",
      "Also reduces triglycerides and modestly raises HDL",
      "Report unexplained muscle pain to your doctor immediately",
      "Annual liver function monitoring typically recommended",
    ],
    whoIsItFor: `Atorvastatin is prescribed for high cardiovascular risk patients including those with prior heart attack or stroke, diabetes over 40, or a 10-year cardiovascular risk above 7.5-10%. Guidelines recommend it as a high-intensity statin for most patients requiring lipid-lowering therapy. Not appropriate during pregnancy or with active liver disease.`,
  },

  rosuvastatin: {
    overview: `Rosuvastatin, sold under the brand name Crestor (now also available as a generic), is a high-intensity statin and one of the most potent cholesterol-lowering medications available. It was FDA-approved in 2003 and is unique among statins in that it does not rely on the CYP3A4 liver enzyme for metabolism — reducing interactions with common medications like antibiotics, antifungals, and certain heart drugs. The JUPITER trial demonstrated that rosuvastatin significantly reduced cardiovascular events even in patients with normal LDL but elevated high-sensitivity CRP (hsCRP), expanding its use to a broader population.`,
    howItWorks: `Like all statins, rosuvastatin inhibits HMG-CoA reductase to reduce cholesterol synthesis in the liver. Its high potency per milligram means that lower doses can achieve significant LDL reductions. Its hydrophilic (water-soluble) nature compared to other lipophilic statins may contribute to its favorable muscle safety profile.`,
    keyFacts: [
      "Most potent statin per milligram — 10 mg rosuvastatin ≈ 20 mg atorvastatin",
      "Fewer drug interactions than many other statins (not CYP3A4 metabolized)",
      "Available as affordable generic rosuvastatin",
      "Once daily dosing",
      "May slightly increase blood sugar — monitor in diabetic patients",
      "Lower doses recommended in Asian patients due to higher blood levels",
    ],
    whoIsItFor: `Rosuvastatin is prescribed for patients with high LDL cholesterol, cardiovascular disease, or high cardiovascular risk. It is particularly useful for patients on multiple medications due to its favorable drug interaction profile. It is also prescribed for mixed dyslipidemia (high triglycerides + low HDL). Asian patients are started at lower doses. Not appropriate during pregnancy or with active liver disease.`,
  },

  amlodipine: {
    overview: `Amlodipine (brand name Norvasc) is a calcium channel blocker and one of the most widely prescribed blood pressure medications in the world. It works by relaxing blood vessels to lower blood pressure and is used for hypertension and chronic stable angina (chest pain). Amlodipine is a once-daily medication with a very long half-life (~40-60 hours), providing smooth, consistent blood pressure control throughout the day and night. It is well-tolerated by most patients and has a strong evidence base for reducing cardiovascular events.`,
    howItWorks: `Amlodipine blocks L-type voltage-gated calcium channels in the smooth muscle of blood vessel walls. By reducing calcium influx into these cells, it prevents muscle contraction, causing vasodilation (widening of blood vessels). This reduces vascular resistance and lowers blood pressure. In the coronary arteries, this also increases blood flow to the heart, relieving angina.`,
    keyFacts: [
      "Once daily — long half-life provides 24-hour smooth blood pressure control",
      "Available as very affordable generic",
      "Well-tolerated — does not cause cough (unlike ACE inhibitors)",
      "Most common side effect: ankle swelling (pedal edema)",
      "Can be used safely in most patients including those with asthma",
      "Safe during breastfeeding (with caution)",
    ],
    whoIsItFor: `Amlodipine is prescribed for adults with hypertension and/or chronic stable angina. It is a preferred agent for patients with asthma or COPD (unlike beta-blockers), elderly patients, and Black patients. It is safe in kidney disease and liver disease (though dose adjustment may be needed). It is not appropriate during pregnancy.`,
  },

  omeprazole: {
    overview: `Omeprazole (brand name Prilosec) is a proton pump inhibitor (PPI) used to reduce stomach acid production. It is one of the most widely used medications in the world and is available both by prescription and over-the-counter. Omeprazole is used to treat gastroesophageal reflux disease (GERD), stomach ulcers, Zollinger-Ellison syndrome, and to protect the stomach lining in patients taking NSAIDs. It provides more effective and longer-lasting acid suppression than antacids or H2 blockers like Pepcid (famotidine).`,
    howItWorks: `Omeprazole irreversibly inhibits the H+/K+ ATPase enzyme (the "proton pump") on the surface of gastric parietal cells — the final step in stomach acid production. By blocking this pump, it reduces acid secretion by up to 95%, providing long-lasting relief from acid-related conditions. Maximum effect is reached after 3-4 days of regular use.`,
    keyFacts: [
      "Available OTC (20 mg) and by prescription (up to 40 mg)",
      "Take 30-60 minutes before the first meal of the day for best effect",
      "Maximum acid suppression after 3-4 days of regular use",
      "Long-term use may reduce magnesium and B12 absorption",
      "Should not be used long-term without medical supervision",
      "Generic omeprazole widely available — very affordable",
    ],
    whoIsItFor: `Omeprazole is used for GERD, peptic ulcers, H. pylori infection (as part of combination therapy), Zollinger-Ellison syndrome, and NSAID-induced ulcer prevention. OTC omeprazole is intended for 14-day courses. Long-term prescription use requires regular monitoring for potential side effects including bone density loss, kidney issues, and magnesium deficiency. Not recommended during pregnancy unless clearly needed.`,
  },

  acetaminophen: {
    overview: `Acetaminophen (brand name Tylenol) is one of the most widely used medications in the world — an over-the-counter pain reliever and fever reducer found in hundreds of products from cold medicines to prescription opioid combinations. It is the go-to analgesic for mild to moderate pain and is generally considered safer than NSAIDs (like ibuprofen) for people with stomach problems, kidney disease, or those who cannot take anti-inflammatory medications. Acetaminophen is safe when used as directed but is the leading cause of acute liver failure in the United States when taken in excess — making it critical to follow dosing instructions carefully and avoid combining with alcohol.`,
    howItWorks: `The exact mechanism of acetaminophen is not fully understood, but it is believed to inhibit prostaglandin synthesis in the central nervous system, raising the pain threshold and resetting the hypothalamic thermostat to lower fever. Unlike NSAIDs, it does not significantly inhibit peripheral prostaglandin synthesis, which is why it does not have significant anti-inflammatory properties.`,
    keyFacts: [
      "Maximum adult dose: 4,000 mg per day (3,000 mg recommended for safety)",
      "Do not exceed 1,000 mg per single dose",
      "Found in hundreds of combination products — watch for accidental double-dosing",
      "Avoid alcohol while taking acetaminophen — increases liver toxicity risk",
      "Safe for most people including those who cannot take NSAIDs",
      "Safe during pregnancy (consult doctor) — preferred OTC pain reliever in pregnancy",
    ],
    whoIsItFor: `Acetaminophen is appropriate for most adults and children (at appropriate doses) for mild to moderate pain and fever. It is the preferred OTC pain reliever for people with stomach ulcers, kidney disease, or those taking blood thinners (unlike NSAIDs). It must be used with caution by people with liver disease, chronic alcohol use, or those already taking other products containing acetaminophen (very common in cold/flu medications).`,
  },

  ibuprofen: {
    overview: `Ibuprofen (brand names Advil, Motrin) is a nonsteroidal anti-inflammatory drug (NSAID) used for pain relief, fever reduction, and inflammation. It is one of the most commonly used OTC medications worldwide, available in tablet, capsule, liquid, and topical forms. Unlike acetaminophen, ibuprofen provides true anti-inflammatory effects, making it particularly effective for conditions involving inflammation such as arthritis, muscle strains, sports injuries, menstrual cramps, and dental pain. Prescription-strength ibuprofen (up to 800 mg per dose) is available for more severe pain and inflammatory conditions.`,
    howItWorks: `Ibuprofen inhibits both COX-1 and COX-2 enzymes (cyclooxygenases), which are responsible for producing prostaglandins — chemical messengers that cause pain, fever, and inflammation. By reducing prostaglandin synthesis both centrally and peripherally, ibuprofen provides analgesic, antipyretic, and anti-inflammatory effects. The inhibition of COX-1 also reduces protective prostaglandins in the stomach lining, which is why it can cause GI irritation.`,
    keyFacts: [
      "OTC dose: 200-400 mg every 4-6 hours (max 1,200 mg/day OTC)",
      "Prescription doses up to 800 mg per dose, 3,200 mg/day",
      "Take with food or milk to reduce stomach irritation",
      "Provides anti-inflammatory effects that acetaminophen does not",
      "Avoid in kidney disease, stomach ulcers, and third trimester pregnancy",
      "Risk of cardiovascular events increases with long-term use",
    ],
    whoIsItFor: `Ibuprofen is appropriate for adults and children (6 months+) for pain, fever, and inflammation. It is particularly effective for inflammatory conditions, menstrual pain, and musculoskeletal injuries. It should be avoided by people with stomach ulcers, kidney disease, heart failure, late pregnancy, or those taking blood thinners. People over 65 should use it with caution due to increased GI and cardiovascular risks.`,
  },
};

export function getDrugContent(slug: string): DrugContent | null {
  // Try exact slug match first
  if (content[slug]) return content[slug];
  // Try common brand name mappings
  const brandToGeneric: Record<string, string> = {
    tylenol: "acetaminophen",
    advil: "ibuprofen",
    motrin: "ibuprofen",
    lipitor: "atorvastatin",
    crestor: "rosuvastatin",
    zoloft: "sertraline",
    lexapro: "escitalopram",
    xanax: "alprazolam",
    norvasc: "amlodipine",
    prilosec: "omeprazole",
  };
  if (brandToGeneric[slug]) return content[brandToGeneric[slug]] ?? null;
  return null;
}
